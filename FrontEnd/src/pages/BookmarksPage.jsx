import { Flex, Spinner, Text, VStack, Icon } from "@chakra-ui/react"
import { BsBookmark } from "react-icons/bs"
import { useState, useEffect } from "react"
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post"

const BookmarksPage = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const showToast = useShowToast()

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await fetch("/api/posts/bookmarks")
                const data = await res.json()
                if (data.error) { showToast("Error", data.error, "error"); return }
                setPosts(Array.isArray(data) ? data : [])
            } catch (err) {
                showToast("Error", err.message, "error")
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [showToast])

    if (loading) return <Flex justify="center" mt={10}><Spinner size="xl" /></Flex>

    return (
        <VStack spacing={0} align="stretch">
            <Text fontWeight="bold" fontSize="lg" mb={4}>Saved</Text>
            {posts.length === 0 && (
                <Flex direction="column" align="center" mt={20} gap={3} color="gray.500">
                    <Icon as={BsBookmark} boxSize={10} />
                    <Text fontWeight="semibold">Nothing saved yet</Text>
                    <Text fontSize="sm">Bookmark posts to find them here later.</Text>
                </Flex>
            )}
            {posts.map((post) => (
                <Post
                    key={post._id} post={post} postedBy={post.postedBy}
                    onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))}
                />
            ))}
        </VStack>
    )
}

export default BookmarksPage
