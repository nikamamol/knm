// Import necessary modules
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from '../redux/reducer/billing/ClientSlice';

// Define the ApexChart component
const ApexChart = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.data); // Ensure clients is an array

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const clientCount = clients.length;
  // console.log(clientCount);

  const state = {
    series: [clientCount],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: 10,
              color: '#2D9ACC',
              fontSize: '16px',
            },
            value: {
              formatter: (val) => `${val}`, // Just display the count
              color: '#111',
              fontSize: '16px',
              show: true,
            },
          },
        },
      },
      labels: ['Client'], // This label can remain as it is
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="radialBar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
