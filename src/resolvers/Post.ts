import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

interface PostParentType{
    authorId:string;

}
export const Post = {
    user :(parent:PostParentType,__:any, {prisma}:Context) =>{
        
        return userLoader.load(parent.authorId);
    }
}