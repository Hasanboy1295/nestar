import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { publicDecrypt } from 'crypto';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/member.enum';
import { Message } from '../../libs/enums/common.enum';
import e from 'express';

@Injectable()
export class MemberService {


    constructor(@InjectModel('Member') private readonly memberModel: Model<Member> ) {}
    public async signup(input: MemberInput): Promise<Member> {
    //TO DO: Hash password 

    try {
    const result = await this.memberModel.create(input);
    return result;
    } catch (err) {
    console.log('Error, Service.model:', err);
    throw new BadRequestException(err);
    }
  
    }

    public async login(input: LoginInput): Promise<Member> {
     const { memberNick, memberPassword } = input;
    const response = await this.memberModel
    .findOne({ memberNick: memberNick })
    .select('+memberPassword')
    .exec();


        if (!response || response.memberStatus === MemberStatus.DELETE) {
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
        } else if (response.memberStatus === MemberStatus.BLOCK) {
            throw new InternalServerErrorException(Message.BLOCKED_USER);
        }

        // TO DO COMPARE PASSWORDS
        console.log("response:", response)
        const isMatch = memberPassword === response.memberPassword;
        if (!isMatch)  throw new InternalServerErrorException(Message.WRONG_PASSWORD);
             return response;
    }



    public async updateMember(): Promise<string> {
        return "updateMember 성공!!!";
    }

    public async getMember(): Promise<string> {
        return "getMember 성공!!!";
    }
}