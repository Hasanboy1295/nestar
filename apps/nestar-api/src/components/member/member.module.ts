import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import MemberSchema from '../../schemas/Member.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
     AuthModule //koprik member modelga auth modelni chaqir
    ],
  providers: [
    MemberResolver, 
    MemberService  //MVC Asosiy mantiq MemberService MemberResolver da 
  ],
})
export class MemberModule {
}
 










