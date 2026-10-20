import { profile } from 'console';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true
        },

        password: {
            type: String,
            required: true
        },

        profile: {
            name: { type: String },
            avatar: { type: String },
            age: { type: Number },
            gender: { type: String, enum: ['male', 'female', 'other'] }
        },

        role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const User = mongoose.model('User', userSchema);
