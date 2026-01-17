import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	ARTICLE = 'ARTICLE',
	BoardArticles = "BoardArticles",
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
