import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.user._id })
            .populate("from", "username profilePic")
            .populate("post", "text img")
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ to: req.user._id, read: false }, { read: true });
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ to: req.user._id });
        res.status(200).json({ message: "Notifications cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { getNotifications, markAllRead, deleteAllNotifications };
