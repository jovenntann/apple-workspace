import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';

// Library: ts-rest/nest
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { contract } from '../contract';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TsRestHandler(contract)
  async handler() {
    return tsRestHandler(contract, {
      getPost: async ({ params }) => {
        const post = await this.appService.getPost(params.id);

        if (!post) {
          return { status: 404, body: null };
        }

        return { status: 200, body: post };
      },
      createPost: async ({ body }) => {
        const post = await this.appService.createPost(body);

        return { status: 201, body: post };
      },

      getPosts: async () => {
        const posts = await this.appService.getPosts();
        return { status: 200, body: { posts, total: posts.length } };
      }
    });
  }
}
