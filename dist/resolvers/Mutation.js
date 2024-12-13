"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
exports.Mutation = {
    postCreate: (parent_1, _a, _b) => __awaiter(void 0, [parent_1, _a, _b], void 0, function* (parent, { post }, { prisma }) {
        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{
                        message: "You must provide title and content"
                    }],
                post: null
            };
        }
        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: "67514ddbf300922c1245a3c0"
                }
            })
        };
    }),
    postUpdate: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { post, postId }, { prisma }) {
        const { content, title } = post;
        if (!title && !content) {
            return {
                userErrors: [
                    {
                        message: "Need to have atleast one field "
                    }
                ],
                post: null
            };
        }
        const existingPost = yield prisma.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!existingPost) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist! "
                    }
                ],
                post: null
            };
        }
        let payloadToupdate = {
            title,
            content
        };
        if (!title)
            delete payloadToupdate.title;
        if (!content)
            delete payloadToupdate.content;
        return {
            userErrors: [],
            post: prisma.post.update({
                data: Object.assign({}, payloadToupdate),
                where: {
                    id: postId
                }
            })
        };
    }),
    postDelete: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { postId }, { prisma }) {
        const post = yield prisma.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist! "
                    }
                ],
                post: null
            };
        }
        yield prisma.post.delete({
            where: {
                id: postId
            }
        });
        return {
            userErrors: [],
            post
        };
    }),
    signup: (_, __, { prisma }) => {
    }
};
