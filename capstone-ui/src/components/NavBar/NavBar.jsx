// import codePathLogo from "/src/assets/codepath.svg";
import * as React from 'react';
//import { Link } from "react-router-dom"
import "./NavBar.css";
import {
  Flex,
  Button,
  Box,
  Center,
  Container,
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
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
      >
        {isLogged && (
          <>
            <div className="logo">
              <Link href="/home">
                <img
                  src="data:image/png;base64,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"
                  width="50px"
                  height="50px"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="profile-tag">
              <Link href="/home">Profile</Link>
            </div>
            <div className="transaction-tag">
              <Link href="/transaction">Transaction</Link>
            </div>
            <div className="trade-tag">
              <Link href="/trade">Trade</Link>
            </div>
            <Button
              type = "button"
              bg={'green.700'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              onClick={handleLogout}>
              <Link href="/register"> Logout</Link>
            </Button>
            
          </>
        )}

        {!isLogged && (
          <Flex align="center" justify="space-between" width = {'full'}>
              <Link href="/">
                <img
                  src="data:image/png;base64,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"
                  width="50px"
                  height="50px"
                  alt="Logo"
                />
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

            