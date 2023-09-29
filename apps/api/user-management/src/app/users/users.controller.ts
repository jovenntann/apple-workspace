import { Controller } from '@nestjs/common';
import { contract } from '@apple/shared/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { BackendServiceUsersService } from '@apple/backend/services/users';

@Controller()
export class UsersController {
  constructor(
    private readonly backendServiceUsersService: BackendServiceUsersService
  ) {}

  @TsRestHandler(contract.userManagement.users)
  async handler() {
    return tsRestHandler(contract.userManagement.users, {
      findAllUsers: async ({ query }) => {
        const { data, nextCursorPointer, prevCursorPointer } =
          await this.backendServiceUsersService.findAllUsers({
            limit: query.limit,
            reverse: query.reverse,
            cursorPointer: query?.cursorPointer,
            direction: query?.direction
          });
        return {
          status: 200,
          body: { data, nextCursorPointer, prevCursorPointer }
        };
      },

      createUser: async ({ body }) => {
        const user = await this.backendServiceUsersService.createUser(
          body
        );
        return {
          status: 201,
          body: user
        };
      },

    //   getUserById: async ({ params }) => {
    //     const user = await this.backendServiceUsersService.getUserById(
    //       params.id
    //     );
    //     return {
    //       status: 200,
    //       body: user
    //     };
    //   },
    });
  }
}
