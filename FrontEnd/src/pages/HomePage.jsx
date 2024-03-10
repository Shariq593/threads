import {  Flex, Spinner } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";


const HomePage =() => {
  const [posts,setPosts] = useState([])
  const [ loading,setLoading] = useState(true)
  const showToast = useShowToast 
  useEffect( () => {
    const getFeedPost = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json()
        if(data.error){
          showToast("Error",data.error,"error")
          return
        }
        setPosts(data)

      } catch (error) {

        showToast("error",error.message,"error")
      } finally {
        setLoading(false)
      }
    }
    getFeedPost()
  },[showToast])

  const user = useRecoilValue(userAtom)
  return (
    <>
      {!loading && posts.length === 0 && (<h1> Follow Some Users to see the Feed</h1>)}


      {loading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
     {posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}


    </>
  )
}

export default HomePage
