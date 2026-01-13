import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { Properties, Property } from '../../libs/dto/property/property';
import { AgentPropertiesInquiry, AllPropertiesInquiry, PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import { MemberType } from '../../libs/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { PropertyUpdate } from '../../libs/dto/property/property.update';

@Resolver()
export class PropertyResolver {
	constructor(private readonly propertyService: PropertyService) {}
	//PIPE INTERSEPTOR(REQ) GUARD
	@Roles(MemberType.AGENT) // AUTHORIZATION
	@UseGuards(RolesGuard)
	@Mutation(() => Property) //create property mutation api
	public async createProperty(
		//property malumotlarini bizga qayttaradi
		@Args('input') input: PropertyInput, //input hamda memberId PARAMETRDTO
		@AuthMember('_id') memberId: ObjectId, // memberId
	): Promise<Property> {
		console.log('Mutation: createProperty');
		input.memberId = memberId; // ACCES TOOKEN ORQALI boytayabmiz memberID  ni frontenddan yubormayabmiz xafsizlik uchun  AGGREGENTGA BOGLIK ISHLAR qilmaslik uchun
		return await this.propertyService.createProperty(input); //tepadagi
	}
	// INTERSEPTOR (Res)
	@UseGuards(WithoutGuard)
	@Query((returns) => Property)
	public async getProperty(
		@Args('propertyId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Query: getProperty');
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.propertyService.getProperty(memberId, propertyId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard) //agentlar graphQl apin ishlat olar ekan 
	@Mutation(() => Property) //create property mutation api
	public async updateProperty(
		//property malumotlarini bizga qayttaradi
		@Args('input') input: PropertyUpdate, //input hamda memberId PARAMETRDTO
		@AuthMember('_id') memberId: ObjectId, //Authda member id ni topib beradi memberId
	): Promise<Property> {
		console.log('Mutation: updateProperty');
		input._id = shapeIntoMongoObjectId(input._id);
       return await this.propertyService.updateProperty(memberId, input);
     }

   @UseGuards(WithoutGuard)
   @Query((returns) => Properties)
   public async getProperties(
   @Args('input') input: PropertiesInquiry,
   @AuthMember('_id') memberId: ObjectId,
   ): Promise<Properties> {
  console.log('Query: getProperties');
  return await this.propertyService.getProperties(memberId, input);
 }


 @Roles(MemberType.AGENT)
@UseGuards(RolesGuard)
@Query((returns) => Properties)
public async getAgentProperties(
  @Args('input') input: AgentPropertiesInquiry,
  @AuthMember('_id') memberId: ObjectId,
): Promise<Properties> {
  console.log('Query: getAgentProperties');
  return await this.propertyService.getAgentProperties(memberId, input);
}


@Roles(MemberType.ADMIN)
@UseGuards(RolesGuard)
@Query(() => Properties)
public async getAllPropertiesByAdmin(
  @Args('input') input: AllPropertiesInquiry,
  @AuthMember('_id') memberId: ObjectId,
): Promise<Properties> {
  console.log('Query: getAllPropertiesByAdmin');
  return await this.propertyService.getAllPropertiesByAdmin(input);
}


@Roles(MemberType.ADMIN)
@UseGuards(RolesGuard)
@Mutation(() => Property)
public async updatePropertyByAdmin(
  @Args('input') input: PropertyUpdate,
): Promise<Property> {
  console.log('Mutation: updatePropertyByAdmin');
  input._id = shapeIntoMongoObjectId(input._id);
  return await this.propertyService.updatePropertyByAdmin(input);
}


@Roles(MemberType.ADMIN)
@UseGuards(RolesGuard)
@Mutation(() => Property)
public async removePropertyByAdmin(
  @Args('propertyId') input: string,
): Promise<Property> {
  console.log('Mutation: removePropertyByAdmin');
  const propertyId = shapeIntoMongoObjectId(input);
  return await this.propertyService.removePropertyByAdmin(propertyId);
}
	}


	