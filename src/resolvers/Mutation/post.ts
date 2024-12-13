import { Post, Prisma } from "@prisma/client"
import { Context } from "../.."
import { canUserMutatePost } from "../../utils/canUserMutatePost"

interface PostArgs {
    post:{
    title?:string
    content?:string
    }
}
interface postPayloadType  {
    userErrors:{
        message:string
    }[]
    post:Post | Prisma.Prisma__PostClient<Post>| null
}

export const postResolvers  = {
    postCreate:async (parent:any,{post}:PostArgs,{prisma,userInfo}:Context):Promise<postPayloadType>=>{
        const {title, content} = post;
        if(!title || !content){
            return {
                userErrors:[{
                    message: "You must provide title and content"
                }],
                post:null
            }
        }
     if (!userInfo) {
        return {
            userErrors:[
                {
                    message:"FORBIDEN ACCESS  UNAUTHENTICATED"
                }
            ],
            post:null
        }
     }
        return {
            userErrors:[],
            post: prisma.post.create({
                data:{
                    title,
                    content,
                    authorId:userInfo?.userId
                }
            })
        }
    },
    postUpdate:async (_:any,{post,postId}:{postId:string,post:PostArgs["post"]},{prisma,userInfo}:Context):Promise<postPayloadType>=>{
        const {content,title} = post; 
        
        if (!userInfo) {
            return {
                userErrors:[
                    {
                        message:"FORBIDEN ACCESS  UNAUTHENTICATED"
                    }
                ],
                post:null
            }
         }
        const error = await canUserMutatePost({
            userId:userInfo.userId,
            postId,
            prisma
        });

        if (error?.userErrors) return error;
        if (!title && !content) {
            return {
                userErrors:[
                    {
                        message: "Need to have atleast one field "
                    }
                ],
                post:null
            }
        }
      const existingPost = await prisma.post.findUnique({
        where:{
            id:postId
        }
      });

      if (!existingPost) {
        return {
            userErrors:[
                {
                    message: "Post does not exist! "
                }
            ],
            post:null
        }
    }
    let payloadToupdate = {
        title,
        content
    }

    if(!title) delete payloadToupdate.title;
    if(!content) delete payloadToupdate.content
    return {
        userErrors:[],
        post:prisma.post.update({
            data:{
                ...payloadToupdate    
            },
            where:{
                id:postId
            }
        })
    }
  },
  postDelete:async (_:any ,{ postId}:{postId:string},{prisma,userInfo}:Context):Promise<postPayloadType>=>{
    const post  = await prisma.post.findUnique({
        where:{
            id:postId
        }
    })

     
    if (!userInfo) {
        return {
            userErrors:[
                {
                    message:"FORBIDEN ACCESS  UNAUTHENTICATED"
                }
            ],
            post:null
        }
     }
    const error = await canUserMutatePost({
        userId:userInfo.userId,
        postId,
        prisma
    });

    if (error?.userErrors) return error;
    if (!post) {
        return {
            userErrors:[
                {
                    message: "Post does not exist! "
                }
            ],
            post:null
        }
    }
    await prisma.post.delete({
        where:{
            id:postId
        }
    });

    return{
        userErrors:[],
        post
    }
  },
};