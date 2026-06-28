import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["like", "reply", "follow", "repost"],
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
