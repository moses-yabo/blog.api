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
exports.prisma = void 0;
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const client_1 = require("@prisma/client");
const getUserFromToken_1 = require("./utils/getUserFromToken");
exports.prisma = new client_1.PrismaClient();
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: {
        Query: resolvers_1.Query,
        Mutation: resolvers_1.Mutation,
        Profile: resolvers_1.Profile,
        Post: resolvers_1.Post,
        User: resolvers_1.User
    },
});
(0, standalone_1.startStandaloneServer)(server, {
    context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
        const userInfo = yield (0, getUserFromToken_1.getUserFromToken)(req.headers.authorization);
        return {
            userInfo,
            prisma: exports.prisma
        };
    }),
    listen: { port: 8000 }
}).then(({ url }) => { console.log('server is ready at', url); });
