import { memo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

import moment from 'moment';
import { kFormatter } from '../../utils/utilityFunc';

const CategoriesChart = (props) => {
  const labels = Array.from(Array(10).keys()).map((v) =>
    moment()
      .subtract(10, 'd')
      .add(v + 1, 'd')
      .format('DD t\\háng MM')
  );
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 5,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: false,
      },
      layout: {
        padding: {
          left: 24,
          right: 32,
          top: 100,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        position: 'right',
        max: 100,
        ticks: {
          beginAtZero: true,
          stepSize: 10,
          callback: (value) => value + ' bài',
        },
      },
    },
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: '#1e88e5',
      },
    ],
  };

  return (
    <div className="categoriesChart mb-5 rounded-md p-3 bg-white shadow-smBlackShadow">
      <div className="chartHeader w-full mb-5 flex">
        <div className="title w-1/2 p-3">
          <h2 className="text-xl font-bold">Thống kê xu hướng</h2>
        </div>
        <div className="title w-1/2 p-3 text-right">
          <h2 className="text-base">
            <span>Tuần</span> | <span>Tháng</span> | <span>Năm</span>
          </h2>
        </div>
      </div>
      <Bar className="w-full h-60" options={options} data={data} />
    </div>
  );
};

export default memo(CategoriesChart);
