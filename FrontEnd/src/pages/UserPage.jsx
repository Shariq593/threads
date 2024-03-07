import React from 'react';
import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom"
import { useToast } from "@chakra-ui/react"

function UserPage() {

  const [user,setUser] = useState(null)
  const {username} = useParams()
  const showToast = useToast()
  useEffect(() =>{
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				console.log(data);
        if(data.error){
          showToast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return
        }
        setUser(data)
      } catch (error) {
        showToast("Error",error,"error")

      }
    }

    getUser();
  },[username,showToast]) 

if(!user) return null;

 
  
  return (
    <>
			<UserHeader user={user} />
      <UserPost likes={241} replies={345} postImg = "/post1.png " postTitle ="Lets talk about threads"/>
      <UserPost likes={451} replies={214} postImg ="/post2.png" postTitle =" Nice tutorial"/>
      <UserPost likes={134} replies={213} postImg ="/post3.png" postTitle =" Not a nice guy"/>
      <UserPost likes={435} replies={543}  postTitle =" This is my first post"/>
      
    </>
  )
}

export default UserPage 
