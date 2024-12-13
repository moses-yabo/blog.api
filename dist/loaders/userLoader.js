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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const index_1 = require("../index");
const batchUsers = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ids);
    const users = yield index_1.prisma.user.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    const userMap = {};
    users.forEach((user) => {
        userMap[user.id] = user;
    });
    return ids.map((id) => userMap[id]);
});
//@ts-ignore
exports.userLoader = new dataloader_1.default(batchUsers);
