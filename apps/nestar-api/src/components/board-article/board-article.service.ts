 import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId  } from 'mongoose';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { AllBoardArticlesInquiry, BoardArticleInput, BoardArticlesInquiry  } from '../../libs/dto/board-article/board-article.input';
import {  Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { ViewGroup } from '../../libs/enums/view.enum';
import { Property } from '../../libs/dto/property/property';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class BoardArticleService {
    propertyModel: any;
	constructor(
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
	) {}

	public async createBoardArticle(memberId: ObjectId, input: BoardArticleInput): Promise<BoardArticle> {
		input.memberId = memberId; //imputni memberId sini kirib kelgan memberId ga teglashtiryapmiz
		try { //Create qilayotganimizda  MONGO DB DA xar xatolik bolishi mumkin shunga try catch ichida yozayabmiz
			//Qolgan yerda data qaytadi update yoki delete  SCHEAM VALIDATION ERROR
			const result = await this.boardArticleModel.create(input);//static method 
			await this.memberService.memberStatsEditor({//memberSer Instencedan  memberStatsEditor chaqirayabmiz  
				_id: memberId, //arg            //OBJECT 1 ta 
				targetKey: 'memberArticles',
				modifier: 1,   
			});
			//memberArticle statistikasini bittaga oshiradi

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getBoardArticle(memberId: ObjectId, articleId: ObjectId): Promise<BoardArticle> { //Async bolganimiz un promisedan boardArticle  qiy qaytaradi
		const search: T = { //object 
			_id: articleId,
			articleStatus: BoardArticleStatus.ACTIVE,
		};

		const targetBoardArticle: BoardArticle = await this.boardArticleModel.findOne(search).lean().exec();//lean briktirayabmiz sababi Board articleni  Modify qilish imkoniyatiga ega bolishimiz kerak. 
		if (!targetBoardArticle) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) { //Agar murojatjimiz Authenticted bolgan bolsa shu mantiq ishga tushadi 
			const viewInput = { memberId: memberId, viewRefId: articleId, viewGroup: ViewGroup.ARTICLE };//VIEW \ NULL korgan bolsa Null Qaytadi kormagan bolsa view qaytadi
			const newView = await this.viewService.recordView(viewInput);
			
			if (newView) {
				await this.boardArticleStatsEditor({ _id: articleId, targetKey: 'articleViews', modifier: 1 });
				targetBoardArticle.articleViews++; //opbject 
			}

			//meLiked
		}

		targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId);//memberData ARTICLENE korgan inson 
		return targetBoardArticle;
	}
  

	public async updateBoardArticle(memberId: ObjectId, input: BoardArticleUpdate): Promise<BoardArticle> {
		const { _id, articleStatus } = input;

		const result = await this.boardArticleModel
			.findOneAndUpdate({ _id: _id, memberId: memberId, articleStatus: BoardArticleStatus.ACTIVE }, input, {//1 obj
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (articleStatus === BoardArticleStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberArticles',
				modifier: -1,
			});
		}

		return result;
	}

	public async getBoardArticles(memberId: ObjectId, input: BoardArticlesInquiry): Promise<BoardArticles> {
		const { articleCategory, text } = input.search;
		const match: T = { articleStatus: BoardArticleStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };//Dynamic key 
		//sortdan Direction celmasa Createfd at -1 boladi

		if (articleCategory) match.articleCategory = articleCategory; //match ga qoshb berayabmiz 
		if (text) match.articleTitle = { $regex: new RegExp(text, 'i') };
		if (input.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}
		console.log('match:', match);
		const result = await this.boardArticleModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [//list ichida Pagiationni amalga oshirayabmiz
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
//Me liked 
							lookupMember,//object  
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],//databasedagi umumiy malumot 
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}




public async removePropertyByAdmin(propertyId: ObjectId): Promise<Property> {
  const search: T = { _id: propertyId, propertyStatus: PropertyStatus.DELETE };
  const result = await this.propertyModel.findOneAndDelete(search).exec();
  if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

  return result;
}

public async boardArticleStatsEditor(input: StatisticModifier): Promise<BoardArticle> {
		const { _id, targetKey, modifier } = input;
		return await this.boardArticleModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}

//========================= Admin Section ========================//


	public async getAllBoardArticlesByAdmin(input: AllBoardArticlesInquiry): Promise<BoardArticles> {
		const { articleStatus, articleCategory } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC }; //Standard sort hosl qilayabmiz 

		if (articleStatus) match.articleStatus = articleStatus; //agar spesific aricle status talab etayotgan bolsa Article statusni matchga yuklayabmiz
		if (articleCategory) match.articleCategory = articleCategory;

		const result = await this.boardArticleModel
			.aggregate([//arrayni talab etadi 
				{ $match: match },//comondalarni  iwlatayabmiz
				{ $sort: sort },//
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },//skip hamda limitni pagination un yaratayabmiz 
							lookupMember,//member malumotlarini  board articlega  lookup qilayabmiz
							{ $unwind: '$memberData' },//[]0 => arrayni objectga 
						],
						metaCounter: [{ $count: 'total' }],//umumiy countni hisoblyabmiz 
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

public async updateBoardArticleByAdmin(input: BoardArticleUpdate): Promise<BoardArticle> {
		const { _id, articleStatus } = input; 

		const result = await this.boardArticleModel
			.findOneAndUpdate({ _id: _id, articleStatus: BoardArticleStatus.ACTIVE }, input, {
               //executing qlib 3 ta rgumentni paste qilayabmiz  1 cisi obj qaysi article  2 inp ozgar article qiy
				new: true, //3 option yangilangan qiymatni  talab etayabmiz 
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (articleStatus === BoardArticleStatus.DELETE) { //deletega ozg qiymati sodir bolgan bolsa
			await this.memberService.memberStatsEditor({
				_id: result.memberId,//board article hosl qilgan member id
				targetKey: 'memberArticles',//unnga tegishli bolgan articleni 
				modifier: -1, //statistikani bittaga kamaytirayabmiz
			});//1filter/ 2.update 3. option
		}

		return result;
	}

	public async removeBoardArticleByAdmin(articleId: ObjectId): Promise<BoardArticle> {
		const search: T = { _id: articleId, articleStatus: BoardArticleStatus.DELETE };//faqatgina deletega ozgargan article larni ochirishga ruxsat berayabmiz
		const result = await this.boardArticleModel.findOneAndDelete(search).exec();//obj arg sif paste qilayabmiz 
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
