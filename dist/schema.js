"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql

type Query {
  me:User
  posts:[Post!]!
  profile(userId:ID!):Profile
  }
type Mutation {
    postCreate(post:PostInput!):PostPayload!
    postUpdate(postId:ID! , post:PostInput!) :PostPayload!
    postDelete(postId:ID!):PostPayload!
    postPublish(postId:ID!):PostPayload!
    postUnPublish(postId:ID!):PostPayload!
    signup(credentials:CredentialsInput!,name:String,bio:String!):AuthPayload!
    signin(credentials:CredentialsInput!):AuthPayload!
  }

  type Post {
    id:ID!
    title:String!
    content:String!
    created_at:String!
    published:Boolean!
    user:User!
  
  }
  type User{
    id:ID!
    name:String!
    email:String!
    posts:[Post!]!
  }

  type Profile {
    id:String!
    bio:String!
    isMyProfile:Boolean!
    user:User!
  }
  type UserError{
    message:String!
  }
type PostPayload{
  userErrors:[UserError!]!
  post:Post
}
type AuthPayload{
  userErrors:[UserError!]!
  token:String
}
input CredentialsInput{
  email:String!
  password:String!
}
input PostInput {
  title:String
  content:String
}
`;
