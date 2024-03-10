import React from 'react';
import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import { Flex, Spinner, useToast } from "@chakra-ui/react"
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';

function UserPage() {
  const {user,loading} = useGetUserProfile();
  const {username} = useParams()
  const showToast = useToast()
  const [posts,setPosts] = useState([])
  const [fetchingPost,setFetchingPost] =useState(true)

  useEffect(() =>{

    const getPosts = async () => {
      setFetchingPost(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json()
        console.log(data)
        setPosts(data)
      } catch (error) {
        showToast("Error",error.message,"error")
        setPosts([])
      } finally {
        setFetchingPost(false)
      }
    }

    getPosts();
  },[username,showToast]) 


  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>

    )
  }
  if(!user && !loading) return <h1>User not Found</h1>

  if(!user) return null;

 
  
  return (
    <>
			<UserHeader user={user} />
      {!fetchingPost && posts.length === 0 && <h1>user has no Posts</h1>}
      {fetchingPost && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />

        </Flex>
      )}

      {posts.map( (post) => (
        <Post key={post._id} post ={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default UserPage 
