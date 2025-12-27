import { Schema } from 'mongoose';

const FollowSchema = new Schema(
	{
		followingId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		followerId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true, collection: 'follows' },//collection: 'follows' — MongoDB jadval nomini majburan belgilaydi
);

FollowSchema.index({ followingId: 1, followerId: 1 }, { unique: true });//.    faqat 1 marta follow qila oladi

export default FollowSchema;



// 👉 MongoDB ga aniq buyruq berayapti:
// “Bu schema ma’lumotlarini
// follows degan COLLECTION ga saqla”
// Agar yozilmasa nima bo‘ladi?
// Agar collection yozmasang ❌
// const FollowSchema = new Schema(...)

// MongoDB avtomatik nom beradi:
// Follow → follows
// Lekin:
// ba’zida noto‘g‘ri nom chiqadi
// katta/kichik harf muammosi bo‘ladi
// 📌 Shuning uchun professional projectlarda doim aniq yoziladi.