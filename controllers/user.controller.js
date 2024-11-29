import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!(username && email && password)) {
            return res.status(209).json({ message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const role = "standard_user"

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: role
        });

        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error occurred while creating new user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(209).json({ message: "email and password are required!" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(209).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );
        console.log('token', accessToken)
        return res
                .status(200)
                .cookie("accessToken", accessToken, { httpOnly: true })
                .json({ message: "User logged in successfully" });

    } catch (error) {
        console.error("Error occurred during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try{
        return res
                .status(200)
                .clearCookie("accessToken", { httpOnly: true })
                .json({ message: "User logged out successfully" });
    }catch(error){
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const changeRole = async (req, res) => {
    try{
        const { email, role } = req.body;

        if (!(email && role)) {
            return res.status(209).json({ message: "email and role are required!" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({ message: "User role changed successfully", user });

    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const changeUsername = async (req, res) => {
    try{
        const { email, username } = req.body;

        if (!(email && username)) {
            return res.status(209).json({ message: "email and username are required!" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = username;
        await user.save();

        return res.status(200).json({ message: "Username changed successfully", user });

    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }
}