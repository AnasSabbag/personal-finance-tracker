import React, { useState } from 'react'
import "./style.css"
import {   Radio, Select, Table } from 'antd';
import Button from '../Buttons';
import { parse, unparse } from 'papaparse';

import { toast } from 'react-toastify';
import EditIncomeModal from '../Modals/editIncomeModal';
import EditExpenseModal from '../Modals/editExpenseModal';
import { db,auth } from '../../firebase';
import { updateDoc,doc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


function TransactionTable({transactions,setTransactions,addTransaction,fetchTransaction}) {
   
    const [user] = useAuthState(auth);
    const [search,setSearch]=useState("");
    const [typeFilter,setTypeFilter]=useState('');
    const [sortKey,setSortKey]=useState('');

    //changes here for edit modal 
    const [showModal,setShowModal]=useState(false);
    const [txnData,setTxnData]=useState(null);
    

  const cloumns = [
    {
      title:'Name',
      dataIndex:'name',
      key:'name',
    },
    {
      title:'Amount',
      dataIndex:'amount',
      key:'amount',
    },
    {
      title:'Tag',
      dataIndex:'tag',
      key:'tag',
    },
    {
      title:'Date',
      dataIndex:'date',
      key:'date',
    },
    {
      title:'Type',
      dataIndex:'type',
      key:'type',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          
          <Button
            className='btn'
            type='primary'
            htmlType='submit'
            text={"Edit"}
            onClick={() => handleEdit(record)}
          />
          <Button
            className='btn'
            type='danger'
            htmlType='submit'
            text={"X"}
          
            onClick={() => handleDelete(record.id)}
          />
          
        </div>
      ),
    },
  ];

  let filteredTransactions = transactions.filter((item) => 
    item.name?.toLowerCase().includes(search?.toLowerCase() || '') &&
    (typeFilter ? item.type?.includes(typeFilter) : true)
  );
    

  let sortedTransactions = filteredTransactions.sort((a,b)=>{
    if(sortKey==="date"){
      return new Date(b.date)- new Date(a.date);
    }
    else if(sortKey==="amount"){
      return b.amount-a.amount;
    }
    else{
      return 0;
    }
  });

  const handleDelete = (txId) => { 
    deleteTransaction(txId);
      
  };

   // Open Edit Modal
  const handleEdit = (record) => {
    
    setTxnData(record);
    setShowModal(true);
  };


  const updateTransaction = async(transactionId,updatedData,typ)=>{
    try{
      const editedTransaction={
        type:typ,
        date: updatedData.date.format("YYYY-MM-DD"),
        amount:parseFloat(updatedData.amount),
        tag:updatedData.tag,
        name:updatedData.Name,
      };
      
      const transactionRef = doc(db, "users", user.uid, "transactions", transactionId);
      
      await updateDoc(transactionRef,editedTransaction);
      
      
      // now handle updates;
      const updatedTransactions = filteredTransactions.map(item => 
        item.id === transactionId 
          ? { 
              ...item, // Keep existing properties
              type: typ,
              date: updatedData.date.format("YYYY-MM-DD"),
              amount: parseFloat(updatedData.amount),
              tag: updatedData.tag,
              name: updatedData.Name
            } 
          : item
      );
      
      setTransactions(updatedTransactions);
      toast.success("transaction updated successfully!!!");

    }catch(err){
      toast.error("failed to update transactions: ",err);

    }

  }

  const deleteTransaction= async(transactionId)=>{
    
    try {
      const transactionRef = doc(db, "users", user.uid, "transactions", transactionId);
      await deleteDoc(transactionRef);
      

      const updatedTransactions = filteredTransactions.filter(item => 
        item.id !== transactionId 
      );
      
      setTransactions(updatedTransactions);
      toast.success("transaction deleted successfully!!!");
      
    } catch (err) {
      toast.error("failed to delete transactions:",err);
        
    }


  }







  function exportToCSV() {
    // Format the date in YYYY-MM-DD before exporting
    let formattedTransactions = sortedTransactions.map((item) => ({
      date: new Date(item.date).toISOString().split("T")[0], // Convert date to YYYY-MM-DD format
      name: item.name,
      type: item.type,
      tag: item.tag,
      amount: item.amount,
    }));
  
    var csv = unparse({
      fields: ["date", "name", "type", "tag", "amount"],
      data: formattedTransactions, // Use formatted transactions
    });
  

    const blob =  new Blob([csv],{type:"text/csv;charset=utf-8;"})
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href=url;
    link.download="transactions.csv";
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link);

  }

  function importFromCSV(event){
    event.preventDefault();
    try {
      parse(event.target.files[0],{
        header:true,
        complete:async function (results) {
          
          for(const transaction of results.data){
            const newTransaction = {
              ...transaction,
              amount:parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction,true);
          }
          toast.success("ALL transaction added");
          fetchTransaction();

        },
      });
      event.target.files=null;
    } catch (error) {
      
      toast.error(error.message)
    }

  }

  return (<>

    <div className='input-search-header'>
      <div className='input-search-bar'>
        <input 
        value={search} onChange={(e)=>{
          setSearch(e.target.value)
        }} 
        placeholder='Search by Name'
        />
      </div>
      <div className='filter-selector'>
          <Select
          className='select-input'
          onChange={(value)=>setTypeFilter(value)}
          value={typeFilter}
          placeholder='filter'
          allowClear
        >
          <Select.Option value=''>All</Select.Option>
          <Select.Option value='income'>Income</Select.Option>
          <Select.Option value='expense'>Expense</Select.Option>
        </Select>
      </div>

      
    </div>
    
    <div className='heading-container'>
      <div className='table-transaction-heading'>
        <h1>My Transactions</h1>
      </div>
      <div className='sort-by-key'>
        <Radio.Group
          className='input-radio'
          onChange={(e)=>setSortKey(e.target.value)}
          value={sortKey}
        >
          
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort By date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
      </div>
      
      <div className='csv-buttons'>
        <Button
          className='btn'
          type='primary'
          htmlType='submit'
          text={"Export to CSV"}
          onClick={exportToCSV}
        />
        <label htmlFor='file-csv' className='btn btn-blue'>Import from CSV</label>
        <input
          id='file-csv'
          type='file'
          accept='.csv'
          required
          onChange={importFromCSV}  
          style={{display:'none'}}
        />

      </div>
    </div>  
    

    <Table dataSource={sortedTransactions} columns={cloumns} rowKey="key" />

    

            
  {txnData && (
    txnData.type === "incomes" ? (
      <EditIncomeModal setShowModal={setShowModal} showModal={showModal} txnData={txnData} updateTransaction={updateTransaction} />
    ) : txnData.type === "expenses" ? (
      <EditExpenseModal setShowModal={setShowModal} showModal={showModal} txnData={txnData} updateTransaction={updateTransaction} />
    ) : null
  )}
       
        
      
1
  </> 
  )
}

export default TransactionTable

