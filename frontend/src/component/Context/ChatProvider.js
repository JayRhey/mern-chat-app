import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]); // Add the notification state
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    } else {
      history.push('/');
    }
  }, [history]);

  return (
    <ChatContext.Provider value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
