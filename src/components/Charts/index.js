import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./style.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const FinanceChart = ({ sortedTransactions }) => {
  const [showDetailedPie, setShowDetailedPie] = useState(false);
  const [showExpensePie, setShowExpensePie] = useState(false);

  if (!sortedTransactions || sortedTransactions.length === 0) {
    return <p>No data available for chart.</p>;
  }

  let incomeTotal = 0;
  let expenseTotal = 0;

  let labelsSet = new Set();
  let incomeMap = new Map();
  let expenseMap = new Map();

  // Collect unique dates and amounts mapped by date
  sortedTransactions.forEach((item) => {
    labelsSet.add(item.date);
    if (item.type === "incomes") {
      incomeTotal += item.amount;
      incomeMap.set(item.date, (incomeMap.get(item.date) || 0) + item.amount);
    } else if (item.type === "expenses") {
      expenseTotal += item.amount;
      expenseMap.set(item.date, (expenseMap.get(item.date) || 0) + item.amount);
    }
  });

  const labels = Array.from(labelsSet).sort();

  const incomeDataPoints = labels.map(date => incomeMap.get(date) || 0);
  const expenseDataPoints = labels.map(date => expenseMap.get(date) || 0);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Income Amount",
        data: incomeDataPoints,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Expense Amount",
        data: expenseDataPoints,
        borderColor: "rgb(209, 49, 44)",
        backgroundColor: "rgba(209, 49, 44,0.2)",
        borderWidth: 2,
        tension: 0.3,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Amount" }, beginAtZero: true },
    },
  };

  const pieChartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["green", "orangered"],
        hoverBackgroundColor: ["#2E86C1", "#D3545D"],
      },
    ],
  };

  const getCategoryPieChartData = () => {
    const categories = {};
    const chartType = showExpensePie ? "expenses" : "incomes";

    sortedTransactions.forEach((t) => {
      if (t.type === chartType) {
        categories[t.tag] = (categories[t.tag] || 0) + t.amount;
      }
    });

    const labels = Object.keys(categories);
    const dataValues = Object.values(categories);

    
    
        //  Define category colors
        const colorMap = showExpensePie
        ? {
            food: "#FFA726", // Orange
            education: "#607D8B", // Blue-Grey
            entertainment: "#FBC02D", // Yellow
            shopping: "#E91E63", // Pink
            bills: "#E74C3C", // Red
            otherExpenses: "#9E9E9E", // Grey (Default)
          }
        : {
            salary: "#4CAF50", // Green
            freelance: "#36A2EB", // Blue
            investment: "#8E44AD", // Purple
          };
      

    const backgroundColors = labels.map((label) => colorMap[label] || "#9E9E9E");

    return {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors.map((color) => color + "CC"),
        },
      ],
    };
  };

  return (
    <div className="financial-chart">
      <div className="line-chart">
        <Line data={lineChartData} options={options} />
      </div>

      <div className="pie-chart">
        <Pie data={showDetailedPie ? getCategoryPieChartData() : pieChartData} />
      </div>

      <div className="toggle-switch">
        <label>
          <input
            type="submit"
            onClick={() => setShowDetailedPie(!showDetailedPie)}
            value={!showDetailedPie ? "Detailed Expense and Income Chart" : "Expense and Income Chart"}
            style={{ background: "#2970ff", color: "white", border: "none", height: "24px", borderRadius: "5px" }}
          />
        </label>

        {showDetailedPie && (
          <label>
            <input
              type="submit"
              style={{ background: "#2970ff", color: "white", border: "none", height: "24px", borderRadius: "5px" }}
              onClick={() => setShowExpensePie(!showExpensePie)}
              value={showExpensePie ? "Show Income Sources" : "Show Expense Categories"}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default FinanceChart;
