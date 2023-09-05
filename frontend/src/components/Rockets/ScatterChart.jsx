// ScatterChart.jsx
import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto';

export default function ScatterChart({ data, chartOptions }) {

    return (
    <div>
      {/* <Scatter data={data} options={chartOptions}  /> */}
      <Scatter data={data} options={chartOptions} height={400} width={600} />

    </div>
  );

}


// set chart height to 400
