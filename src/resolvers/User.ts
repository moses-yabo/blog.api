import { Context } from "..";

interface userParentType{
    id:string;
  
}
export const User = {
    posts :(parent:userParentType,__:any, {userInfo,prisma}:Context) =>{
        const isOwnProfile = parent.id === userInfo?.userId;
        if (isOwnProfile) {
            return prisma.post.findMany({
                where:{
                    authorId:parent.id
                },
                orderBy:[
                    {
                        created_at:"desc"
                    }
                ]
            })
        }else{
            return prisma.post.findMany({
                where:{
                    authorId:parent.id,
                    published:true
                },
                orderBy:[
                    {
                        created_at:"desc"
                    }
                ]
            })
        }
    }
}