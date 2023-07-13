// import React, { useEffect, useRef } from "react";
// import { LineController, LinearScale } from "chart.js";
// import Chart from "chart.js/auto";
// import "./TickerGraphs.css";

// // Register the necessary chart components
// Chart.register(LineController, LinearScale);

// const TickerGraphs = () => {
//   const chartRef = useRef(null);
//   let chartInstance = null;

//   useEffect(() => {
//     const chartCanvas = chartRef.current.getContext('2d');

//     // Prepare the chart data
//     const chartData = {
//       labels: ['0q', '+1q', '0y', '+1y', '+5y', '-5y'],
//       datasets: [
//         {
//           label: 'Earnings Estimate',
//           data: [0.35, 0.4, 1.58, 2.57, null, null],
//           borderColor: 'blue',
//           backgroundColor: 'transparent',
//         },
//         {
//           label: 'Revenue Estimate',
//           data: [131.38, 137.98, 560.88, 625.42, null, null],
//           borderColor: 'green',
//           backgroundColor: 'transparent',
//         },
//       ],
//     };

//     // Destroy existing chart instance if it exists
//     if (chartInstance) {
//       chartInstance.destroy();
//     }

//     // Create the chart
//     chartInstance = new Chart(chartCanvas, {
//       type: 'line',
//       data: chartData,
//       options: {
//         scales: {
//           y: {
//             type: 'linear',
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   }, []);

//   return <canvas className="chart-canvas" ref={chartRef} />;
// };

// export default TickerGraphs;
