import React from 'react';
import './TransactionTable.css';

const TransactionTable = ({ transactionHistory }) => {
  return (
    <div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Quantity</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory &&
            transactionHistory.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.ticker}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.trans_type}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
