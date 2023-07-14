import React, { useEffect } from "react";
import "./SignInPage.css";
import { useState } from "react";
import axios from "axios";
import { Box, Button, Center, Flex, Form, Stack, Container, SimpleGrid, Input, Text, Heading } from '@chakra-ui/react'
// import { useEffect } from "react";


// this post request over here verifies if the user email and password combo is valid
const handleLogin = async (event, email, password, setIsLogged) => {
  try {
    event.preventDefault();

    const res = await axios.post(
      `http://localhost:3001/auth/login`,
      {
        email: email,
        password: password,
      }
    );


    setIsLogged(true);
    //sets the id and token in localstorage
    localStorage.setItem("currentUserId", res.data.user.id);
    localStorage.setItem("token", res.data.token)


    // this will take you to the 
    window.location.href = "/home";
  } catch (err) {
    console.log(err.message);
  }
};



export default function SignInPage({ setIsLogged }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  //https://g.foolcdn.com/image/?url=https%3A%2F%2Fg.foolcdn.com%2Feditorial%2Fimages%2F548475%2Fgettyimages-1035991674.jpg&op=resize&w=1200&h=630
  // https://business.fiu.edu/graduate/insights/img/artificial-intelligence-in-the-stock-market.jpg
  return (
    <Box position={'relative'}
      backgroundImage={
        'url(https://business.fiu.edu/graduate/insights/img/artificial-intelligence-in-the-stock-market.jpg)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}
      justifyContent={'center'}

    >
      <Container as={SimpleGrid}
        maxW={'7xl'}
        py={{ base: 10, sm: 20, lg: 32 }}
        w={'full'}
        h={'100vh'}
      >

        <Center>
          <Stack bg={'gray.50'}
            p={{ base: 4, sm: 6, md: 8 }}
            rounded={'xl'}>
            <Stack spacing={4}
            >
              <Center>
                <Heading color={'gray.800'}
                  lineHeight={1.1}
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                  Welcome!
                </Heading>
              </Center>
              <Text textAlign='center' color={'gray.500'}
                fontSize={{ base: 'sm', sm: 'md' }}
                marginBottom={5}>
                Start your journey here! Blah Blah blah BLAH Blah blah blah blah

              </Text>
            </Stack >
            <Box as={'form'}
              onSubmit={(event) =>
                handleLogin(event, email, password, setIsLogged)
              }>
              <Stack spacing={4}
                marginBottom={4}>
                <Input type='text'
                  required
                  placeholder="Email"
                  bg={'grey.100'}
                  onChange={(event) => {
                    event.preventDefault();
                    setEmail(event.target.value);
                  }}>
                </Input>
                <Input type='password'
                  required
                  placeholder="Password"
                  bg={'grey.100'}
                  onChange={(event) => {
                    event.preventDefault();
                    setPassword(event.target.value);
                  }}>
                </Input>

                <Button type='submit'
                  color={'grey.800'}
                  rounded={'full'}
                  _hover={{ bg: 'green.100' }}>
                  {/* add a hover action for the button */}
                  Login
                </Button>
              </Stack>

            </Box>

          </Stack>
        </Center>
      </Container>
    </Box>
  );
}
