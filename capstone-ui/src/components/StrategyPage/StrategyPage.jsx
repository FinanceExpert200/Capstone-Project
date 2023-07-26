import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router'
import "./StrategyPage.css"
import MeanReversionStrat from "../../TradingCalculations/MeanReversionStrat.js"
import MovingAverageCrossover from "../../TradingCalculations/MovingAverageCrossover.js"
import Divergence from "../../TradingCalculations/Divergence.js"
import PairsTrading from "../../TradingCalculations/PairsTrading"
import { Button } from '@chakra-ui/react';

const StrategyPage = () => {
    const {name} = useParams();
    const [currentAccountValue, setCurrentAccountValue] = useState([])
    const [currentTransactionHistory, setCurrentTransactionHsitory] = useState([])
    const [ranStrategy, setRanStrategy] = useState(false)
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [error, seterror] = useState(false)
    const [buyingPower, setBuyingPower] = useState(0)
    
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
        let transactionHistory = await MovingAverageCrossover.calculateDisplayedProfit(buyingPower, selectedStocks)
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
            let [transactionHistory, returnedArray] = await Divergence.calculateDisplayedProfit(buyingPower, selectedStocks);
            setCurrentTransactionHsitory(transactionHistory);
            
            setCurrentAccountValue(returnedArray)
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
    
    const runPairsTradingStrategy = async (selectedStocks) => {
        let transactionHistory = await PairsTrading.calculateProfit(selectedStocks,buyingPower)
        setCurrentAccountValue(PairsTrading.getAccountValue())
        setCurrentTransactionHsitory(transactionHistory)

    };

    
    const runStrategy = async (event, name) => {

        event.preventDefault();
        setCurrentAccountValue(0)
        setCurrentTransactionHsitory([])
        if(selectedButtons.length >= 1 ){
            setRanStrategy(true)
            switch (name) {
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

    const renderButtons = (name) => {
        return ["META","AMZN", "GOOGL", "AAPL", "CRM"].map((number) => (
          <Button
            key={number}
            onClick={() => handleButtonClick(number, name)}
            colorScheme={selectedButtons.includes(number) ? 'blue' : 'gray'}
          >
             {number}
          </Button>
        ));
    };
    const handleButtonClick = (buttonNumber, name) => {
        if(name == "pairstrading" && selectedButtons.length > 2){
            console.log("Pairs trading only works with two stocks, select two in ordet to submit")
            seterror(true)
        }
        if (selectedButtons.includes(buttonNumber)) {
            setSelectedButtons(selectedButtons.filter(num => num !== buttonNumber));
            seterror(false)
        } 
        else if(name != "pairstrading" || selectedButtons.length < 2 )  {
                setSelectedButtons([...selectedButtons, buttonNumber]);
                seterror(false)
        }
        else{
            seterror(true)
        }
    };
    const handleInputChange = (event) => {
        setBuyingPower(event.target.value);
    }
    
    
    
    return (
        <div id = "temp">StrategyPage
            <div id = "description">
                {description}
            </div>
            <form className="run-strategy-form" onSubmit={(event) => runStrategy(event, name)} >
                {renderButtons(name)}

                <div id = "temp2">Selected buttons: {selectedButtons.join(', ')}</div>
                    {error && <div>Pairs Trading can only have 2 options selected</div>}
                    <input type="number" id="quantity" name="quantity" min="1000" max="10000" placeholder='Amount' onChange = {handleInputChange}/>
                    <button type="submit" className="run-strategy-button" >
                        Run {name} strategy
                    </button>

                {ranStrategy && <div>3 months profit: {Number(currentAccountValue[0]).toFixed(2)},6 months profit: {Number(currentAccountValue[1]).toFixed(2)}, 1 Year profit: {Number(currentAccountValue[2]).toFixed(2)}</div>}
            </form>
        </div>
    )
    }
    
    export default StrategyPage
    