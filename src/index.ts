import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from "./schema";
import { Query,Mutation,Profile,Post,User } from "./resolvers";
import { PrismaClient,Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient()
export interface Context {
  prisma:PrismaClient<Prisma.PrismaClientOptions, never,  any | any | undefined>
  userInfo:{
    userId:string
  }| null
}
const server = new ApolloServer({
    typeDefs,
    resolvers: {
    Query ,
    Mutation ,
    Profile,
    Post,
    User
    },
  });
  
  startStandaloneServer(server,{
    context: async ({req}:any):Promise<Context>=>{
      const userInfo = await getUserFromToken(req.headers.authorization)
      return {
        userInfo,
        prisma        
      }
    },
    listen:{ port: 8000 }
  }).then(({url})=>{console.log('server is ready at',url)});
  