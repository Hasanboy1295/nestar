import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { publicDecrypt } from 'crypto';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {


    constructor(@InjectModel('Member') private readonly memberModel: Model<null> ) {}



    public async signup(): Promise<string> {
        return "signup 성공!!!";
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