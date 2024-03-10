import { Avatar, Flex, Box, Image, Text, Divider, Spinner } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions.jsx";
import { useEffect, useState } from "react";
import Comment from "../components/Comment.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import useShowToast from "../hooks/useShowToast.js";
import { useNavigate, useParams } from "react-router-dom";
import {formatDistanceToNow} from "date-fns"
import { DeleteIcon } from "@chakra-ui/icons"
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";


function PostPage() {
  const {user,loading} = useGetUserProfile();
  const [post,setPost] = useState(null)
  const showToast = useShowToast();
  const {pid} =useParams();
  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate();

  useEffect( ()=> {
    const getPost =async() => {
      try {
  console.log(user)

        const res = await fetch(`/api/posts/${pid}`);
        const data =await res.json()
        if(data.error){
          showToast("Error",data.error,"error")
          return
        }
        console.log("Post",data)
        setPost(data)
      } catch (error) {
        showToast("Error",error.message,"error")
      }
    }
    getPost()
  },[showToast,pid])

  const handleDeletePost = async (e) => {
    try {
      if(!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`,{
        method: "DELETE",
      })
      const data = await res.json()
      if(data.error){
         showToast("error",error.message,"error")
        return
      }

      showToast("Success","Post Deleted","success")
      navigate(`/${user.username}`)

    } catch (error) {
      showToast("error",error.message,"error")
      
    }
  }

  if(!post) return null;
  if(!user && loading){
    return(
      <Flex justifyContent={"center"}>
          <Spinner size={"xl"}/>
        </Flex>
      )
    }
    return (
    <>
    <Flex>
     <Flex w={"full"}  alignItems={"center"} gap={3}>
        <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg"/>
        <Flex>
          <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
          <Image src="/verified.png" w={4} h={4} ml={4}/>
        </Flex>
      </Flex>
      <Flex gap={4} alignItems={"center"} >
        <Text fontStyle={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
          
            {formatDistanceToNow(new Date(post.createdAt))} ago
        </Text>

          {currentUser?._id === user._id && 
            <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost}/>
          }
      </Flex>
    </Flex>
    <Text my={3}>{post.text}</Text>
    {post.img && (
      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"}
      borderColor={"gray.light"}>
        <Image src={post.img} w={"full"}></Image>
    </Box>
    )}

      <Flex gap={3} mt={3}>
        <Actions post ={post}/>
      </Flex>

      <Divider mt={4}/>
      {post.replies.map(reply => (
          <Comment
            key={(reply._id)}
            reply={reply}
        />
      ))}

      

    </>
  )
}

export default PostPage
