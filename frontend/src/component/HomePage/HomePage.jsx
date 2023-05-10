import React from 'react'
import { Box, Container,TabList,Tab,Tabs,TabPanels,TabPanel,Text } from '@chakra-ui/react'
import Login from '../Authentication/Login'
import SignUp from '../Authentication/SignUp'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect, useState } from "react";


const HomePage = () => {
  const [users, setUser] = useState(null);
  const history = useHistory()
  console.log(history)

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo)

        if (!userInfo) {
            history.push('/')
        }
    },[history])


  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m='100px 0 15px 0'
        borderRadius="lg"
        borderWidth='1px'
      >
        <center>
          <Text 
            fontSize='4xl'
            fontFamily='Work Sans'
            color='black'>CamFrog
          </Text>
        </center>
      </Box>

      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        borderWidth='1px'>
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
          <TabList mb='1em'>
            <Tab fontFamily='Work Sans'>Login</Tab>
            <Tab fontFamily='Work Sans'>Sign-up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

    </Container>
  )
}

export default HomePage
