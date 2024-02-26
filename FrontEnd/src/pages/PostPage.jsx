import { Avatar, Flex, Box, Image, Text, Divider } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions.jsx";
import { useState } from "react";
import Comment from "../components/Comment.jsx";

function PostPage() {
  const [liked,setLiked] = useState(false)
  return (
    <>
    <Flex>
     <Flex w={"full"}  alignItems={"center"} gap={3}>
        <Avatar src="/zuck-avatar.png" size={"md"} name="Mark Zuckerberg"/>
        <Flex>
          <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerberg</Text>
          <Image src="/verified.png" w={4} h={4} ml={4}/>
        </Flex>
      </Flex>
      <Flex gap={4} alignItems={"center"}>
        <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
        <BsThreeDots/>
      </Flex>
    </Flex>
    <Text my={3}>Lets talk about threads</Text>
    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"}
        borderColor={"gray.light"}>
          <Image src={"/post1.png"} w={"full"}></Image>
      </Box>

      <Flex gap={3} mt={3}>
        <Actions liked={liked} setLiked={setLiked}/>
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>238 replies</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}> 
          {200 + (liked ? 1 : 0)} likes
         </Text>
      </Flex>
      <Divider mt={4}/>
      <Comment
        comment="looks really good"
        createdAt ="2d"
        likes={100}
        username="amaan"
        userAvatar=" https://bit.ly/dan-abramov"
      />
      <Comment
        comment="Nice"
        createdAt ="1d"
        likes={400}
        username="shariq"
        userAvatar=" https://bit.ly/code-beast"
      />
      <Comment
        comment="Aee jaa re"
        createdAt ="1d"
        likes={234}
        username="talha"
        userAvatar=" https://bit.ly/kent-c-dodds"
      />

    </>
  )
}

export default PostPage
