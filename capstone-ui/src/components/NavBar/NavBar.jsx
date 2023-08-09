// import codePathLogo from "/src/assets/codepath.svg";
import * as React from 'react';
import {useLocation, Link as RouterLink } from "react-router-dom"
import "./NavBar.css";
import { useState } from 'react';
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


let status;
const Links = ['Profile', 'Trade', 'Transaction', 'Strategies']
const Routes = ['home', 'trade', 'transaction', 'strategies']

const NavLink = ({link, route}) => {
  const location = useLocation();

  return (
    <Box
      as={RouterLink}
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
      bgColor={location.pathname === `/${route}` ? 'green.200' : 'transparent'}
      color={location.pathname === `/${route}` ? 'black' : 'white'}
      
      to={`/${route}`}>
        {link}
    </Box>
  )
}

export default function NavBar({ isLogged, setIsLogged }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [onPage,setOnPage] = useState(false)
  status  = onPage;
  const handleLogout = (event) => {
        event.preventDefault(); // Prevents the default form submission behavior
        setIsLogged(false);
        console.log(isLogged);
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("token");
    
  };

  return (
    <>
    {isLogged && (
      
      <Box bg={'#03314b'} px={4} 
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
          <Box as={RouterLink} to="/home" fontWeight={'bold'}>StockSwap</Box>
          <HStack spacing={8} alignItems={'center'}>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link, index) => (
                <NavLink key={link} link={link} route={Routes[index]} />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
          <Button
              bg={'#1ecc97'}
              rounded={'full'}
              color={'white'}
             _hover={{ bg: 'green.500' }}
              onClick={handleLogout}>
             <Link as={RouterLink} to="/"> Logout</Link>
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
          
          <Box as={RouterLink} to="/" fontWeight={'bold'}>StockSwap</Box>
          <Flex alignItems={'center'}>
          <Button
              
              as={RouterLink}
              bg={'#1ecc97'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'green.500' }}
              to={'/login'}>
             Sign In
            </Button> 
           
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
            {Links.map((link, index) => (
                <NavLink key={link} link={link} route={Routes[index]} onClick={() => setOnPage(!onPage)}/>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
      )}
    </>
  )
}