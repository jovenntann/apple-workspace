import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const PostSchema = z.object({
    title: z.string(),
    body: z.string(),
});

type Post = z.infer<typeof PostSchema>;

export const contract = c.router({
    createPost: {
        method: 'POST',
        path: '/posts',
        responses: {
            201: PostSchema,
        },
        body: z.object({
            title: z.string(),
            body: z.string(),
        }),
        summary: 'Create a post',
    },
    getPost: {
        method: 'GET',
        path: `/posts/:id`,
        responses: {
            200: PostSchema.nullable(),
        },
        summary: 'Get a post by id',
    },
    getPosts: {
        method: 'GET',
        path: '/posts',
        responses: {
            200: c.type<{ posts: Post[]; total: number }>(),
            201: c.type<{ posts: Post[]; total: number }>(),
        },
        headers: z.object({
            pagination: z.string().optional(),
        }),
        query: z.object({
            take: z.string().transform(Number).optional(),
            skip: z.string().transform(Number).optional(),
            search: z.string().optional(),
        }),
        summary: 'Get all posts',
        metadata: { role: 'guest' } as const,
    },
});