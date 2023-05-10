import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

const HandleBadgeItem = ({ user, handleFunction, loggedInUser }) => {
  const displayName = user && loggedInUser && user._id === loggedInUser._id ? 'You' : user?.name

 return (
    <Box m={1} mb={2}>
      {user && user._id && (
        <Flex
          align="center"
          px={2}
          py={1}
          borderRadius="lg"
          variant="solid"
          fontSize={12}
          bg="purple.100"
          cursor="pointer"
          onClick={handleFunction} >
          <Box flex="1">{user.name}</Box>
          <Box as="i" className="fas fa-times" ml={2} />
        </Flex>
      )}
    </Box>
  );
}

export default HandleBadgeItem
