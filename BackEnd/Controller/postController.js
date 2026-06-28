import User from "../model/userModel.js";
import Post from "../model/postModel.js";
import Notification from "../model/notificationModel.js";
import {v2 as cloudinary} from "cloudinary";

const createPost = async (req,res)=> {
    try {
        const {postedBy,text} = req.body;
        let {img} =req.body;

        if(!postedBy || !text){
            return res.status(400).json({ error: "PostedBy and Text fields are required" });
        }

        const user = await User.findById(postedBy)
        if(!user) {
            return res.status(404).json({ error: "User not Found" });
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: "Unauthorized to create post" });
        }

        const maxLength = 500
        if(text.length > maxLength){
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();
        res.status(201).json({ message: "Post Created", newPost });

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}

const getPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({ error: "post not found" });
        }
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}

const deletePost = async(req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ error: "Post not Found" });
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({ error: "Unauthorized to delete Post" });
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        await Notification.deleteMany({ post: req.params.id });
        res.status(200).json({ message: "Post deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}

const editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.postedBy.toString() !== req.user._id.toString())
            return res.status(403).json({ error: "Unauthorized" });

        const { text } = req.body;
        let { img } = req.body;

        if (text !== undefined) post.text = text;

        if (img) {
            if (post.img) {
                await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
            }
            const uploaded = await cloudinary.uploader.upload(img);
            post.img = uploaded.secure_url;
        }

        const updated = await post.save();
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const likeUnlikePost = async(req,res)=>{
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({ error: "Post not Found" });
        }

        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            await Post.updateOne({_id: postId},{$pull: {likes: userId}});
            await Notification.deleteOne({ to: post.postedBy, from: userId, type: "like", post: postId });
            res.status(200).json({ message: "Post Unliked" });
        } else {
            post.likes.push(userId);
            await post.save();
            if (post.postedBy.toString() !== userId.toString()) {
                await Notification.create({ to: post.postedBy, from: userId, type: "like", post: postId });
            }
            res.status(200).json({ message: "Post Liked" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}

const replyToPost = async(req,res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text){
            return res.status(400).json({error: "Text field is required"});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ error: "Post not Found" });
        }

        const reply = {userId, text, userProfilePic, username};
        post.replies.push(reply);
        await post.save();

        if (post.postedBy.toString() !== userId.toString()) {
            await Notification.create({ to: post.postedBy, from: userId, type: "reply", post: postId });
        }

        res.status(200).json({ message: "Reply added successfully", post });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}

const getFeedPost = async(req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not Found" });
        }

        const feedIds = [...user.following, userId];
        const feedPosts = await Post.find({postedBy:{$in: feedIds}}).sort({createdAt: -1});

        if(feedPosts.length === 0){
            const suggestedPosts = await Post.find({postedBy:{$ne: userId}})
                .sort({createdAt: -1})
                .limit(20);
            return res.status(200).json({suggested: true, posts: suggestedPosts});
        }

        res.status(200).json({suggested: false, posts: feedPosts});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getExplorePosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Post.countDocuments();
        res.status(200).json({ posts, hasMore: page * limit < total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserPosts = async(req,res) =>{
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const bookmarkPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const user = await User.findById(userId);
        const isBookmarked = user.bookmarks.includes(postId);

        if (isBookmarked) {
            await User.findByIdAndUpdate(userId, { $pull: { bookmarks: postId } });
            res.status(200).json({ message: "Bookmark removed", bookmarked: false });
        } else {
            await User.findByIdAndUpdate(userId, { $push: { bookmarks: postId } });
            res.status(200).json({ message: "Post bookmarked", bookmarked: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "bookmarks",
            options: { sort: { createdAt: -1 } },
        });
        res.status(200).json(user.bookmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const repostPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const hasReposted = post.reposts.includes(userId);
        if (hasReposted) {
            await Post.updateOne({ _id: postId }, { $pull: { reposts: userId } });
            await Notification.deleteOne({ to: post.postedBy, from: userId, type: "repost", post: postId });
            res.status(200).json({ message: "Repost removed", reposted: false });
        } else {
            post.reposts.push(userId);
            await post.save();
            if (post.postedBy.toString() !== userId.toString()) {
                await Notification.create({ to: post.postedBy, from: userId, type: "repost", post: postId });
            }
            res.status(200).json({ message: "Post reposted", reposted: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export {
    createPost, getPost, deletePost, editPost,
    likeUnlikePost, getFeedPost, replyToPost,
    getUserPosts, getExplorePosts,
    bookmarkPost, getBookmarks, repostPost,
};
