import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Box
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import HandleBadgeItem from './HandleBadgeItem'


const GroupChatModel = ({ children }) => {
const { isOpen, onOpen, onClose } = useDisclosure();
const [groupChatName, setGroupChatName] = useState();
const [selectedUsers, setSelectedUsers] = useState([]);
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);

const toast = useToast()
    
const { user, chats, setChats } = ChatState()
    
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
};

const handleSubmit = async () => {

    if (!groupChatName || !selectedUsers) {
        toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
        return
        }

    try {
        setLoading(true);
        const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
            
    const { data } = await axios.post(`/api/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
    },
        config
    );
       setChats([data, ...chats])
       setLoading(true);
        onClose()
        toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        setLoading(false);
        setSearchResult(data);
        return
    } catch (error) {
        toast({
            title: "failed to Create the Chat!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
         return
    }

}
    
const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
}


const handleGroup = (userToAdd) => {
  if (selectedUsers.some((u) => u._id === userToAdd._id)) {
    toast({
      title: "User already added",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    return;
  }
  setSelectedUsers([...selectedUsers, userToAdd]);
};

    
  return (
      <>
        <span onClick={onOpen}> { children } </span>
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
        >Create Group Chat</ModalHeader>
          <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
                      
                <FormControl>
                    <Input
                        placeholder='Chat Name'
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                </FormControl>
                      
                <FormControl>
                    <Input
                        placeholder='Add Users: '
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                      
                <Box w="100%" d="flex" flexWrap ="wrap">
                {selectedUsers.map(u => (
                    <HandleBadgeItem
                        key={u._id}  // use u._id as the key prop
                        user={u}
                        handleFunction={() => handleDelete(u)}
                    />   
                 ))}
                </Box>
               
                {loading ? <div>loading</div> : (Array.isArray(searchResult) && searchResult.slice(0, 4).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />  
                )))}
 


            </ModalBody>
          <ModalFooter>
            <Button variant='solid' colorScheme='green' mr={3} onClick={handleSubmit} >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel
