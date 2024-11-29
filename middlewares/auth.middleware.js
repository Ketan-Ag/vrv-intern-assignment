import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken || req.headers?.authorization;
        
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken || req.headers?.authorization;
        
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}