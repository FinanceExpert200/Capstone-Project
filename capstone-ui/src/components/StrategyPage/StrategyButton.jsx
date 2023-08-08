import React from 'react'

export const StrategyButton = () => {
    const [success, setSuccess] = useState(false);
    const [currentAccountValue, setCurrentAccountValue] = useState([]);

    

    const handleInputChangeForstrategyBuyingPower = (event) => {
        event.preventDefault();
        setStrategyBuyingPower(event.target.value);
      };

      const addStrategyToUser = async (
        strategyName,
        strategyBuyingPower,
        currentUserId
      ) => {
        console.log(
          `StrategyName ${strategyName} Buying Power ${strategyBuyingPower}, UserID: ${currentUserId} user buying power ${buyingPower}`
        );
        //Check if the user has enough money to gve to the bot
        if (buyingPower > strategyBuyingPower) {
          try {
            const res = await axios.post(`http://localhost:3001/strategy/add`, {
              strategy_type: strategyName,
              buying_power: strategyBuyingPower,
              user_id: currentUserId,
            });
            console.log(res.data);
            console.log("Formatted name ", formattedName);
          } catch (err) {
            console.log(err);
          }
          setSuccess(true);
        } else {
          console.error("INSUFFICIENT FUNDS");
        }
      };


  return (
    <Flex mt={3} mb={3} justify={"space-between"}>
    <Input
      type="number"
      id="quantity"
      name="quantity"
      placeholder="Amount"
      onChange={handleInputChangeForstrategyBuyingPower}
      w={"30"}
    />
    <Button
      bg={"blackAlpha.200"}
      _hover={{ bg: "green.500", color: "white" }}
      onClick={(event) => {
        event.preventDefault();
        addStrategyToUser(strategyName, strategyBuyingPower, currentUserId);
      }}
    >
      Add Strategy To Account
    </Button>
  </Flex>
  )
}
