import { Module } from '@nestjs/common';
import { BackendServiceUsersModule } from '@apple/backend/services/users';
import { UsersController } from './users.controller';

@Module({
  imports: [BackendServiceUsersModule],
  controllers: [UsersController],
})
export class UsersModule {}
