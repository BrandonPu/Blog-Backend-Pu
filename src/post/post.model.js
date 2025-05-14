import { Schema, model } from "mongoose";

const postSchema = new Schema(
    {
        author: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        state: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Post', postSchema);