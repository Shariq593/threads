import {
    Box, Button, Flex, FormControl, Input, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Text, useDisclosure, Tooltip,
} from "@chakra-ui/react"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/useShowToast"

const Actions = ({ post: post_ }) => {
    const user = useRecoilValue(userAtom)
    const [liked, setLiked] = useState(post_?.likes.includes(user?._id))
    const [reposted, setReposted] = useState(post_?.reposts?.includes(user?._id))
    const [bookmarked, setBookmarked] = useState(false)
    const [post, setPost] = useState(post_)
    const [reply, setReply] = useState("")
    const [isReplying, setIsReplying] = useState(false)
    const showToast = useShowToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    if (!post_) return null

    const handleLike = async () => {
        if (!user) return showToast("Error", "You must be logged in to like a post", "error")
        const prevLiked = liked
        setLiked(!prevLiked)
        setPost(p => ({
            ...p,
            likes: prevLiked
                ? p.likes.filter(id => id !== user._id)
                : [...p.likes, user._id],
        }))
        try {
            const res = await fetch("/api/posts/like/" + post._id, { method: "PUT" })
            const data = await res.json()
            if (data.error) {
                setLiked(prevLiked)
                showToast("Error", data.error, "error")
            }
        } catch (error) {
            setLiked(prevLiked)
        }
    }

    const handleRepost = async () => {
        if (!user) return showToast("Error", "You must be logged in to repost", "error")
        const prev = reposted
        setReposted(!prev)
        setPost(p => ({
            ...p,
            reposts: prev
                ? (p.reposts || []).filter(id => id !== user._id)
                : [...(p.reposts || []), user._id],
        }))
        try {
            const res = await fetch("/api/posts/repost/" + post._id, { method: "PUT" })
            const data = await res.json()
            if (data.error) {
                setReposted(prev)
                showToast("Error", data.error, "error")
            } else {
                showToast("Success", data.message, "success")
            }
        } catch (error) {
            setReposted(prev)
        }
    }

    const handleBookmark = async () => {
        if (!user) return showToast("Error", "You must be logged in to bookmark", "error")
        const prev = bookmarked
        setBookmarked(!prev)
        try {
            const res = await fetch("/api/posts/bookmark/" + post._id, { method: "PUT" })
            const data = await res.json()
            if (data.error) {
                setBookmarked(prev)
                showToast("Error", data.error, "error")
            } else {
                showToast("Success", data.message, "success")
            }
        } catch (error) {
            setBookmarked(prev)
        }
    }

    const handleReply = async () => {
        if (!user) return showToast("Error", "You must be logged in to reply", "error")
        if (isReplying) return
        setIsReplying(true)
        try {
            const res = await fetch("/api/posts/reply/" + post._id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: reply }),
            })
            const data = await res.json()
            if (data.error) return showToast("Error", data.error, "error")
            setPost(p => ({ ...p, replies: [...p.replies, { userId: user._id, text: reply, username: user.username, userProfilePic: user.profilePic }] }))
            showToast("Success", "Reply posted", "success")
            onClose()
            setReply("")
        } catch (error) {
            showToast("Error", error.message, "error")
        } finally {
            setIsReplying(false)
        }
    }

    return (
        <Flex flexDirection="column">
            <Flex gap={3} my={2} onClick={(e) => e.preventDefault()} alignItems="center">
                {/* Like */}
                <Tooltip label={liked ? "Unlike" : "Like"}>
                    <svg
                        aria-label="Like"
                        color={liked ? "rgb(237, 73, 86)" : ""}
                        fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                        height="19" role="img" viewBox="0 0 24 22" width="20"
                        onClick={handleLike} style={{ cursor: "pointer" }}
                    >
                        <path d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </Tooltip>

                {/* Comment */}
                <Tooltip label="Reply">
                    <svg
                        aria-label="Comment" fill="" height="20" role="img"
                        viewBox="0 0 24 24" width="20" onClick={onOpen}
                        style={{ cursor: "pointer" }}
                    >
                        <title>Comment</title>
                        <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                </Tooltip>

                {/* Repost */}
                <Tooltip label={reposted ? "Undo repost" : "Repost"}>
                    <svg
                        aria-label="Repost"
                        color={reposted ? "rgb(0, 186, 124)" : "currentColor"}
                        fill={reposted ? "rgb(0, 186, 124)" : "currentColor"}
                        height="20" role="img" viewBox="0 0 24 24" width="20"
                        onClick={handleRepost} style={{ cursor: "pointer" }}
                    >
                        <title>Repost</title>
                        <path fill="" d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z" />
                    </svg>
                </Tooltip>

                {/* Bookmark */}
                <Tooltip label={bookmarked ? "Remove bookmark" : "Bookmark"}>
                    <svg
                        aria-label="Bookmark"
                        fill={bookmarked ? "currentColor" : "transparent"}
                        height="20" role="img" viewBox="0 0 24 24" width="20"
                        onClick={handleBookmark} style={{ cursor: "pointer" }}
                    >
                        <title>Bookmark</title>
                        <path d="M6 2a2 2 0 0 0-2 2v18l8-4 8 4V4a2 2 0 0 0-2-2H6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                </Tooltip>

                <Flex gap={2} alignItems="center" ml="auto">
                    <Text color="gray.light" fontSize="sm">{post.replies.length} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius="full" bg="gray.light" />
                    <Text color="gray.light" fontSize="sm">{post.likes.length} likes</Text>
                    {(post.reposts?.length > 0) && (
                        <>
                            <Box w={0.5} h={0.5} borderRadius="full" bg="gray.light" />
                            <Text color="gray.light" fontSize="sm">{post.reposts.length} reposts</Text>
                        </>
                    )}
                </Flex>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reply to post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input
                                placeholder="Write your reply..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleReply()}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} size="sm" onClick={handleReply} isLoading={isReplying}>
                            Reply
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default Actions
