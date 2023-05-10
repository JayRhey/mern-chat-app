import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Flex,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Toast,
  useToast,
  Spinner, 
} from "@chakra-ui/react"


import React, { useState, useEffect} from "react"
import { ChatState } from "../Context/ChatProvider"
import ProfileModal from "./ProfileModal"
import { useDisclosure } from "@chakra-ui/hooks";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:7000';

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setloading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
      setSelectedChat,
      user,
      notification,
      setNotification,
      chats,
      setChats,
    } = ChatState();
  const history = useHistory()
  const toast = useToast()


  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    history.push("/")
  }


  const socket = io(ENDPOINT);
  socket.emit("setup", user);

  useEffect(() => {
  socket.on("message received", (newMessageReceived) => {
    // Add your logic to update notifications here
    // For example, you can update the `notification` state
    setNotification([...notification, newMessageReceived]);
  });
}, [notification, setNotification]); // Add this useEffect hook to update notifications



  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return; 
    }

    try {
      setloading (true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config)
      setloading(false)
      setSearchResult(data)

    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
      return; 
    }

  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
       const config = {
         headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.post("api/chat", { userId }, config)
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }


    return (
    
      <div>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 100px"
          borderWidth="5px"
        >
          <Flex alignItems="center">
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
              <Button variant="ghost" onClick={onOpen}>
                <i className="fas fa-search"></i>
                <Text display={{ base: "none", md: "flex" }} px="4">
                  Search User
                </Text>
              </Button>
            </Tooltip>
          </Flex>
          <Text fontSize="2xl" fontFamily="Work sans">
            CamFrog
          </Text>
          <Flex alignItems="center">

          <Menu>
                  <MenuButton p={1} as={Button} variant="ghost" position="relative">
                    <i className="fas fa-bell" fontSize="2xl"></i>
                    {notification.length > 0 && (
                      <span
                        className="notification-badge"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          transform: "translate(25%, -25%)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "0.8rem",
                          height: "0.8rem",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          fontSize: "0.5rem",
                          fontWeight: "bold",
                        }}
                      >
                        {notification.length}
                      </span>
                    )}
                  </MenuButton>
                  <MenuList pl={2}>
                    {!notification.length && "No New Messages"}
                    {notification.map((notif) => (
                      <MenuItem
                        key={notif._id}
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotification(notification.filter((n) => n !== notif));
                        }}
                      >
                        {notif.chat.isGroupChat
                          ? `New Message in ${notif.chat.chatName}`
                          : `New Message from ${getSender(user, notif.chat.users)}`}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>



            <Menu ml={2}> 
              <MenuButton as={Button} variant="ghost">
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList >
              <ProfileModal user={user}>
                 <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>


            </MenuList>
            </Menu>
          </Flex>
        </Box>

      
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>

          <DrawerHeader borderBottomWidth="1px">
              Search User
          </DrawerHeader>
          <DrawerBody >
            <Box d="flex" pb={1}>
             <Flex alignItems="center">
              <Input
                placeholder="Search Name or Email"
                mr={0}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>
            </Box>

            {loading ? <ChatLoading /> : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction ={() => accessChat(user._id)}
                />
              ))
            )}

          { loadingChat && <Spinner ml = "auto" d="flex" /> }
          </DrawerBody>

        </DrawerContent>
      </Drawer>

    </div>
  )

  
}



export default SideDrawer
