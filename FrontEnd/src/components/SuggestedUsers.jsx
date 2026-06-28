import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"

const SuggestedUsers = () => {
    const [users, setUsers] = useState([])
    const [followingMap, setFollowingMap] = useState({})
    const showToast = useShowToast()
    const navigate = useNavigate()

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await fetch("/api/users/suggested")
                const data = await res.json()
                if (data.error || !Array.isArray(data)) return
                setUsers(data)
            } catch (_) {}
        }
        fetch_()
    }, [])

    const handleFollow = async (userId) => {
        try {
            const res = await fetch(`/api/users/follow/${userId}`, { method: "POST" })
            const data = await res.json()
            if (data.error) return showToast("Error", data.error, "error")
            setFollowingMap(m => ({ ...m, [userId]: !m[userId] }))
        } catch (err) {
            showToast("Error", err.message, "error")
        }
    }

    if (users.length === 0) return null

    return (
        <Box mt={6}>
            <Text fontWeight="bold" fontSize="sm" mb={4} color="gray.light">
                Suggested for you
            </Text>
            <VStack spacing={4} align="stretch">
                {users.map((u) => (
                    <Flex key={u._id} align="center" gap={3}>
                        <Avatar
                            src={u.profilePic} name={u.name} size="sm"
                            cursor="pointer" onClick={() => navigate(`/${u.username}`)}
                        />
                        <Box flex={1} cursor="pointer" onClick={() => navigate(`/${u.username}`)}>
                            <Text fontSize="sm" fontWeight="bold">{u.username}</Text>
                            <Text fontSize="xs" color="gray.light">{u.name}</Text>
                        </Box>
                        <Button
                            size="xs"
                            variant={followingMap[u._id] ? "outline" : "solid"}
                            onClick={() => handleFollow(u._id)}
                        >
                            {followingMap[u._id] ? "Following" : "Follow"}
                        </Button>
                    </Flex>
                ))}
            </VStack>
        </Box>
    )
}

export default SuggestedUsers
