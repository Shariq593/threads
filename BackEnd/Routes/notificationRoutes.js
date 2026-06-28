import express from "express";
import { getNotifications, markAllRead, deleteAllNotifications } from "../Controller/notificationController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/read", protectRoute, markAllRead);
router.delete("/", protectRoute, deleteAllNotifications);

export default router;
