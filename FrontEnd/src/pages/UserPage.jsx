import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import { Flex, Spinner, Text, VStack, Icon } from "@chakra-ui/react"
import { BsGrid3X3 } from "react-icons/bs"
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';

function UserPage() {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams()
  const showToast = useShowToast()
  const [posts, setPosts] = useState([])
  const [fetchingPost, setFetchingPost] = useState(true)

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPost(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json()
        setPosts(data)
      } catch (error) {
        showToast("Error", error.message, "error")
        setPosts([])
      } finally {
        setFetchingPost(false)
      }
    }
    getPosts();
  }, [username, showToast])

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId))
  }

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} mt={10}>
        <Spinner size="xl" />
      </Flex>
    )
  }
  if (!user && !loading) return <h1>User not Found</h1>
  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />

      {fetchingPost && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {!fetchingPost && posts.length === 0 && (
        <VStack spacing={3} mt={16} mb={8} color={"gray.light"}>
          <Icon as={BsGrid3X3} boxSize={12} />
          <Text fontWeight={"semibold"} fontSize={"lg"}>No posts yet</Text>
          <Text fontSize={"sm"} textAlign={"center"} maxW={"xs"}>
            When {user.name} shares something, it'll show up here.
          </Text>
        </VStack>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} onDelete={handleDeletePost} />
      ))}
    </>
  )
}

export default UserPage
