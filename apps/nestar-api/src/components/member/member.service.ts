import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { T } from '../../libs/types/common';

@Injectable()
export class MemberService {


    constructor(@InjectModel('Member') private readonly memberModel: Model<Member>,
     private  authService: AuthService
    ) {}

    public async signup(input: MemberInput): Promise<Member> {
    //TO DO: Hash password 
    input.memberPassword = await this.authService.hashPassword(input.memberPassword);

    try { 
    const result = await this.memberModel.create(input);
    result.accessToken = await this.authService.creteToken(result);
    return result;
    } catch (err) {
    console.log('Error, Service.model:', err.message);
    throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
    }
  
    }

    public async login(input: LoginInput): Promise<Member> {
     const { memberNick, memberPassword } = input;//input distraction
    const response = await this.memberModel
    .findOne({ memberNick: memberNick })
    .select('+memberPassword')
    .exec();

        if (!response || response.memberStatus === MemberStatus.DELETE) {
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
        } else if (response.memberStatus === MemberStatus.BLOCK) {
            throw new InternalServerErrorException(Message.BLOCKED_USER);
        }
        //Acces tookrn frontendga qaytash sababi
        //1. Session 2. Tooken 3. TookenHeader
        //Mobilleda mobileda cookie yoq. 

        // TO DO COMPARE PASSWORDS

        const isMatch =  await this.authService.comparePasswords(input.memberPassword, response.memberPassword);
        if (!isMatch)  throw new InternalServerErrorException(Message.WRONG_PASSWORD);
        response.accessToken = await this.authService.creteToken(response)
        
        return response;
    }

    public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
        const result: Member = await this.memberModel
        .findOneAndUpdate(
            {
                _id: memberId,
                memberStatus: MemberStatus.ACTIVE,
            },
            input,
            { new: true },
        )
        .exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        result.accessToken = await this.authService.creteToken(result);
        return result;
    }

    public async getMember(targetId: ObjectId): Promise<Member> {
        const search: T = {
            _id: targetId,
            memberStatus: {
                $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
            },
        };
        const targetMember = await this.memberModel.findOne(search).exec();
        if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return targetMember;
    }


    public async getAllMembersByAdmin(): Promise<string> {
        return "getAllMembersByAdmin 성공!!!";
    }

    public async updateMemberByAdmin(): Promise<string> {
        return "updateMemberByAdmin 성공!!!";
    }
}