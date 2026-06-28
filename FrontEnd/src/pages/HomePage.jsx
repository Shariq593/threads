import { Flex, Spinner, Text, Divider } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [suggested, setSuggested] = useState(false)
  const showToast = useShowToast()
  const user = useRecoilValue(userAtom)

  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setSuggested(data.suggested || false)
        setPosts(data.posts || [])
      } catch (error) {
        showToast("error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }
    getFeedPost()
  }, [showToast])

  return (
    <>
      {loading && (
        <Flex justify={"center"} mt={10}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {!loading && suggested && (
        <>
          <Text fontWeight={"bold"} fontSize={"lg"} mb={1}>
            Suggested for you
          </Text>
          <Text fontSize={"sm"} color={"gray.light"} mb={4}>
            Follow people to see their posts here
          </Text>
          <Divider mb={4} />
        </>
      )}

      {!loading && !suggested && posts.length === 0 && (
        <Flex direction={"column"} align={"center"} mt={20} gap={3}>
          <Text fontSize={"2xl"}>😶</Text>
          <Text fontWeight={"bold"}>Nothing here yet</Text>
          <Text fontSize={"sm"} color={"gray.light"}>
            Follow some users to see their posts in your feed
          </Text>
        </Flex>
      )}

      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          postedBy={post.postedBy}
          onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
        />
      ))}
    </>
  )
}

export default HomePage
