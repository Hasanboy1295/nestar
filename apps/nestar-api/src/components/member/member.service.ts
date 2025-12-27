import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { publicDecrypt } from 'crypto';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberInput } from '../../libs/dto/member/member.input';

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

    public async login(): Promise<string> {
        return "login 성공!!!";
    }

    public async updateMember(): Promise<string> {
        return "updateMember 성공!!!";
    }

    public async getMember(): Promise<string> {
        return "getMember 성공!!!";
    }
}