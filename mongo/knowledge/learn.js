import { profile } from 'console';
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
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

        status: {
            type:  String,
            enum: ['active', 'inactive', 'banned'],
            default: 'active'
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);
