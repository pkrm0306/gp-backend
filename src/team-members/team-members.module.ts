import { Module } from '@nestjs/common';
import { TeamMembersController } from './team-members.controller';
import { AdminModule } from '../admin/admin.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [AdminModule, CategoriesModule],
  controllers: [TeamMembersController],
})
export class TeamMembersModule {}
