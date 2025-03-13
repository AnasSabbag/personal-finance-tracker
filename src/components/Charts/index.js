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

// ✅ Register necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const FinanceChart = ({ sortedTransactions }) => {
  const [showDetailedPie, setShowDetailedPie] = useState(false);
  const [showExpensePie, setShowExpensePie] = useState(false);

  // ✅ Ensure data is available
  if (!sortedTransactions || sortedTransactions.length === 0) {
    return <p>No data available for chart.</p>;
  }

  let incomeTotal = 0;
  let expenseTotal = 0;

  // ✅ Extract labels (dates) & data (amounts)
  const labels = sortedTransactions.map((item) => item.date);
  const dataPoints = sortedTransactions.map((item) => {
    if (item.type === "incomes") {
      incomeTotal += item.amount;
    } else if (item.type === "expenses") {
      expenseTotal += item.amount;
    }
    return item.amount;
  });

  // ✅ Line Chart Data
  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Transaction Amount",
        data: dataPoints,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 2,
        tension: 0.3, // Smooth curves
      },
    ],
  };

  // ✅ Line Chart Options
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

  // ✅ Pie Chart Data for Income vs Expense
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

  // ✅ Function to generate category-wise Pie Chart Data
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

    // ✅ Define category colors
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
            type="checkbox"
            checked={showDetailedPie}
            onChange={() => setShowDetailedPie(!showDetailedPie)}
          />
          Show Detailed Pie Chart
        </label>

        {showDetailedPie && (
          <label>
            <input
              type="checkbox"
              checked={showExpensePie}
              onChange={() => setShowExpensePie(!showExpensePie)}
            />
            Show inner Categories
          </label>
        )}
      </div>
    </div>
  );
};

export default FinanceChart;
