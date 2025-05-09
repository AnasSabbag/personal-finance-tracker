import React from 'react'
import "./style.css"
import { Card, Row } from 'antd';
import Button from '../Buttons';

function Cards({user,income,expense,totalBalance,removeAllTransaction,showExpenseModal,showIncomeModal}) {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" title="Current Balance">
         <h2>{user?.displayName}</h2>
         <p>₹{totalBalance}</p>
         <Button text={"Reset Balance"} disabled={true} blue={true} onClick={removeAllTransaction} /> 
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