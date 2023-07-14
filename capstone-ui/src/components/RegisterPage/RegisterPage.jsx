import React from "react";
import axios from "axios";
import { useState } from "react";
import './RegistrationPage.css';
import { Box, Button, Center, Flex, Form, Stack, Container, SimpleGrid, Input, Text, Heading } from '@chakra-ui/react'

const handleAddData = async (event, buying_power, acc_value, email, first_name, last_name, password) => {
  try {

    event.preventDefault();

    const res = await axios.post(`http://localhost:3001/auth/register`, {
      acc_value: buying_power,
      buying_power: acc_value,
      email: email,
      firstName: first_name,
      lastName: last_name,
      password: password,
    });
    console.log(res.data);

    window.location.href = "/login";
  } catch (err) {
    console.log(err);
  }
};

const RegisterPage = ({ buying_power, acc_value }) => {



  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");

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
                Blah Blah blah BLAH Blah blah blah blah Will increase
              </Text>
            </Stack >
            <Box as={'form'}
              onSubmit={(event) =>
                handleAddData(
                  event,
                  buying_power,
                  acc_value,
                  email,
                  first_name,
                  last_name,
                  password
                )
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
                <Input type='text'
                  required
                  placeholder="First Name"
                  bg={'grey.100'}
                  onChange={(event) => {
                    event.preventDefault();
                    setFirstName(event.target.value);
                  }}>
                </Input>
                <Input type='text'
                  required
                  placeholder="Last Name"
                  bg={'grey.100'}
                  onChange={(event) => {
                    event.preventDefault();
                    setLastName(event.target.value);
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
                <Input type='password'
                  required
                  placeholder="Confirm Password"
                  bg={'grey.100'}
                >
                </Input>

                <Button type='submit'
                  color={'grey.800'}>
                  {/* add a hover action for the button */}
                  Sign Up
                </Button>
              </Stack>

            </Box>

          </Stack>
        </Center>
      </Container>
    </Box>
  );
};

export default RegisterPage;

