"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const userLoader_1 = require("../loaders/userLoader");
exports.Post = {
    user: (parent, __, { prisma }) => {
        return userLoader_1.userLoader.load(parent.authorId);
    }
};
