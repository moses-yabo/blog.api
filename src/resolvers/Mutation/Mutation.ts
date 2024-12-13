import { postResolvers,authResolvers} from "./";

export const Mutation = {
...postResolvers,
...authResolvers
 
}