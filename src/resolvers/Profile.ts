import { Context } from "..";

interface ProfileParentType{
    id:string;
    bio:string;
    userId:string;
}
export const Profile = {
    user : async(parent:ProfileParentType,__:any, {userInfo,prisma}:Context) =>{
    
        return await prisma.user.findUnique({
            where:{
                id:parent.userId,
            }
        })
    }
}