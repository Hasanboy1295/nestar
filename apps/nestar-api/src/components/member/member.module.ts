import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import MemberSchema from '../../schemas/Member.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/likes.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Member',
				schema: MemberSchema,
			},
		]),
		AuthModule, //koprik member modelga auth modelni chaqir
		ViewModule, // IMPORT 2
		LikeModule,
	],
	providers: [
		MemberResolver,
		MemberService, //MVC Asosiy mantiq MemberService MemberResolver da
	],
	exports: [MemberService],// IMPORT 1
})
export class MemberModule {}
