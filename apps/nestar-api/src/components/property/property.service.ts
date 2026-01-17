import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Properties, Property } from '../../libs/dto/property/property';
import { AgentPropertiesInquiry, AllPropertiesInquiry, PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import {  Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { ViewService } from '../view/view.service';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import * as moment from 'moment'; 
import { Member } from '../../libs/dto/member/member';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/likes.service';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property')private readonly propertyModel: Model<Property>,
		private memberService: MemberService, //
		private viewService: ViewService,
      private likeService: LikeService,
	) {}

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input); //SCHEAM VALIDATION
			await this.memberService.memberStatsEditor({
				//kutayabmiz hholos kutmasak. result qaytib ketadi amalgga owgan owmagannini bilmaymiz
				_id: result.memberId,
				targetKey: 'memberProperties',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
	// GGGSE

	public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> { //paramretr type Object id 
		const search: T = {//search objecti hosil qilayabmiz 
			_id: propertyId,
			propertyStatus: PropertyStatus.ACTIVE,  //enum orqali activelarni belgilayabmiz
		};

		const targetProperty: Property = await this.propertyModel.findOne(search).lean().exec();
		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = {	memberId: memberId,	viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY,};//1 object hosil qilib

			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.propertyStatsEditor({
					_id: propertyId,
					targetKey: 'propertyViews',
					modifier: 1,
				});
				targetProperty.propertyViews++; //databasega borib kelib boldi frontendga qaytarishimiz uchun
			}

			// meLiked
		}
		targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId); // NULL +> property kim qoshgan malumoti
		return targetProperty;
	}
	public async propertyStatsEditor(input: StatisticModifier): Promise<Property> {
		const { _id, targetKey, modifier } = input;
		return await this.propertyModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}



public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
  let { propertyStatus, soldAt, deletedAt } = input;

  const search: T = {
    _id: input._id,
    memberId: memberId,//kim property qoshgan bolsa owani ozgina ozgarta olishi mumkin
    propertyStatus: PropertyStatus.ACTIVE,
  };

  if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
  else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

  const result = await this.propertyModel
    .findOneAndUpdate(search, input, {
      new: true,
    })
    .exec();

  if (!result)
    throw new InternalServerErrorException(Message.UPDATE_FAILED);

  if (soldAt || deletedAt) {
    await this.memberService.memberStatsEditor({
      _id: memberId,
      targetKey: 'memberProperties',
      modifier: -1,// sold yoki delete bolganda propertylar sonini kamaytiramiz
    });
  }

  return result;
}



public async getProperties(memberId: ObjectId, input: PropertiesInquiry): Promise<Properties> {
  const match: T = { propertyStatus: PropertyStatus.ACTIVE };
  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC }; // KEY  DYNAMIK OBJEKT ICHHIDA HOSIL QILAYABMIZ  array sababi key hosil qilayabmiz 

  this.shapeMatchQuery(match, input);
  console.log('match:', match);

  const result = await this.propertyModel
    .aggregate([
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            // meLiked
            lookupMember,
            { $unwind: '$memberData' },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ])
    .exec();

  if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

  return result[0];
}

private shapeMatchQuery(match: T, input: PropertiesInquiry): void {
  const {
    memberId,
    locationList,
    roomsList,
    bedsList,
    typeList,
    periodsRange,
    pricesRange,
    squaresRange,
    options,
    text,
  } = input.search;

  if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
  if (locationList) match.propertyLocation = { $in: locationList };
  if (roomsList) match.propertyRooms = { $in: roomsList };//IN include  SEOUL YOKI BUSAN BOLSA BER YOKI BERMA
  if (bedsList) match.propertyBeds = { $in: bedsList };
  if (typeList) match.propertyType = { $in: typeList };

  if (pricesRange) match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
  if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };
  if (squaresRange) match.propertySquare = { $gte: squaresRange.start, $lte: squaresRange.end };

  if (text) match.propertyTitle = { $regex: new RegExp(text, 'i') };
  if (options) {
    match['$or'] = options.map((ele) => {
      return { [ele]: true };
    });
  }
}


  //LIKE 

    public async likeTargetProperty(memberId: ObjectId, likeRefId: ObjectId): Promise<Property> {
    const target: Property = await this.propertyModel.findOne({ _id: likeRefId, propertyStatus: PropertyStatus.ACTIVE }).exec();
    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.PROPERTY,
    };

    //LIKE TOGGLE via like moduless -1 +1
   		const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.propertyStatsEditor({ _id: likeRefId, targetKey: 'propertyLikes', modifier: modifier });

    if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;
  }
  
  

// AGENT PROPERTIES
public async getAgentProperties(memberId: ObjectId, input: AgentPropertiesInquiry ): Promise<Properties> { 
  const { propertyStatus } = input.search;
  if (propertyStatus === PropertyStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

const match: T = {
  memberId: shapeIntoMongoObjectId(memberId),
  propertyStatus: propertyStatus ?? { $ne: PropertyStatus.DELETE },
};

  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

  const result = await this.propertyModel
    .aggregate([
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            lookupMember,
            { $unwind: '$memberData' },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ])
    .exec();

  if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  return result[0];
}

public async getAllPropertiesByAdmin(input: AllPropertiesInquiry): Promise<Properties> {
  const { propertyStatus, propertyLocationList } = input.search;
  const match: T = {};
  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

  if (propertyStatus) match.propertyStatus = propertyStatus;
  if (propertyLocationList) match.propertyLocation = { $in: propertyLocationList };

  const result = await this.propertyModel
    .aggregate([
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            lookupMember,
            { $unwind: '$memberData' },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ])
    .exec();

  if (!result.length)
    throw new InternalServerErrorException(Message.NO_DATA_FOUND);

  return result[0];
}


public async updatePropertyByAdmin(input: PropertyUpdate): Promise<Property> {
  let { propertyStatus, soldAt, deletedAt } = input;
  const search: T = {
    _id: input._id,
    propertyStatus: PropertyStatus.ACTIVE,
  };

  if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
  else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

  const result = await this.propertyModel
    .findOneAndUpdate(search, input, {
      new: true,
    })
    .exec();

  if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

  if (soldAt || deletedAt) {
    await this.memberService.memberStatsEditor({
      _id: result.memberId,
      targetKey: 'memberProperties',
      modifier: -1,
    });
  }

  return result;
}

public async removePropertyByAdmin(propertyId: ObjectId): Promise<Property> {
  const search: T = { _id: propertyId, propertyStatus: PropertyStatus.DELETE };
  const result = await this.propertyModel.findOneAndDelete(search).exec();
  if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
  return result;
}

}

