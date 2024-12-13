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
exports.postResolvers = void 0;
const canUserMutatePost_1 = require("../../utils/canUserMutatePost");
exports.postResolvers = {
    postCreate: (parent_1, _a, _b) => __awaiter(void 0, [parent_1, _a, _b], void 0, function* (parent, { post }, { prisma, userInfo }) {
        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{
                        message: "You must provide title and content"
                    }],
                post: null
            };
        }
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: "FORBIDEN ACCESS  UNAUTHENTICATED"
                    }
                ],
                post: null
            };
        }
        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId
                }
            })
        };
    }),
    postUpdate: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { post, postId }, { prisma, userInfo }) {
        const { content, title } = post;
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: "FORBIDEN ACCESS  UNAUTHENTICATED"
                    }
                ],
                post: null
            };
        }
        const error = yield (0, canUserMutatePost_1.canUserMutatePost)({
            userId: userInfo.userId,
            postId,
            prisma
        });
        if (error === null || error === void 0 ? void 0 : error.userErrors)
            return error;
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
    postDelete: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { postId }, { prisma, userInfo }) {
        const post = yield prisma.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: "FORBIDEN ACCESS  UNAUTHENTICATED"
                    }
                ],
                post: null
            };
        }
        const error = yield (0, canUserMutatePost_1.canUserMutatePost)({
            userId: userInfo.userId,
            postId,
            prisma
        });
        if (error === null || error === void 0 ? void 0 : error.userErrors)
            return error;
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
};
