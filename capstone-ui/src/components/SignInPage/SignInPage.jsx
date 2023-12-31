import React, { useEffect } from "react";
import "./SignInPage.css";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Container,
  SimpleGrid,
  Input,
  Text,
  Heading,
} from "@chakra-ui/react";
// import { useEffect } from "react";

import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

export default function SignInPage({ setIsLogged, setCurrentUserId }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  //https://g.foolcdn.com/image/?url=https%3A%2F%2Fg.foolcdn.com%2Feditorial%2Fimages%2F548475%2Fgettyimages-1035991674.jpg&op=resize&w=1200&h=630
  // https://business.fiu.edu/graduate/insights/img/artificial-intelligence-in-the-stock-market.jpg

  const [errorMessage, setErrorMessage] = useState("");

  // this post request over here verifies if the user email and password combo is valid
  const handleLogin = async (
    event,
    email,
    password,
    setIsLogged,
    setCurrentUserId,
    setErrorMessage,
    errorMessage
  ) => {
    console.log("trying to log in...");

    try {
      event.preventDefault();

      const res = await axios.post(
        `https://stock-swap.onrender.com/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      console.log(res.data.user);
      setCurrentUserId(res.data.user.id);
      localStorage.setItem("currentUserId", res.data.user.id);
      localStorage.setItem("token", res.data.token);
      setIsLogged(true);
      //sets the id and token in localstorage

      // this will take you to the
      // window.location.href = "/home";
      navigate("/home");
    } catch (err) {
      // console.log(err.response.data.error.message)
      setErrorMessage(err.response.data.error.message);
      // err.response.data.error.message
      // console.log(errorMessage)
    }
  };

  return (
    <Box
      position={"absolute"}
      w={"full"}
      h={"100vh"}
      backgroundImage={
        "url(https://business.fiu.edu/graduate/insights/img/artificial-intelligence-in-the-stock-market.jpg)"
      }
      backgroundSize={"cover"}
      backgroundPosition={"center center"}
      justifyContent={"center"}
    >
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        py={{ base: 10, sm: 20, lg: 32 }}
        w={"full"}
        h={"100vh"}
      >
        <Center>
          <Stack bg={"gray.50"} p={{ base: 4, sm: 6, md: 8 }} rounded={"xl"}>
            <Stack spacing={4}>
              <Center>
                <Heading
                  color={"gray.800"}
                  lineHeight={1.1}
                  fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                >
                  Welcome!
                </Heading>
              </Center>
              <Text
                textAlign="center"
                color={"gray.500"}
                fontSize={{ base: "sm", sm: "md" }}
                marginBottom={5}
              >
                Start your journey with StockSwap here!
              </Text>
            </Stack>
            <Box
              as={"form"}
              onSubmit={(event) =>
                handleLogin(
                  event,
                  email,
                  password,
                  setIsLogged,
                  setCurrentUserId,
                  setErrorMessage,
                  errorMessage
                )
              }
            >
              <Stack spacing={4} marginBottom={4}>
                <Input
                  type="text"
                  required
                  placeholder="Email"
                  bg={"grey.100"}
                  onChange={(event) => {
                    event.preventDefault();
                    setEmail(event.target.value);
                  }}
                ></Input>
                <Input
                  type="password"
                  required
                  placeholder="Password"
                  bg={"grey.100"}
                  onChange={(event) => {
                    event.preventDefault();
                    setPassword(event.target.value);
                  }}
                ></Input>

                <Button
                  type="submit"
                  color={"grey.800"}
                  rounded={"full"}
                  _hover={{ bg: "green.100" }}
                >
                  {/* add a hover action for the button */}
                  Login
                </Button>
                {errorMessage && <p>Error: {errorMessage}</p>}
              </Stack>
            </Box>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
}
