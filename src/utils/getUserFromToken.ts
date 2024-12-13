import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "../keys";

export const getUserFromToken = async(token:string)=>{
    try {
        return JWT.verify(token,JWT_SIGNATURE) as {
            userId:string
        }
    } catch (error) {
        return null;
    }
}