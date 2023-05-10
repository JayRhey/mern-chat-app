import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { getSenderFull, getSender } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:7000';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);


  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const toast = useToast();
  const scrollableChatRef = useRef(null);

  const [socket, setSocket] = useState(null);

  const fetchMessages = async () => {

  if (!selectedChat) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoading(true);

    const newSocket = io(ENDPOINT); // Create a new socket instance
    newSocket.emit("setup", user);
    newSocket.on("connected", () => setSocketConnected(true));
    newSocket.on("typing", () => setIsTyping(true));
    newSocket.on("stop typing", () => setIsTyping(false));

    setSocket(newSocket); // Set the socket instance in the state

    newSocket.emit("join chat", selectedChat._id);

    const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
    setMessages(data);
    setLoading(false);
    console.log("fetch message");
  } catch (error) {
    // Handle error
  }
};

useEffect(() => {
  fetchMessages();

  return () => {
    if (socket) {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    }
  };
}, [selectedChat]);


  useEffect(() => {
    if (socket) {
      console.log(socket)
      socket.on("message received", (newMessageReceived) => {
        if (
          !selectedChat || // if chat is not selected or doesn't match current chat
          selectedChat._id !== newMessageReceived.chat._id
        ) {
          // Do something with the notification
          if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
          
        }
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollableChatRef.current) {
      scrollableChatRef.current.scrollTop = scrollableChatRef.current.scrollHeight;
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage && selectedChat) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);

        if (socket) {
          socket.emit('new message', { chat: selectedChat, sender: user, ...data });
        }
        setMessages((prevMessages) => [...prevMessages, data]);
                setNewMessage('');
      } catch (error) {
        toast({
          title: 'Failed to send message!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id )
    }

    let lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        console.log("typo message");
        setTyping(false)
      }

    }, timerLength)


  };

  return (
   <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
               icon={<i className="fas fa-hand-point-left"></i>}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {selectedChat && selectedChat.users.includes(user.id) && (
                  <Text fontSize="sm" color="gray.500">
                    {istyping ? 'You are typing...' : ''}
                  </Text>
                )}
                {selectedChat && !selectedChat.users.includes(user.id) && (
                  <Text fontSize="sm" color="gray.500">
                    {istyping ? 'User is typing...' : ''}
                  </Text>
                )}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>


          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

