import User from "../model/userModel.js";
import Post from "../model/postModel.js";

const createPost = async (req,res)=> {
    try {
        const {postedBy,text,img} = req.body;

        if(!postedBy || !text){
            return res.status(400).json({ message: "PostedBy and Text fields are required" });
        }

        const user = await User.findById(postedBy)
        if(!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized to create POst" });
        }

        const maxLength =500
        if(text.length > maxLength){
            res.status(500).json({ message: `Text must be less than ${maxLength} characters ` });
        }

        const newPost = new Post({
            postedBy, text,img 
        })
        await newPost.save();

        res.status(201).json({ message: "Post Created" ,newPost});


    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
    }
}

const getPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(500).json({ message: "post not found" });
        }
    
        res.status(200).json({post})

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
    }
}

const deletePost = async(req,res)=> {
    try {
        const post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not Found" });
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(500).json({ message: "Unauthorized to delete Post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message : "Post deleted Successfully" })

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
    }
}

export {createPost, getPost,deletePost}