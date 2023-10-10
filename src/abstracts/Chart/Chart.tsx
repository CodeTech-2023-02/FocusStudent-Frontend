import React, { lazy, Suspense } from 'react';
import { ApexOptions } from 'apexcharts';

const Chart = lazy(() => import('react-apexcharts'));

interface DynamicChartProps {
  options: ApexOptions;
  series: { name: string; data: number[] }[];
  type: string;
  height: number;
}

export const DynamicChart: React.FC<DynamicChartProps> = ({ options, series, type, height }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart options={options} series={series} type={type} height={height} />
    </Suspense>
  );
};
