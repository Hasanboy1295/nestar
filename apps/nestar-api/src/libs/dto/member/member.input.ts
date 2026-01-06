import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min  } from 'class-validator';
import { MemberAuthType, MemberStatus, MemberType } from '../../member.enum';
import { availableAgentSorts, availableMemberSorts } from '../../config';
import { Diretion } from '../../enums/common.enum';



@InputType()
export class MemberInput {
    @IsNotEmpty()
    @Length(3, 12)
    @Field(() => String)
    memberNick: string;

    @IsNotEmpty()
    @Length(5, 12)
    @Field(() => String)
    memberPassword: string;

    @IsNotEmpty()
    @Field(() => String)
    memberPhone: string;

    @IsOptional()
    @Field(() => MemberType, { nullable: true })
    memberType?: MemberType;

     @IsOptional()
    @Field(() => MemberAuthType, { nullable: true })
    MemberAuthType?: MemberAuthType;
}



@InputType()
export class LoginInput {
    @IsNotEmpty()
    @Length(3, 12)
    @Field(() => String)
    memberNick: string;

    @IsNotEmpty()
    @Length(5, 12)
    @Field(() => String)
    memberPassword: string;
}

 @InputType()
 class AISearch {
    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string
 }

@InputType()
export class AgentsInquary {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableAgentSorts)
    @Field(() => String, { nullable: true })
    sort?: string;


     @IsOptional()
    @Field(() => Diretion, { nullable: true })
    direction?: Diretion;

    @IsNotEmpty()
     @Field(() =>  AISearch)
     search: AISearch;
}
//Hi
 @InputType()
 class MISearch {

    @IsOptional()
    @Field(() => MemberStatus, { nullable: true })
    memberStatus​​?: MemberStatus;

    @IsOptional()
    @Field(() => MemberType, { nullable: true })
    memberType​?: MemberType;


     @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string
 }

@InputType()
export class MembersInquary {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableMemberSorts)
    @Field(() => String, { nullable: true })
    sort?: string;


     @IsOptional()
    @Field(() => Diretion, { nullable: true })
    direction?: Diretion;

    @IsNotEmpty()
     @Field(() =>  MISearch)
     search: MISearch;
}