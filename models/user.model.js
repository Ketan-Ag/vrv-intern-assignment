import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ['admin', 'standard_user'],
            default: 'standard_user'
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);
