import {
    Avatar, Box, Flex, Input, InputGroup, InputLeftElement,
    Spinner, Text, VStack, Button,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

const SearchPage = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [followingMap, setFollowingMap] = useState({})
    const showToast = useShowToast()
    const navigate = useNavigate()
    const currentUser = useRecoilValue(userAtom)
    const debounceRef = useRef(null)

    useEffect(() => {
        if (!query.trim()) { setResults([]); return }
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                if (data.error) { showToast("Error", data.error, "error"); return }
                setResults(data)
            } catch (err) {
                showToast("Error", err.message, "error")
            } finally {
                setLoading(false)
            }
        }, 350)
        return () => clearTimeout(debounceRef.current)
    }, [query, showToast])

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

    return (
        <Box>
            <InputGroup mb={6}>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </InputGroup>

            {loading && (
                <Flex justify="center" mt={10}>
                    <Spinner size="lg" />
                </Flex>
            )}

            {!loading && query && results.length === 0 && (
                <Flex direction="column" align="center" mt={16} gap={2} color="gray.500">
                    <Text fontSize="lg" fontWeight="semibold">No results for "{query}"</Text>
                    <Text fontSize="sm">Try a different username or name</Text>
                </Flex>
            )}

            <VStack spacing={4} align="stretch">
                {results.map((u) => {
                    const isFollowing = followingMap[u._id] !== undefined
                        ? followingMap[u._id]
                        : currentUser?.following?.includes(u._id)
                    return (
                        <Flex key={u._id} align="center" gap={3}>
                            <Avatar
                                src={u.profilePic} name={u.name} size="md"
                                cursor="pointer" onClick={() => navigate(`/${u.username}`)}
                            />
                            <Box flex={1} cursor="pointer" onClick={() => navigate(`/${u.username}`)}>
                                <Text fontWeight="bold" fontSize="sm">{u.username}</Text>
                                <Text fontSize="sm" color="gray.light">{u.name}</Text>
                                {u.bio && <Text fontSize="xs" color="gray.500" noOfLines={1}>{u.bio}</Text>}
                            </Box>
                            {u._id !== currentUser?._id && (
                                <Button
                                    size="sm"
                                    variant={isFollowing ? "outline" : "solid"}
                                    onClick={() => handleFollow(u._id)}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            )}
                        </Flex>
                    )
                })}
            </VStack>
        </Box>
    )
}

export default SearchPage
