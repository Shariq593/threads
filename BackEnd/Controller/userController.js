import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import generteTokenAndSetCookie from "../utilis/generateTokenAndSetCookie.js";


const getUserProfile = async(req,res) => {
	const {username} = req.params;
	try{
		const user = await User.findOne({username});
		// const user= await User.findOne({username}).select("-password").select(-"updatedAt");
		if(!user){
			return  res.status(404).json({message:"User not Found "})
		}
		res.status(200).json(user);
	}catch(err){
		res.status(500).json({message:err.message})
		console.log("Error in getUserProfile",err.message)
	}
}



const signupUser = async (req, res) => {
	try {
		const {name,email,username,password} =req.body;
		const user = await User.findOne({$or:[{email},{password}]});

		if(user){
			return res.status(400).json({message:"User alreadyready exists"})
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password,salt)

		const newUser = new User({
			name,
			email,
			username,
			password : hashedPassword
		})

		await newUser.save()

		if(newUser){

			generteTokenAndSetCookie(newUser._id,res)

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email : newUser.email,
				username: newUser.username
			})
		} else{
			res.status(400).json({message: "Invalid User Data"})
		}

	} catch (err) {
		res.status(500).json({message:err.message})
		console.log("Error in SignupUser",err.message)
	}
};

const loginUser = async(req,res) =>{
	try {
		const {username,password} =req.body;
		const user = await User.findOne({username});
		const isPasswordCorrect = await bcrypt.compare(password,user?.password || ""); // If user exist then password otherwise empty
		
		if(!user || !isPasswordCorrect) return res.status(400).json({message: "Invalid Username or password"});

		generteTokenAndSetCookie(user._id,res)

		res.status(200).json({
			_id: user._id,
			name:user.name,
			email:user.email,
			username :user.username ,
		})

	} catch (err) {
		res.status(500).json({message:err.message})
		console.log("Error in LoginUser",err.message)
	}
}

const logoutUser = (req,res) =>{
	try {
		res.cookie("jwt","",{maxAge:1})
		res.status(200).json({message: " User Logged Out Successfully"})
	} catch (err) {
		res.status(500).json({message:err.message})
		console.log("Error in LoginUser",err.message)
		
	}
}

const followUnfollowUser = async (req,res)=> {
	try {
		const {id} =req.params;
		const UserToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id)

		if(id === req.user._id.toString()){
			return res.status(400).json({message:"You cannt follow yourself"})
		}

		if(!UserToModify || !currentUser) {
			return res.status(400).json({message: "User not Found"})
		}

		const isFollowing = currentUser.following.includes(id);
		if(isFollowing){
			//unfollow User

			await User.findByIdAndUpdate(req.user._id,{$pull: {following:id}}) //removes from following
			await User.findByIdAndUpdate(id, {$pull: { followers:req.user._id}}) // removes from followers
			res.status(200).json( {message : " User unfollowed Successfully"})
		}else{
			//follow User
			await User.findByIdAndUpdate(req.user._id,{$push: {following:id}}) //adds to following
			await User.findByIdAndUpdate(id, {$push: { followers:req.user._id}})
			res.status(200).json( {message : " User Followed Successfully"})
		}
	

	} catch (err) {
		res.status(500).json({message:err.message})
		console.log("Error in FollowUnfollowUser",err.message)
	}
}


const updateUser = async(req,res) => {
	const {name,email,username,password,profilePic,bio} = req.body;
	const userId = req.user._id
	try {
		let user = await User.findById(userId)
		if(!user) return res.status(400).json({message:"User not Found"})

		if(req.params.id !== userId.toString()){
			return res.status(400).json({ message: "You cannot update other users profile"})
		}
		
		if(password){
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password,salt)
			user.password = hashedPassword
		}

		user.name = name || user.name
		user.email = email || user.email
		user.username = username || user.username
		user.profilePic = profilePic || user.profilePic
		user.bio = bio || user.bio

		user = await user.save()

		res.status(500).json({message: "Profile Updated Successfully",user})

	} catch (err) {
		res.status(500).json({message:err.message})
		console.log("Error in updateUser",err.message)
	}
}



export {signupUser,loginUser,logoutUser, followUnfollowUser, updateUser, getUserProfile}

 