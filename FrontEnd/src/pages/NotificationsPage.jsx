import {
    Avatar, Box, Button, Flex, Spinner, Text, VStack, Badge,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import useShowToast from "../hooks/useShowToast"

const typeLabel = {
    like: "liked your post",
    reply: "replied to your post",
    follow: "followed you",
    repost: "reposted your post",
}

const typeColor = {
    like: "red.400",
    reply: "blue.400",
    follow: "green.400",
    repost: "purple.400",
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const showToast = useShowToast()
    const navigate = useNavigate()

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await fetch("/api/notifications")
                const data = await res.json()
                if (data.error) { showToast("Error", data.error, "error"); return }
                setNotifications(data)
                await fetch("/api/notifications/read", { method: "PUT" })
            } catch (err) {
                showToast("Error", err.message, "error")
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [showToast])

    const clearAll = async () => {
        try {
            await fetch("/api/notifications", { method: "DELETE" })
            setNotifications([])
        } catch (err) {
            showToast("Error", err.message, "error")
        }
    }

    if (loading) return <Flex justify="center" mt={10}><Spinner size="xl" /></Flex>

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontWeight="bold" fontSize="lg">Notifications</Text>
                {notifications.length > 0 && (
                    <Button size="xs" variant="ghost" colorScheme="red" onClick={clearAll}>
                        Clear all
                    </Button>
                )}
            </Flex>

            {notifications.length === 0 && (
                <Flex direction="column" align="center" mt={20} gap={3} color="gray.500">
                    <Text fontSize="2xl">🔔</Text>
                    <Text fontWeight="semibold">No notifications yet</Text>
                    <Text fontSize="sm">When someone likes, replies, or follows you — it'll show up here.</Text>
                </Flex>
            )}

            <VStack spacing={3} align="stretch">
                {notifications.map((n) => (
                    <Flex
                        key={n._id}
                        align="center" gap={3} p={3}
                        borderRadius="md"
                        bg={n.read ? "transparent" : "whiteAlpha.50"}
                        _hover={{ bg: "whiteAlpha.100" }}
                        cursor="pointer"
                        onClick={() => {
                            if (n.type === "follow") navigate(`/${n.from.username}`)
                            else if (n.post) navigate(`/${n.from.username}/post/${n.post._id}`)
                        }}
                    >
                        <Box position="relative">
                            <Avatar src={n.from?.profilePic} name={n.from?.username} size="sm" />
                            <Badge
                                position="absolute" bottom="-1" right="-1"
                                colorScheme={n.type === "like" ? "red" : n.type === "follow" ? "green" : n.type === "repost" ? "purple" : "blue"}
                                borderRadius="full" fontSize="8px" p="2px"
                            >
                                {n.type === "like" ? "♥" : n.type === "follow" ? "+" : n.type === "repost" ? "↻" : "↩"}
                            </Badge>
                        </Box>
                        <Box flex={1}>
                            <Text fontSize="sm">
                                <Text as="span" fontWeight="bold">{n.from?.username}</Text>
                                {" "}{typeLabel[n.type]}
                            </Text>
                            {n.post?.text && (
                                <Text fontSize="xs" color="gray.500" noOfLines={1}>{n.post.text}</Text>
                            )}
                        </Box>
                        <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                            {formatDistanceToNow(new Date(n.createdAt))} ago
                        </Text>
                    </Flex>
                ))}
            </VStack>
        </Box>
    )
}

export default NotificationsPage
