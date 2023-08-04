// import codePathLogo from "/src/assets/codepath.svg";
import * as React from 'react';
//import { Link } from "react-router-dom"
import "./NavBar.css";

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

const Links = ['Profile', 'Trade', 'Transaction', 'Strategies']
const Routes = ['home', 'trade', 'transaction', 'strategies']

const NavLink = ({link, route}) => {

  return (
    <Box
      as="a"
      px={2}
      py={1}
      zIndex={1}
      rounded={'md'}
      paddingLeft={'80px'}
      pr={'80px'}
      
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('green.200', 'green.700'),
        color:'black'
      }}
      href={`/${route}`}>
        {link}
    </Box>
  )
}

export default function NavBar({ isLogged, setIsLogged }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleLogout = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        setIsLogged(false);
        console.log(isLogged);
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("token");
        window.location.href = "/";
    
  };

  return (
    <>
    {isLogged && (
      <Box bg={useColorModeValue('gray.800')} px={4} 
           zIndex={1} position = {'absolute'} 
           width = {'full'} pl={'80px'} pr={'80px'} 
           color={'white'} fontSize={'17px'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Box as='a' href="/home" fontWeight={'bold'}>StockSwap</Box>
          <HStack spacing={8} alignItems={'center'}>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link, index) => (
                <NavLink key={link} link={link} route={Routes[index]} />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
          <Button
              bg={'green.700'}
              rounded={'full'}
              color={'white'}
             _hover={{ bg: 'green.500' }}
              onClick={handleLogout}>
             <Link href="/register"> Logout</Link>
            </Button>
          </Flex>
        </Flex>

        {isOpen &&(
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
            {Links.map((link, index) => (
                <NavLink key={link} link={link} route={Routes[index]} />
              ))}
            </Stack>
          </Box>
        ) }
      </Box>

     
      )}
      {!isLogged && (
        <Box bg={'transparent'} px={4} 
             zIndex={1} position = {'absolute'} 
             width= {'full'} pl={'80px'} 
             pr={'80px'} color={'white'} fontSize={'17px'}
             >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          
          <Box as='a' href="/" fontWeight={'bold'}>StockSwap</Box>
          <Flex alignItems={'center'}>
          {/* <Button
              bg={'green.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'green.500' }}>
              <Link href="/login">Sign In</Link>
            </Button> */}
            {/* <Button
              bg={'whiteAlpha.600'}
              rounded={'full'}
              color={'black'}
              _hover={{ bg: 'green.100' }}>
              <Link href="/register"> Register</Link>
            </Button> */}
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
            {Links.map((link, index) => (
                <NavLink key={link} link={link} route={Routes[index]} />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
      )}
    </>
  )
}

