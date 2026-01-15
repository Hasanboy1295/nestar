import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { ViewModule } from './view/view.module';
import { LikeService } from './like/like.service';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		PropertyModule,
		BoardArticleModule,
		CommentModule,
	
		FollowModule,
		ViewModule,
	],
	providers: [LikeService],
})
export class ComponentsModule {}
