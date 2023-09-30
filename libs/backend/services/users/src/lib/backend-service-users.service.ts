import { Injectable, Logger } from '@nestjs/common';
import {
  DynamoDbService,
  UserType,
  createDynamoDbOptionWithPKSKIndex
} from '@apple/backend/dynamodb-onetable';
import { UserManagementUsersUser, UserManagementUsersUserResponse } from '@apple/shared/contracts';

@Injectable()
export class BackendServiceUsersService {
  private readonly logger = new Logger(BackendServiceUsersService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private userTable: any = null;

  constructor(private readonly dynamoDbService: DynamoDbService) {
    this.userTable = this.dynamoDbService
      .dynamoDbMainTable()
      .getModel('User');
    this.logger = new Logger(BackendServiceUsersService.name);
    this.logger.log('BackendServiceUsersService initialized');
  }

  async getAllUsers(query: {
    limit: number;
    reverse?: boolean;
    cursorPointer?: string;
    direction?: string;
  }): Promise<UserManagementUsersUserResponse> {
    this.logger.log('getAllUsers method called');

    const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
      query.limit,
      '', // This is an example it could be any other GSI or empty string
      query.direction,
      query.cursorPointer,
      query.reverse
    );

    const users = await this.userTable.find({}, dynamoDbOption);
    this.logger.log(`Found ${users.length} users`);

    return {
      data: users,
      nextCursorPointer: users.next,
      prevCursorPointer: users.prev
    };
  }

  async createUser(userType: UserType): Promise<UserManagementUsersUser> {
    this.logger.log('createUser method called');
    const createdUser = await this.userTable.create(userType);
    this.logger.log(createdUser);
    this.logger.log(`User created with id ${createdUser.userId}`);

    return createdUser;
  }

  async getUserById(userId: string): Promise<UserManagementUsersUser> {
    this.logger.log('getUserById method called');
    const user = await this.userTable.get({ userId });
    this.logger.log(`Found user with id ${user.userId}`);
    return user;
  }
}
