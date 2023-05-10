import { Box } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Misc/SideDrawer";
import MyChats from "../Misc/MyChats";
import ChatBox from "../Misc/ChatBox";

const Chatpage = () => {
  
  const { user, selectedChat, setUser } = ChatState(false);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // handle case where user is not logged in
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="flex-end"
        w="100%"
        h="91.5vh"
        p="50px"
      >
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        <ChatBox
          w={selectedChat ? "100%" : "63%"}
          flexGrow={selectedChat ? "1" : "0"}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          selectedChat={selectedChat}
        />
      </Box>
    </div>
  );
};

export default Chatpage;
