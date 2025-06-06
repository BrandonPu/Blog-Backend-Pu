import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "Anónimo"  
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Comment', commentSchema);