import { Module } from '@nestjs/common';
import { DynamodbOnetableModule } from '@apple/backend/dynamodb-onetable';
import { BackendServiceUsersService } from './backend-service-users.service';

@Module({
  imports: [DynamodbOnetableModule],
  providers: [BackendServiceUsersService],
  exports: [BackendServiceUsersService],
})
export class BackendServiceUsersModule {}

