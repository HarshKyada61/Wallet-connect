import React from "react";

function TransactionTable({ transactions }) {
  const limitedTransactions = transactions.slice(0, 100); // Create a new array without mutating props

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Gas</th>
            <th>Gas Price</th>
          </tr>
        </thead>
        <tbody>
          {limitedTransactions.map((transaction) => (
            <tr key={transaction.hash}>
              <td>{transaction.from}</td>
              <td>{transaction.to}</td>
              <td>{Number(transaction.gas)}</td>
              <td>{Number(transaction.gasPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
