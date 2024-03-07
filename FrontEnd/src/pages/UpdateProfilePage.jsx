'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useRef, useState } from 'react'
import usePreviewimg from '../hooks/usePreviewimg'
import useShowToast from '../hooks/useShowToast'

export default function UpdateProfilePage() {

    const [user,setUser] = useRecoilState(userAtom)
    const [inputs,setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
    })

    const  fileRef = useRef(null)
    const [updating,setUpdating] = useState(false)

    const showToast = useShowToast()

    const {handleImageChange,imgUrl} = usePreviewimg()
    const handleSubmit = async  (e) => {
      e.preventDefault();
      if(updating) return;
      setUpdating(true)

      try {
        const res= await fetch(`/api/users/update/${user._id}`,{
          method:"PUT",
          headers:{
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({...inputs, profilePic: imgUrl})
        })
        const data =await res.json()
        if(data.erroe){
          showToast("Error",data.error,error)
          return
        }
        showToast("Success","Profile Updates Successfully","success" )
        setUser(data);
        localStorage.setItem("user-threads",JSON.stringify(data))
        console.log(data)
      } catch (error) {
        showToast('Error',error,'error')
      } finally{
        setUpdating(false)
      }
    }


  return (
    <form  onSubmit={handleSubmit} >
      <Flex
        align={'center'}
        justify={'center'}
        my={6}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl >
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={"d"} src={imgUrl ||  user.profilePic}/>
              </Center>
              <Center w="full">
                <Button w="full" onClick ={() => fileRef.current.click()}>Change Profile</Button>
                <Input type='file' hidden ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl  isRequired>
            <FormLabel>Full name</FormLabel>
              <Input
                  placeholder="Full Name"
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value})}
                  _placeholder={{ color: 'gray.500' }}
                  type="text"
            />
            </FormControl>
          <FormControl  isRequired>
              <FormLabel>User name</FormLabel>
                  <Input
                      value={inputs.username}
                      onChange={(e) => setInputs({ ...inputs, username: e.target.value})}
                      placeholder="UserName"
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
            />
          </FormControl>
          <FormControl  isRequired>
              <FormLabel>Email address</FormLabel>
                  <Input
                      value={inputs.email}
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value})}
                      placeholder="your-email@example.com"
                      _placeholder={{ color: 'gray.500' }}
                      type="email"
            />
          </FormControl>
          <FormControl  >
              <FormLabel>Bio</FormLabel>
              <Input
                placeholder='Your bio.'
                value={inputs.bio}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                _placeholder={{ color: "gray.500" }}
                type='text'
						  />
          </FormControl>
          <FormControl  >
            <FormLabel>Password</FormLabel>
              <Input
                  placeholder="password"
                  _placeholder={{ color: 'gray.500' }}
                  type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button

              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
              type='submit'
              bg={'green.400'}
              color={'white'}
              w="full"
              isLoading={updating}
              _hover={{
                bg: 'green.500',
                
              }}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  )
}