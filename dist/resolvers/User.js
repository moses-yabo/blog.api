"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.User = {
    posts: (parent, __, { userInfo, prisma }) => {
        const isOwnProfile = parent.id === (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId);
        if (isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id
                },
                orderBy: [
                    {
                        created_at: "desc"
                    }
                ]
            });
        }
        else {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true
                },
                orderBy: [
                    {
                        created_at: "desc"
                    }
                ]
            });
        }
    }
};
