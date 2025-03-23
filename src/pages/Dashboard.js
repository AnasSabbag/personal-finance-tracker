import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddIncome from '../components/Modals/addIncome';
import AddExpense from '../components/Modals/addExpense';
import { toast } from 'react-toastify';
import {  addDoc,collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionTable from '../components/TransactionsTable';

import FinanceChart from '../components/Charts';

function Dashboard() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [transactions, setTransactions] = useState([]);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);



  const fetchTransaction = useCallback(async()=>{
    try {
      if (!user) return;

      setLoading(true);
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);

      let transactionArray = [];
      
      querySnapshot.forEach((doc) => {

        transactionArray.push({
          id:doc.id,
          ...doc.data()
        });
      });
      
      setTransactions(transactionArray);
      setLoading(false);
      toast.success("Transactions Fetched!");
    } catch (error) {
      toast.error("failed to fecth transactions",error);
    }
  },[user])

  const calculateBalance=useCallback(()=>{
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "incomes") {
        incomeTotal += transaction.amount;
      } else if (transaction.type === "expenses") {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  },[transactions])

  useEffect(() => {
    if (user) {
      fetchTransaction();
    }
  }, [user,fetchTransaction]);



  useEffect(() => {
    if (transactions.length > 0) {
      calculateBalance();
      setLoading(false); // Mark loading as false when transactions are fetched
    }
  }, [transactions,calculateBalance]);

  
  // Sort transactions based on date
  
  let sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  const onFinish=(values,type)=>{
    
    const newTransaction={
      type:type,
      date: values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.Name,
    };
    addTransaction(newTransaction,false);
  };



  async function addTransaction(transaction,many){
    try {
       await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
       
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
      if(!many) toast.success("Transaction Added!");
    } catch (e) {
      
      if(!many) toast.error(e.message);
    }
  }




  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='greeting-user' style={{position:'fixed',marginLeft:'10px',color:'lightblue'}}>
            <h4>Hii, Welcome back {user.displayName}</h4>
          </div>
          <Cards
            user={user}
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={() => setIsExpenseModalVisible(true)}
            showIncomeModal={() => setIsIncomeModalVisible(true)}
          />
          {sortedTransactions.length > 0 && <FinanceChart sortedTransactions={sortedTransactions} />}
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={() => setIsIncomeModalVisible(false)}
            onFinish={onFinish}
          />
          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={() => setIsExpenseModalVisible(false)}
            onFinish={onFinish}
          />
          <TransactionTable 
            transactions={transactions} 
            fetchTransaction={fetchTransaction} 
            setTransactions={setTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
