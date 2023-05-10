import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast 
}
    from '@chakra-ui/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './SignUp.css'
import axios from "axios"

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [show2,setShow2] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setPicLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleClick = () => setShow(!show)
    const handleClick2 = () => setShow2(!show2)

    const resetForm = async () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPic('');
    };



   const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
        toast({
            title: "Please Select an Image.",
            description: "Image must be PNG / JPG only.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chatApp");
        data.append("cloud_name", "da8aedioq");
        fetch("https://api.cloudinary.com/v1_1/da8aedioq/image/upload", {
        method: "post",
        body: data,
        })
        .then((res) => res.json())
        .then((data) => {
            setPic(data.url.toString());
            setPicLoading(false);
            console.log(data)
            toast({
            title: "Image accepted.",
            description: "Image must be PNG / JPG only.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        })
        .catch((err) => {
            console.log(err);
            setPicLoading(false);
            toast({
                title: "Failed to upload image.",
                description: "Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        });
    } else {
        toast({
            title: "Please Select an Image.",
            description: "Image must be PNG / JPG only.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
    }
};

    const submitHandler = async (e) => {
        e.preventDefault();
        setPicLoading(true)
        if (!name || !email || !password || !confirmpassword) {
        toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        setPicLoading(false);
        return;
        }
        if (password !== confirmpassword) {
            toast({
            title: "Password Do Not Match",
            description: "Password must be the same please click the 'Hide' / 'Show' ",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
            });
            setPicLoading(false);
            return
            
        }

        try {
            const config = {
                header: {
                    "Content-type":"application/json",
                },
            }
            const { data } = await axios.post("api/user/", {name, email, password, pic}, config )
            toast({
            title: "Registration Success",
            description: "Please make sure to have a copy of your credentials ",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
            });

            
            localStorage.setItem('userInfo', JSON.stringify(data))
            setPicLoading(false)
            resetForm();
            history.push('/')
            
        } catch (error) {
            toast({
            title: "Error Occured",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
            });
            setPicLoading(false)
        }

    }

  return (
      <VStack spacing='5px' fontFamily='Work Sans' id="SignUp">
          
        <FormControl id='first-name' isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                  placeholder='Enter Your Name'
                  onChange={(e)=>setName(e.target.value)}
              />
          </FormControl>

          <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                  placeholder='Enter Your Email'
                  onChange={(e)=>setEmail(e.target.value)}
              />
          </FormControl>

          <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                    <Input
                    type={show ? "text" : "password"}
                    placeholder='Enter Your Password'
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <Button
                          variant="unstyled"
                          _hover={{ bg: "none" }}
                          h='1.70rem'
                          size='xs'
                          background='none'
                          onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
              </InputGroup>
          </FormControl>

          <FormControl id='confirmpassword' isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                    <Input
                    type={show2 ? "text" : "password"}
                    placeholder='Enter Your Confirm Password'
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <Button
                          variant="unstyled"
                          _hover={{ bg: "none" }}
                          h='1.70rem'
                          size='xs'
                          background='none'
                          onClick={handleClick2}>
                          {show2 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
              </InputGroup>
          </FormControl>

         <FormControl id='pic'>
            <FormLabel>Upload your Picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/'
                onChange={(e)=>postDetails(e.target.files[0])}
                bg='gray.50'
                color='gray.800'
                _hover={{ bg: 'gray.100' }}
                _active={{ bg: 'gray.200' }}
                sx={{
                '&::-webkit-file-upload-button': {
                    bg: '#38a169',
                    color: 'white',
                    _hover: { bg: 'gray.100' },
                    _active: { bg: 'gray.200' },
                    cursor: 'pointer',
                    px: 4,
                    py: 0,
                    borderRadius: 'md',
                    borderColor: 'gray.400',
                    outline: 'none',
                    boxShadow: 'md',
                    transition: 'all 0.2s',
                    _focus: { boxShadow: 'outline' },
                },
                }}
            />
            </FormControl>
          
          <Button
              colorScheme='green'
              width='100%'
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}>
              Sign Up
          </Button>
          
    </VStack>
  )
}

export default SignUp
