import { Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import { PropertyService } from './property.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import PropertySchema from '../../schemas/Property.model';
import { MemberModule } from '../member/member.module';

@Module({
	//MODULE DECARATORLARNI ORNATIB OLDIK
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Property', //DATABASEDA property collection bilan  iwlash un 
				schema: PropertySchema,//SCHEAM modelni hosil qilib berayabdi
			},
		]),
		AuthModule, //koprik member modelga auth modelni chaqir
		ViewModule,
		MemberModule,  // IMPORT 2
	],
	providers: [PropertyResolver, PropertyService],
})
export class PropertyModule {}
