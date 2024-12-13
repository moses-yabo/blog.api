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
exports.Query = void 0;
exports.Query = {
    me: (_, __, { userInfo, prisma }) => {
        if (!userInfo)
            return null;
        return prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        });
    },
    profile: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { userId }, { userInfo, prisma }) {
        const isMyProfile = userId === (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId);
        const profile = yield prisma.profile.findUnique({
            where: {
                userId
            },
        });
        if (!profile)
            return null;
        return Object.assign(Object.assign({}, profile), { isMyProfile });
    }),
    posts: (_, __, { prisma }) => {
        return prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    created_at: "desc"
                },
            ]
        });
    }
};
