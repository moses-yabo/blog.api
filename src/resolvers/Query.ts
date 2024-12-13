import { Context } from "..";
export const Query = {
    me:(_:any, __:any,{userInfo,prisma}:Context) =>{
      if (!userInfo) return null;
      return prisma.user.findUnique({
        where:{
          id:userInfo.userId
        }
      })
    },
    profile:async (_:any, {userId}:{userId:string},{userInfo,prisma}:Context) =>{
      const isMyProfile = userId === userInfo?.userId;

      const profile = await prisma.profile.findUnique(
        {
          where:{
            userId
          },
        });
        if (!profile) return null;
        return {
          ...profile,
          isMyProfile
        }
    },
  posts: (_:any,__:any,{prisma}:Context) => {
      return  prisma.post.findMany({
        where:{
          published:true
        },
        orderBy:[
          {
            created_at: "desc"
          },  
        ]
      })


    }
  }