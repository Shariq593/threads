import express from "express";
import {
    createPost, deletePost, editPost, getFeedPost,
    getPost, getUserPosts, likeUnlikePost, replyToPost,
    getExplorePosts, bookmarkPost, getBookmarks, repostPost,
} from "../Controller/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/explore", protectRoute, getExplorePosts);
router.get("/bookmarks", protectRoute, getBookmarks);
router.get("/user/:username", getUserPosts);
router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.put("/repost/:id", protectRoute, repostPost);
router.put("/bookmark/:id", protectRoute, bookmarkPost);
router.put("/:id", protectRoute, editPost);

export default router;
