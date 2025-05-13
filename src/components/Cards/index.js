import React, { useState } from 'react'
import "./style.css"
import {  Card, Modal, Row } from 'antd';
import Button from '../Buttons';

function Cards({user,income,expense,totalBalance,removeAllTransaction,showExpenseModal,showIncomeModal}) {


  const [showAlert,setShowAlert]=useState(false);

  function handleResetTxn(){
    removeAllTransaction();
    setShowAlert(false);
  }



  return (

    <div>
      {
        showAlert&&<div >
          <Modal
            title="Do you want to Delete all transactions"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={showAlert}
            onOk={()=>handleResetTxn()}
            onCancel={()=>setShowAlert(false)}
          >
            
          </Modal>
        </div>
      }
      

      <Row className="my-row">
        <Card className="my-card" title="Current Balance">
         <h2>{user?.displayName}</h2>
         <p>₹{totalBalance}</p>
         <Button text={"Reset Balance"} disabled={true} blue={true} onClick={()=>setShowAlert(!showAlert)} /> 
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