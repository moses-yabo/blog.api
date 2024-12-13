"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolvers = void 0;
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../../keys");
exports.authResolvers = {
    // Sign up & Sign in / Authentication Resolvers
    // **Signup Resolver**
    signup: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { name, bio, credentials }, { prisma }) {
        const { email, password } = credentials;
        // **Step 1: Validate Input Fields**
        const isEmail = validator_1.default.isEmail(email); // Validate email format
        const isValidPassword = validator_1.default.isLength(password, { min: 5 }); // Check password length
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
        const userExist = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (userExist) {
            return {
                userErrors: [{
                        message: "User with that email already exist !"
                    }],
                token: null
            };
        }
        // **Step 2: Hash the Password**
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // **Step 3: Save User and Profile Data**
        const user = yield prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });
        yield prisma.profile.create({
            data: {
                bio,
                userId: user.id,
            },
        });
        // **Step 4: Generate JWT And return it**
        return {
            userErrors: [],
            token: yield jsonwebtoken_1.default.sign({ userId: user.id }, keys_1.JWT_SIGNATURE, { expiresIn: 3600000 } // 1 hour
            ),
        };
    }),
    // **Signin Resolver**
    signin: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { credentials }, { prisma }) {
        const { email, password } = credentials;
        // **Step 1: Find the User**
        const user = yield prisma.user.findUnique({
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
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
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
            token: jsonwebtoken_1.default.sign({ userId: user.id }, keys_1.JWT_SIGNATURE, { expiresIn: 3600000 } // 1 hour
            ),
        };
    }),
};
