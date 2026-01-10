import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	AGENT = 'AGENT',
	ADMIN = 'ADMIN',
}
registerEnumType(MemberType, {
	name: 'MemberType',
});

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}
registerEnumType(MemberStatus, {
	name: 'MemberStatus',
});

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
}
registerEnumType(MemberAuthType, {
	//.  ➡️ ikkalasini bog‘lab beradi Bu NestJS + GraphQL ga aytadi:
	name: 'MemberAuthType',
});

//  “Mana bu TypeScript enum ni
// GraphQL’da ham ishlatmoqchiman”
// Muammo nimada?

// TypeScript enum ni GraphQL o‘zi bilmaydi ❌
// Shuning uchun ro‘yxatdan o‘tkazish (register) qilish kerak.

// 👉 GraphQL ga aytyapti:

// “MemberAuthType degan GraphQL ENUM bor
// va uning qiymatlari mana shu TS enum’dan olinadi”
