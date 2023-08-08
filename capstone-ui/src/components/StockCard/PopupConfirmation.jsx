import React from "react";
import { useState } from "react";
//import {Box,Button,Heading,Text} from '@chakra-ui/react'
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,Button,Heading,Text
  } from '@chakra-ui/react'

export default function PopupConfirmation ({submission,name,quantity,price,trans_type}){
    const type = trans_type === "buy" ? ('bought'):('sold')
   
    return (
      <Modal
        isCentered
        isOpen={submission && (submission)}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
        <Box bgColor={'white'} textAlign={'center'} borderRadius={5} top={0} >
        <CheckCircleIcon bgColor={'white'} color={'green'} w={'100px'} mt={'-50px'} borderRadius={'50%'} h={100} boxShadow={'0,2px,5px,rgba(0,0,0,0.2)'}/>
          <ModalBody mb={3}>
            <Heading mb={3} as={'h2'}>Transaction Success!</Heading>
            <Text fontWeight={'light'}>You have successfully {type} {quantity} stocks from {name} for a total of ${price * quantity}</Text>
            <Text fontWeight={'light'}>Click below to return to your profile</Text>
          </ModalBody>
          
          <Button  mr={5} mb={5} onClick={()=>{window.location.href = "/trade";}}> Trade More</Button>
          <Button mb={5} onClick={()=>{window.location.href = "/home";}}> Back to home</Button>
         
          </Box>
        </ModalContent>
      </Modal>
 

           

       
    )
}
{/* <CheckCircleIcon color={'green'} w={'100px'} mt={'-50px'} borderRadius={'50%'} h={100} boxShadow={'0,2px,5px,rgba(0,0,0,0.2)'}/>
            <Heading as={'h2'}>Transaction Success!</Heading>
            <Text>Here is an over view of your transaction</Text>
            <Text>Close this tab to return to homepage</Text>
            <Button mb={5} onClick={()=>{window.location.href = "/home";}}> close</Button> */}