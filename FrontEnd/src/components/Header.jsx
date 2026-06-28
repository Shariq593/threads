import { Flex, Image, Link, useColorMode, Box, Badge } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { BsSearch, BsCompass, BsBell, BsBookmark } from "react-icons/bs"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

function Header() {
    const { colorMode, toggleColorMode } = useColorMode()
    const user = useRecoilValue(userAtom)
    const location = useLocation()
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (!user) return
        const fetchUnread = async () => {
            try {
                const res = await fetch("/api/notifications")
                const data = await res.json()
                if (!data.error) {
                    setUnreadCount(data.filter(n => !n.read).length)
                }
            } catch (_) {}
        }
        fetchUnread()
    }, [user, location.pathname])

    const NavIcon = ({ to, icon: Icon, label }) => {
        const active = location.pathname === to
        return (
            <Link as={RouterLink} to={to} title={label}>
                <Icon size={24} style={{ opacity: active ? 1 : 0.6 }} />
            </Link>
        )
    }

    return (
        <Flex justifyContent="space-between" alignItems="center" mt={6} mb={12}>
            {user ? (
                <NavIcon to="/" icon={AiFillHome} label="Home" />
            ) : <Box w={6} />}

            <Image
                cursor="pointer"
                alt="logo"
                w={6}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            />

            {user && (
                <Flex gap={5} alignItems="center">
                    <NavIcon to="/search" icon={BsSearch} label="Search" />
                    <NavIcon to="/explore" icon={BsCompass} label="Explore" />
                    <Box position="relative">
                        <Link as={RouterLink} to="/notifications" title="Notifications">
                            <BsBell size={24} style={{ opacity: location.pathname === "/notifications" ? 1 : 0.6 }} />
                        </Link>
                        {unreadCount > 0 && (
                            <Badge
                                position="absolute" top="-4px" right="-6px"
                                colorScheme="red" borderRadius="full"
                                fontSize="9px" minW="16px" textAlign="center"
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        )}
                    </Box>
                    <NavIcon to="/bookmarks" icon={BsBookmark} label="Saved" />
                    <Link as={RouterLink} to={`/${user.username}`} title="Profile">
                        <RxAvatar size={24} style={{ opacity: location.pathname === `/${user.username}` ? 1 : 0.6 }} />
                    </Link>
                </Flex>
            )}
        </Flex>
    )
}

export default Header
