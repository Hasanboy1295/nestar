import { Injectable } from '@nestjs/common';
import { publicDecrypt } from 'crypto';

@Injectable()
export class MemberService {
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