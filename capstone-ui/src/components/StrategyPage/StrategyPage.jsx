import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router'
import "./StrategyPage.css"
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"
import MovingAverageCrossover from "../../TradingCalculations/MovingAverageCrossover.js"
import Divergence from "../../TradingCalculations/Divergence.js"
import PairsTrading from "../../TradingCalculations/PairsTrading"
import ResultDivergence from './ResultDivergence'
import ResultMovingAverage from "./ResultMovingAverage"
import { Button, Box, Heading,Flex,Center,Stack,Text,useColorModeValue,
    FormControl,
    Input,
    FormLabel,
    FormErrorMessage,
    FormHelperText,} from '@chakra-ui/react';

const StrategyPage = () => {
    const { name } = useParams();
    const [currentAccountValue, setCurrentAccountValue] = useState([])
    const [currentTransactionHistory, setCurrentTransactionHsitory] = useState([])
    const [ranStrategy, setRanStrategy] = useState(false)
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [error, seterror] = useState(false)
    const [buyingPower, setBuyingPower] = useState(0)
    const [allocatedAmount, setAllocatedAmount] = useState(0)
    const [simulatedBuyingPower, setSimulatedBuyingPower] = useState(0)
    const [rsi, setRsi] = useState(null);
    const [movAverage,setMovingAverage] = useState(null);


    // Here we need to handle each of the buttons
    // This page consists of: 
    // A brief description of the strategy and How it works
    // A form to choose which stocks you want to run the strategy on (for pairs trading there should always be only two stocks selected at a time) 
    // An input to choose how muhc money they want toe bot to trade with
    // A run button 
    // A part that shows the total profatibility of the straregy
    // Tiles that show the company and all trades that were made

  //   let description = "";

  // Now we need to reormat name 
  const formatStrategyName = (name)=>{
    switch (name) {
      case "meanreversion":
        formattedName =  "Mean Reversion"
        break
      case "movingaveragecrossover":
        formattedName = "Moving Average Crossover"
        break
      case "divergence":
        formattedName = "Relative Strength Divergence"
        break
      case "pairstrading":
        formattedName =  "Pairs Trading"
        break
        
      default:
        break;
    }
  }
  formatStrategyName(name)


    const runMovingAverageCrossoverStrategy = async (selectedStocks) => {
        console.log(selectedStocks)
        let transactionHistory = await MovingAverageCrossover.calculateDisplayedProfit(simulatedBuyingPower, selectedStocks)
        let accountValue = await MovingAverageCrossover.getAccountValue()
        let ma = MovingAverageCrossover.getMovingAverages()
        console.log("account value ------", accountValue)
        console.log("Trade Averages ----- ", ma)
        setCurrentTransactionHsitory(transactionHistory)
        setCurrentAccountValue(accountValue)
        setMovingAverage(ma);
    };
    console.log("Moving Average Array -----", movAverage)

    const runMeanReversionStrategy = async () => {
        MeanReversionStrat.mainFunc(5000);

    };
    const runDivergenceStrategy = async (selectedStocks) => {
        try {
            console.log("clicked");
            let [transactionHistory, returnedArray] = await Divergence.calculateDisplayedProfit(simulatedBuyingPower, selectedStocks);
            setCurrentTransactionHsitory(transactionHistory);

            setCurrentAccountValue(returnedArray)
            const RSI = await Divergence.getRSIData()
            //set a var array to display in front end
            setRsi(RSI);
            //console.log(RSI)
            //console.log("ARRAYYYYYY RETURNNNN",transactionHistory);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    const runPairsTradingStrategy = async (selectedStocks) => {
        let transactionHistory = await PairsTrading.calculateProfit(selectedStocks, buyingPower)
        setCurrentAccountValue(PairsTrading.getAccountValue())
        setCurrentTransactionHsitory(transactionHistory)

    };


    const runStrategy = async (event, name) => {

        event.preventDefault();
        setCurrentAccountValue(0)
        setCurrentTransactionHsitory([])
        if (selectedButtons.length >= 1) {

            switch (name) {
                case "meanreversion":
                    console.log("meanreversion");
                    runMeanReversionStrategy();
                    break;
                case "movingaveragecrossover":
                    //check if at least one item is selected in selectedButtons 
                    if (selectedButtons.length >= 1) {
                        runMovingAverageCrossoverStrategy(selectedButtons);
                        
                    }
                    break;
                case "divergence":
                    console.log("divergence");
                    runDivergenceStrategy(selectedButtons);
                    break;
                case "pairstrading":
                    console.log("pairstrading");
                    runPairsTradingStrategy(selectedButtons);
                    break;
                default:
                    console.log("Invalid strategy type.");
                    break;
            }
            setRanStrategy(true)
        }

        //setSelectedButtons([]);
        seterror(false);
        setBuyingPower(0);
        setAllocatedAmount(0);
        const quantityInput = document.getElementById("quantity");
        if (quantityInput) {
            quantityInput.value = ""; // Reset the input to empty
        }

    }

    const renderButtons = (name) => {
        return ["META", "AMZN", "GOOGL", "AAPL", "CRM"].map((number) => (
            <Button
                key={number}
                onClick={() => handleButtonClick(number, name)}
                colorScheme={selectedButtons.includes(number) ? 'green' : 'gray'}
                m={3}
            >
                {number}
            </Button>
        ));
    };
    const handleButtonClick = (buttonNumber, name) => {
        if (name == "pairstrading" && selectedButtons.length > 2) {
            console.log("Pairs trading only works with two stocks, select two in ordet to submit")
            seterror(true)
        }
        if (selectedButtons.includes(buttonNumber)) {
            setSelectedButtons(selectedButtons.filter(num => num !== buttonNumber));
            seterror(false)
        }
        else if (name != "pairstrading" || selectedButtons.length < 2) {
            setSelectedButtons([...selectedButtons, buttonNumber]);
            seterror(false)
        }
        else {
            seterror(true)
        }
    };

    const handleInputChangeForSimulatedBuyingPower = (event) => {
        console.log(`setting the current simulated buying Power to ${event.target.value}`)
        setSimulatedBuyingPower(event.target.value);
    }

    const handleInputChangeForstrategyBuyingPower = (event) =>{
        event.preventDefault()
        setStrategyBuyingPower(event.target.value)
    }


    const stratName = "";





    return (
        <Box h={'100vh'} w={'full'} bgColor={'#171923'} position={'absolute'} paddingLeft={'80px'}
        pr={'80px'} >
            {/* <Box id = "description">
                {description}
            </Box> */}
            {ranStrategy && currentAccountValue && currentTransactionHistory ? (
                <div>
                    {rsi ? (
                        <ResultDivergence accountValues={currentAccountValue} transactionHistory={currentTransactionHistory} rsi={rsi} companies={selectedButtons} />

                    ) : movAverage ? (
                        <ResultMovingAverage maArray={movAverage} transactionHistory={currentTransactionHistory} accountValues={currentAccountValue} companies={selectedButtons} />
                    ):(
                        <Center h={'100vh'}>
                        
                        <Flex direction={'row'} justify={'space-between'} fontSize={'50px'}>
                            <Stack m={3}>
                                <Text color={'green.600'}>${Number(currentAccountValue[0]).toFixed(2)}</Text>
                                <Text>3 month</Text>

                            </Stack>
                            <Stack m={3}>
                                <Text color={'green.600'}>${Number(currentAccountValue[1]).toFixed(2)}</Text>
                                <Text>6 month</Text>

                            </Stack>
                            <Stack m={3}>
                                <Text color={'green.600'}>${Number(currentAccountValue[2]).toFixed(2)}</Text>
                                <Text>1 year</Text>

                            </Stack>
                        </Flex>
                        </Center>
                    )}
                    <Button onClick={() => {
                        setRanStrategy(false);
                    }}>Run Again</Button>
                </div>) :
                (<Center h={'100vh'} w={'full'} textColor={'white'} flexDirection={'column'}>
                    <Heading fontSize={50} m={10} 
                             bgGradient="linear(to-l, green.100, green)" 
                             bgClip="text">Select From the Following Companies</Heading>
                    <Box rounded={'lg'} boxShadow={'lg'} p={8} bgColor={useColorModeValue('gray.700')} >
                    <Box as={'form'} className="run-strategy-form" onSubmit={(event) => runStrategy(event, name)} >
                        {renderButtons(name)}

                        <Box fontSize={'20px'}>Selected buttons:</Box>
                        <Text m={'10px'} fontSize={'20px'}> {selectedButtons.join(', ')}</Text>
                        {error && <Text>Pairs Trading can only have 2 options selected</Text>}
                        <Flex direction={'row'} justify={'space-between'}>

                        <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForSimulatedBuyingPower} w={'30'}/>
                        <Button type="submit"  >
                            Run {formattedName} Simulation
                        </Button>
                        </Flex>



                    </Box>

                    <Input type="number" id="quantity" name="quantity" placeholder='Amount' onChange={handleInputChangeForstrategyBuyingPower} w={'30'}/>
                        <Button onClick={(event) => { event.preventDefault(); addStrategyToUser(name, strategyBuyingPower, userId)}}  >
                            Add {formattedName} Strategy To Account
                        </Button>
                    </Box>
                </Center>
                )}




        </Box>
    )
}

export default StrategyPage

{/* 3 months profit: {Number(currentAccountValue[0]).toFixed(2)},
6 months profit: {Number(currentAccountValue[1]).toFixed(2)}, 
1 Year profit: {Number(currentAccountValue[2]).toFixed(2)} */}