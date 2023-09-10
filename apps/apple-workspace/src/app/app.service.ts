import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getPost(id: string) {
    return {
      id,
      title: 'Post 1',
      body: 'This is post 1',
    };
  }

  createPost({ title, body }: { title: string; body: string }) {
    return {
      id: '1',
      title,
      body,
    };
  }
  
  getPosts() {
    return [
      {
        title: 'Post 1',
        body: 'This is post 1',
      },
      {
        title: 'Post 2',
        body: 'This is post 2',
      },
    ];
  }
}
