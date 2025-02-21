// Import necessary modules
import React from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

// Define the ApexChart component
class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [70],
      options: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70',
            }
          },
        },
        labels: ['Revenue'],
      },
    
    
    };
  }
  



  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
export default ApexChart;
