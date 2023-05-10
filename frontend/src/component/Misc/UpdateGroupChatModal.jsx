import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import HandleBadgeItem from './HandleBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    
const { isOpen, onOpen, onClose } = useDisclosure();
const [groupChatName, setGroupChatName] = useState();
const [selectedUsers, setSelectedUsers] = useState([])
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [renameLoading, setRenameLoading] = useState(false);
const { user, selectedChat, setSelectedChat } = ChatState() 
const [loading, setLoading] = useState(false);
    
const toast = useToast()

    
 
const handleRename = async () => {
    if (!groupChatName) return 
    try {
        setRenameLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }

        const { data } = await axios.put('api/chat/rename', {
            chatId: selectedChat._id,
            chatName:groupChatName,
        }, config)

        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRenameLoading(false)


    } catch (error) {
         toast({
            title: "failed to Create the Chat!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
          setRenameLoading(false)
    }
    setGroupChatName("")
} 
    
const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
        return;
    }
    try {
        setLoading(true);

        const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        setLoading(false);
        setSearchResult(data);
    } catch (error) {
        toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        });
    }
} 
    

const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
};  
 
const handleRemove = async (user1) => {
       if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
            title: "Only Admin can Add Someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position:"bottom",
        })
        return
    }
    try {
        setLoading(true);

        const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        };
       const { data } = await axios.put(`/api/chat/groupremove`, {
           chatId: selectedChat._id,
           userId: user1._id,
        },config);
        // setSelectedChat(data)

        user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        fetchMessages()
        setRenameLoading(false)
        setLoading(false);
        toast({
            title: "Successfully Remove",
            status: "success",
            duration: 5000,
            isClosable: true,
            position:"bottom",
        })
    } catch (error) {
        toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
        });
    }
}  
    
  return (
    <>
    <IconButton
        d={{ base: "flex" }}
        icon={<i className="fas fa-eye"></i>}
        onClick={onOpen}
    />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
                  <ModalHeader>{ selectedChat.chatName } </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users && Array.isArray(selectedChat.users) && selectedChat.users.map((u) => {
                // Only render the badge item if the user's ID does not match the ID of the logged-in user
                if (u._id !== user._id) {
                return (
                    <HandleBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                    />
                );
                }
                return null;
            })}
            </Box>

                     <FormControl display="flex" alignItems="center">
                        <Input
                            placeholder="Chat Name"
                            mr={2}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                      </FormControl>
                            <br/>
                      <FormControl >
                          <Input
                            placeholder='Add User to Group'
                            mb={3}
                            onChange={(e) => handleSearch(e.target.value)}  
                          />
                      </FormControl>
                     {loading ? (
                        <Spinner size="lg" />
                        ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleAddUser(user)}
                            />
                        ))
                        )}
                      
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)}  colorScheme='red' mr={3} >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
