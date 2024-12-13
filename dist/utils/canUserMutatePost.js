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
exports.canUserMutatePost = void 0;
const canUserMutatePost = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, postId, prisma }) {
    const user = yield prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) {
        return {
            userErrors: [{
                    message: "User not found"
                }],
            post: null
        };
    }
    const post = yield prisma.post.findUnique({
        where: {
            id: postId
        }
    });
    if ((post === null || post === void 0 ? void 0 : post.authorId) !== user.id) {
        return {
            userErrors: [
                {
                    message: "Post not owned by user"
                }
            ],
            post: null
        };
    }
});
exports.canUserMutatePost = canUserMutatePost;
