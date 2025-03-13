import React from 'react'
import "./style.css"
import { Card, Row } from 'antd';
import Button from '../Buttons';

function Cards({income,expense,totalBalance,showExpenseModal,showIncomeModal}) {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" title="Current Balance">
        <h2>Current Balance</h2>
         <p>₹{totalBalance}</p>
         <Button text={"Reset Balance"} blue={true}/> 
        </Card>
        
        <Card className="my-card" title="Total Income">
          <h2>Total Income</h2>
           <p>₹{income}</p>
         <Button text={"Add Income"} blue={true} onClick={showIncomeModal} /> 
        </Card>
        <Card className="my-card" title="Total Expenses">
        <h2>Total Expenses</h2>
         <p>₹{expense}</p>
         <Button text={"Add Expense"} blue={true} onClick={showExpenseModal}/> 
        </Card>
      </Row>

    </div>
  )
}

export default Cards;