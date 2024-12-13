import { Context } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "../../keys";

interface SignupArgs {
    credentials: {
        email: string;
        password: string;
    };
    name: string;
    bio: string;
}

interface UserPayload {
    userErrors: {
        message: string;
    }[];
    token: string | null;
}

export const authResolvers = {
    // Sign up & Sign in / Authentication Resolvers

    // **Signup Resolver**
    signup: async (
        _: any,
        { name, bio, credentials }: SignupArgs,
        { prisma }: Context
    ): Promise<UserPayload> => {
        const { email, password } = credentials;

        // **Step 1: Validate Input Fields**
        const isEmail = validator.isEmail(email); // Validate email format
        const isValidPassword = validator.isLength(password, { min: 5 }); // Check password length

        if (!isEmail) {
            return {
                userErrors: [{ message: "Invalid email" }],
                token: null,
            };
        }

        if (!isValidPassword) {
            return {
                userErrors: [{ message: "Invalid password" }],
                token: null,
            };
        }

        if (!name || !bio) {
            return {
                userErrors: [{ message: "Invalid name or bio" }],
                token: null,
            };
        }
        const userExist = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userExist) {
            return {
                userErrors:[{
                    message:"User with that email already exist !"
                }],
                token:null
            }
        }
        // **Step 2: Hash the Password**
        const hashedPassword = await bcrypt.hash(password, 10);

        // **Step 3: Save User and Profile Data**
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id,
            },
        });

        // **Step 4: Generate JWT And return it**
        return {
            userErrors: [],
            token: await JWT.sign(
                { userId: user.id },
                JWT_SIGNATURE,
                { expiresIn: 3600000 } // 1 hour
            ),
        };
    },

    // **Signin Resolver**
    signin: async (
        _: any,
        { credentials }: SignupArgs,
        { prisma }: Context
    ): Promise<UserPayload> => {
        const { email, password } = credentials;

        // **Step 1: Find the User**
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            // **Step 1.1: Handle Invalid User**
            return {
                userErrors: [{ message: "Invalid Credentials" }],
                token: null,
            };
        }

        // **Step 2: Validate the Password**
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // **Step 2.1: Handle Password Mismatch**
            return {
                userErrors: [{ message: "Invalid Credentials" }],
                token: null,
            };
        }

        // **Step 3: Generate JWT**
        return {
            userErrors: [],
            token: JWT.sign(
                { userId: user.id },
                JWT_SIGNATURE,
                { expiresIn: 3600000 } // 1 hour
            ),
        };
    },
};
