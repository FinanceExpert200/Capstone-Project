import React from 'react'

const TransactionTable = ({transactionHistory}) => {


  return (
    <div>
        Tracks all transactions made by a user
        
    {transactionHistory &&
        transactionHistory.map((transaction) => (
        <div> Transaction: {transaction.ticker}, Quantity {transaction.quantity}, Type: {transaction.trans_type}</div>
        ))}
    </div>
  )
}

export default TransactionTable