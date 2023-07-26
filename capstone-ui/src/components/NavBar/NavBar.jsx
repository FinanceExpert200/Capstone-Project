// import codePathLogo from "/src/assets/codepath.svg";
import * as React from 'react';
//import { Link } from "react-router-dom"
import "./NavBar.css";
import {
  Flex,
  Button,
  Box,
  Center,
  Text,
  Link,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';

export default function Navbar({ isLogged, setIsLogged }) {
  const bgNav = useColorModeValue('green')

  const handleLogout = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    setIsLogged(false);
    console.log(isLogged);
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("token");
    window.location.href = "/";

  };

  return (
      <Flex
        align="center"
        justify="space-between"
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        position = {'absolute'}
        zIndex={1}
        width = {'full'}
        // bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
      >
        {isLogged && (
          <>
            
              <Link href="/home" color={'white'} fontWeight={'bold'}>
                StockSwap
              </Link>
          
              <Link href="/home" color={'white'} _hover={{bgGradient :"linear(to-b, green.100,transparent)", color:'black'}} >Profile</Link>

              <Link href="/transaction" color={'white'}>Transaction</Link>
            
              <Link href="/trade" color={'white'}>Trade</Link>


              <Link href="/strategies" color={'white'} _hover={{bgGradient :"linear(to-b, green.100,transparent)", color:'black'}} >Strategies</Link>

            
            <Button
              type = "button"
              bg={'green.700'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'green.500' }}
              onClick={handleLogout}>
              <Link href="/register"> Logout</Link>
            </Button>
            
          </>
        )}

        {!isLogged && (
          <Flex align="center" justify="space-between" width = {'full'}>
              <Link href="/">
                <Text color={'white'} fontWeight={'bold'}>
                StockSwap
                </Text>
              </Link>
            <Stack direction="row" spacing={4} justify="flex-end">
            <Button
              bg={'green.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'green.500' }}>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              bg={'whiteAlpha.600'}
              rounded={'full'}
              color={'black'}
              _hover={{ bg: 'green.100' }}>
              <Link href="/register"> Register</Link>
            </Button>






            </Stack>
          </Flex>
        )}
      </Flex>
    

  );
}

            