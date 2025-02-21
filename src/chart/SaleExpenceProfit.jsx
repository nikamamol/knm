import React from 'react';
import Chart from 'react-apexcharts';


const Dashboard = () => {
  // Options and series for each chart
  const chartOptions = {
    chart: {
      type: 'line',
      height: 100,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `$${val.toLocaleString()}`, // Format tooltip values
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
  };

  const salesData = [54000, 65000, 75000, 82000, 95000, 112000, 135000, 125000];
  const expensesData = [32000, 45000, 51000, 62000, 70000, 88000, 92000, 84000];
  const profitsData = [21000, 31000, 36000, 45000, 58000, 69000, 73000, 62000];

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sales Card */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4 bg_sale bg-danger">
            <div className="card-body">
              <h5 className="card-title text-center">$424,652</h5>
              <p className="text-muted text-center">Sales</p>
              <Chart
                options={chartOptions}
                series={[{ name: 'Sales', data: salesData }]}
                type="line"
                height={30}
              />
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4 bg_expenses bg-info">
            <div className="card-body">
              <h5 className="card-title text-center">$235,312</h5>
              <p className="text-muted text-center">Expenses</p>
              <Chart
                options={chartOptions}
                series={[{ name: 'Expenses', data: expensesData }]}
                type="line"
                height={30}
              />
            </div>
          </div>
        </div>

        {/* Profits Card */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4 bg_profit bg-warning">
            <div className="card-body">
              <h5 className="card-title text-center">$135,965</h5>
              <p className="text-muted text-center">Profits</p>
              <Chart
                options={chartOptions}
                series={[{ name: 'Profits', data: profitsData }]}
                type="line"
                height={30}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
