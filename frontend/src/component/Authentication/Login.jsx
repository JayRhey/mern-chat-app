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
import './SignUp.css'
import { useHistory } from 'react-router-dom'
import axios from "axios"


const Login = () => {
    const [show3,setShow3] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setPicLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleClick3 = () => setShow3(!show3)
    const submitHandler = async (e) => {
        e.preventDefault();
        setPicLoading(true)
        if (!email || !password) {
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
        try {
            const config = {
                header: {
                    "Content-type":"application/json",
                },
            }
            const { data } = await axios.post("api/user/login", { email, password }, config )
            toast({
            title: "Login Successful",
            description: "Hooray!!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
            });

           localStorage.setItem('userInfo', JSON.stringify(data))
           setPicLoading(false)
           history.replace('/chat')
           document.location.reload(true)
            
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
      <VStack spacing='5px' fontFamily='Work Sans' id="login">
          
          <FormControl id='email2' isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                  placeholder='Enter Your Email'
                  onChange={(e)=>setEmail(e.target.value)}
              />
          </FormControl>

          <FormControl id='password2' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                    <Input
                    type={show3 ? "text" : "password"}
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
                          onClick={handleClick3}>
                          {show3 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
              </InputGroup>
          </FormControl>
          
          <Button
              colorScheme='green'
              width='100%'
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}>
              Login
          </Button>
    </VStack>
  )
}

export default Login
