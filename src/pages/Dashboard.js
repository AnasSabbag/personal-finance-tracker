import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddIncome from '../components/Modals/addIncome';
import AddExpense from '../components/Modals/addExpense';
import { toast } from 'react-toastify';
import {  collection, getDocs, query } from 'firebase/firestore';
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

  useEffect(() => {
    if (user) {
      fetchTransaction();
    }
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateBalance();
      setLoading(false); // Mark loading as false when transactions are fetched
    }
  }, [transactions]);

  async function fetchTransaction() {
    if (!user) return;

    setLoading(true);
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionArray = [];

    querySnapshot.forEach((doc) => {
      transactionArray.push(doc.data());
    });

    setTransactions(transactionArray);
    setLoading(false);
    toast.success("Transactions Fetched!");
  }

  function calculateBalance() {
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
  }

  // Sort transactions based on date
  let sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
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
          />
          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={() => setIsExpenseModalVisible(false)}
          />
          <TransactionTable transactions={transactions} fetchTransaction={fetchTransaction} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
