import {
    Button,
    useDisclosure,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Image,
    Text
} from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
          {
              children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton d={{ base: "flex" }}
                  icon={<i className="fas fa-eye"></i>} onClick={onOpen} />)} 
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
              <ModalContent
                  height={"330px"}
              >
                  <ModalHeader
                      fontSize="20px"
                      fontFamily="Work Sans"
                      d="flex"
                      justifyContent="center"
                  >{user.name}</ModalHeader>
                  <ModalCloseButton />
                 
                  <ModalBody
                      display="flex"
                      flexDir="column"
                      justifyContent="space-between"
                  >
                    <center>
                        <Image   
                          borderRadius="full"
                          boxSize={'100px'}
                          src={user.pic}
                          alt={user.name}
                      /><br />
                      <Text      
                          fontSize={{ base: "20px", md: "25px" }}
                          fontFamily="Work Sans"
                      > 
                        Email: {user.email}
                      </Text>
                  </center>
                    
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </>
  )
}

export default ProfileModal
