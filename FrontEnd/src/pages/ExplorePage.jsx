import { Flex, Spinner, Text, Button, VStack } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post"

const ExplorePage = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const showToast = useShowToast()

    const fetchPosts = async (p = 1, append = false) => {
        try {
            const res = await fetch(`/api/posts/explore?page=${p}`)
            const data = await res.json()
            if (data.error) { showToast("Error", data.error, "error"); return }
            setPosts(prev => append ? [...prev, ...data.posts] : data.posts)
            setHasMore(data.hasMore)
        } catch (err) {
            showToast("Error", err.message, "error")
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => { fetchPosts(1) }, [])

    const loadMore = async () => {
        const next = page + 1
        setPage(next)
        setLoadingMore(true)
        await fetchPosts(next, true)
    }

    if (loading) return <Flex justify="center" mt={10}><Spinner size="xl" /></Flex>

    return (
        <VStack spacing={0} align="stretch">
            <Text fontWeight="bold" fontSize="lg" mb={4}>Explore</Text>
            {posts.map((post) => (
                <Post
                    key={post._id} post={post} postedBy={post.postedBy}
                    onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))}
                />
            ))}
            {hasMore && (
                <Flex justify="center" my={6}>
                    <Button onClick={loadMore} isLoading={loadingMore} variant="outline" size="sm">
                        Load more
                    </Button>
                </Flex>
            )}
            {!hasMore && posts.length > 0 && (
                <Text textAlign="center" color="gray.500" fontSize="sm" my={6}>
                    You've seen everything
                </Text>
            )}
        </VStack>
    )
}

export default ExplorePage
