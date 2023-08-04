// import { React, useState } from "react";
// import "./TradingStrategies.css";
// import StrategyPage from "../StrategyPage/StrategyPage";
// import { Link as RouterLink } from "react-router-dom";
// import {
//     Link,
//     Text,
//     Center,
//     Flex,
//     Image,
//     Box,
//     Stack,
//     Square,
//     Container,
//     Button,
//     Heading,
//     Tabs,
//     TabList,
//     TabPanels,
//     Tab,
//     TabPanel,
// } from "@chakra-ui/react";
// import { color } from "framer-motion";


//     export default function StrategyForm({strategyName}) {
//     const runStrategy = async (event, name) => {
//         event.preventDefault();
//         setCurrentAccountValue(0);
//         setCurrentTransactionHsitory([]);
//         //console.log();

//         if (selectedTickers.length >= 1 && simulatedBuyingPower > 500) {
//             console.log('GOT ACCEPTED')
//             setRanStrategy(true);
//             switch (name) {
//                 case "meanreversion":
//                     runMeanReversionStrategy(selectedTickers);
//                     break;

//                 case "movingaveragecrossover":
//                     if (selectedTickers.length >= 1) {
//                         runMovingAverageCrossoverStrategy(selectedTickers);
//                     }
//                     break;

//                 case "divergence":


//                     runDivergenceStrategy(selectedTickers);
//                     break;
//                 case "pairstrading":


//                     runPairsTradingStrategy(selectedTickers);
//                     break;
//                 case "exponentialmovingaverage":

//                     runEMAStrategy(selectedTickers);
//                     break;

//                 default:
//                     console.log("Invalid strategy type.");
//                     break;
//             }
//             setRanStrategy(true);
//         } else if (selectedTickers.length === 0 && simulatedBuyingPower < 500 && simulatedBuyingPower === 0) {
//             setErrorMessage("You must select a ticker and input a minimum of $500 to start");
//             setError2(true)
//             console.log("ERRORS", { errorMessage })
//         }
//         else if (simulatedBuyingPower < 500 && simulatedBuyingPower > 0) {
//             console.log("BEING USED HERE ")
//             setErrorMessage("The minimum account allowed is $500");
//             setError2(true)
//             console.log("ERRORS", { errorMessage })
//         }
//         else if (selectedTickers.length === 0) {
//             console.log("You must select at least one ticker")
//             setErrorMessage("You must select at least one ticker");
//             setError2(true)
//             console.log("ERRORS", { errorMessage })
//         }
//         else if (simulatedBuyingPower < 0) {
//             console.log("length error here ")
//             setErrorMessage("Quantity cannot be a negative number");
//             setError2(true)
//             console.log("ERRORS", { errorMessage })
//         }
//         //setselectedTickers([]);
//         seterror(false);
//         setBuyingPower(0);
//         setSimulatedBuyingPower(0);
//         const quantityInput = document.getElementById("quantity");
//         if (quantityInput) {
//             quantityInput.value = ""; // Reset the input to empty
//         }
//     };


//     const renderButtons = (name) => {
//         return ["META", "AMZN", "GOOGL", "AAPL", "CRM", "NFLX"].map((number) => (
//             <Button
//                 key={number}
//                 onClick={() => handleButtonClick(number, name)}
//                 colorScheme={selectedTickers.includes(number) ? "green" : "gray"}
//                 m={3}
//             >
//                 {number}
//             </Button>
//         ));
//     };

//     //once button is clicked it should go teh stategy page
//     return (
//         <Box>
//             <Center
//                 // w={"full"}
//                 textColor={"white"}
//                 flexDirection={"column"}
//             >
//                 {/* <Heading
//             fontSize={50}
//             m={10}
//             bgGradient="linear(to-l, green.100, green)"
//             bgClip="text"
//           >
//             Select From the Following Companies
//           </Heading> */}
//                 <Box
//                     rounded={"lg"}
//                     boxShadow={"lg"}
//                     p={8}
//                     bgColor={useColorModeValue("gray.700")}
//                 >
//                     <Box
//                         as={"form"}
//                         className="run-strategy-form"
//                         onSubmit={(event) => runStrategy(event, name)}
//                     >
//                         {renderButtons(name)}

//                         <Box fontSize={'20px'}>Selected buttons:</Box>
//                         <Text m={'10px'} fontSize={'20px'}> {selectedTickers.join(', ')}</Text>
//                         {error && <Text>Pairs Trading can only have 2 options selected</Text>}

//                         <Flex direction={'row'} justify={'space-between'}>

//                             <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForSimulatedBuyingPower} w={'30'} />
//                             <Button type="submit"  >
//                                 Simulate {formattedName} Strategy
//                             </Button>
//                         </Flex>
//                         {error2 && <Text> {errorMessage}</Text>}


//                     </Box>

//                     {/* <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForstrategyBuyingPower} w={'30'}/>
//                         <Button onClick={(event) => { event.preventDefault(); addStrategyToUser(name, strategyBuyingPower, userId)}}  >
//                             Add {formattedName} Strategy To Account
//                         </Button> */}
//                     </Box>


//             </Center>
//         </Box>
//     )
// }
