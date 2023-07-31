import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router'
import "./StrategyPage.css"
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"
import MovingAverageCrossover from "../../TradingCalculations/MovingAverageCrossover.js"
import Divergence from "../../TradingCalculations/Divergence.js"
import PairsTrading from "../../TradingCalculations/PairsTrading"
import { Button } from '@chakra-ui/react';
import axios from "axios";

const StrategyPage = ({userId,strategyBuyingPower,setStrategyBuyingPower,strategyType,setStrategyType, buyingPower, setBuyingPower}) => {
    const currentUserId = userId
    const {strategyName} = useParams();
    const [currentAccountValue, setCurrentAccountValue] = useState([])
    const [currentTransactionHistory, setCurrentTransactionHsitory] = useState([])
    const [ranStrategy, setRanStrategy] = useState(false)
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [error, seterror] = useState(false)
    const [simulatedBuyingPower, setSimulatedBuyingPower] = useState(0)

    
    // Here we need to handle each of the buttons
    // This page consists of: 
    // A brief description of the strategy and How it works
    // A form to choose which stocks you want to run the strategy on (for pairs trading there should always be only two stocks selected at a time) 
    // An input to choose how muhc money they want toe bot to trade with
    // A run button 
    // A part that shows the total profatibility of the straregy
    // Tiles that show the company and all trades that were made

    let description = ""
    


    const runMovingAverageCrossoverStrategy = async (selectedStocks) => {
        console.log(selectedStocks)
        let transactionHistory = await MovingAverageCrossover.calculateDisplayedProfit(simulatedBuyingPower, selectedStocks)
        let accountValue = await MovingAverageCrossover.getAccountValue()
        console.log("account value ------", accountValue)
        setCurrentTransactionHsitory(transactionHistory)
        setCurrentAccountValue(accountValue)
    };
      
    const runMeanReversionStrategy = async () => {
        MeanReversionStrat.mainFunc(5000);
      
    };
    const runDivergenceStrategy = async (selectedStocks) => {
        try {
            console.log("clicked");
            let [transactionHistory, returnedArray] = await Divergence.calculateDisplayedProfit(simulatedBuyingPower, selectedStocks);
            setCurrentTransactionHsitory(transactionHistory);
            
            setCurrentAccountValue(returnedArray)
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
    
    const runPairsTradingStrategy = async (selectedStocks) => {
        let transactionHistory = await PairsTrading.calculateProfit(selectedStocks,simulatedBuyingPower)
        setCurrentAccountValue(PairsTrading.getAccountValue())
        setCurrentTransactionHsitory(transactionHistory)

    };

    
    const runStrategy = async (event, strategyName) => {

        event.preventDefault();
        setCurrentAccountValue(0)
        setCurrentTransactionHsitory([])
        if(selectedButtons.length >= 1 ){
            setRanStrategy(true)
            switch (strategyName) {
                case "meanreversion":
                    console.log("meanreversion");
                    runMeanReversionStrategy();
                    break;
                case "movingaveragecrossover":
                    //check if at least one item is selected in selectedButtons 
                    if(selectedButtons.length >= 1){
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
        }

    }

    const renderButtons = (strategyName) => {
        return ["META","AMZN", "GOOGL", "AAPL", "CRM"].map((number) => (
          <Button
            key={number}
            onClick={() => handleButtonClick(number, strategyName)}
            colorScheme={selectedButtons.includes(number) ? 'blue' : 'gray'}>
             {number}
          </Button>
        ));
    };

    const handleButtonClick = (buttonNumber, strategyName) => {
        if(strategyName == "pairstrading" && selectedButtons.length > 2){
            console.log("Pairs trading only works with two stocks, select two in ordet to submit")
            seterror(true)
        }
        if (selectedButtons.includes(buttonNumber)) {
            setSelectedButtons(selectedButtons.filter(num => num !== buttonNumber));
            seterror(false)
        } 
        else if(strategyName != "pairstrading" || selectedButtons.length < 2 )  {
            setSelectedButtons([...selectedButtons, buttonNumber]);
            seterror(false)
        }
        else{
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

    const addStrategyToUser = async (strategyName, allocatedBuyingPower, currentUserId) => {
        console.log(`StrategyName ${strategyName} Buying Power ${allocatedBuyingPower}, UserID: ${currentUserId}`)
        //Check if the user has enough money to gve to the bot
        if(buyingPower > allocatedBuyingPower){
            try {

                const res = await axios.post(`http://localhost:3001/strategy/add`, {
                  strategy_type: strategyName,
                  buying_power: allocatedBuyingPower,
                  user_id: currentUserId
                });
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        else{
            console.error("INSUFFICIENT FUNDS")
        }
    };
    
    
    return (
        <div id = "temp">StrategyPage
            <div id = "description">
                {description}
            </div>
            <form className="run-strategy-form" onSubmit={(event) => runStrategy(event, strategyName)} >
                {renderButtons(strategyName)}

                <div id = "temp2">Selected buttons: {selectedButtons.join(', ')}</div>
                    {error && <div>Pairs Trading can only have 2 options selected</div>}
                    <input type="number" id="quantity" name="quantity" placeholder='Amount' onChange = {handleInputChangeForSimulatedBuyingPower}/>
                    <button type="submit" className="run-strategy-button" >
                        Run {strategyName} strategy
                    </button>

                {ranStrategy && <div>3 months profit: {Number(currentAccountValue[0]).toFixed(2)},6 months profit: {Number(currentAccountValue[1]).toFixed(2)}, 1 Year profit: {Number(currentAccountValue[2]).toFixed(2)}</div>}
            </form>
            <form className = "set-bot-form" onSubmit={(event) => { event.preventDefault(); addStrategyToUser(strategyName, strategyBuyingPower, currentUserId)}}>
                <button type = "submit" >Add strategy To portfolio </button>
                <div>Current strategy: {strategyName} current Buying Power {strategyBuyingPower}, current ID {currentUserId} </div>
                <input type="number" id="quantity" name="quantity" placeholder='How much money do you want to give to the bot' onChange = {handleInputChangeForstrategyBuyingPower} required />
            </form>
        </div>
    )
    }
    
    export default StrategyPage
    