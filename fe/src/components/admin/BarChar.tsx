import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

interface BarChartProps {
  chartData: any;
}

function BarChart(props: BarChartProps ) {
  return <Bar data={props.chartData} />;
}

export default BarChart;