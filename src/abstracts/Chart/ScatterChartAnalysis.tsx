import { DynamicChart } from '../Chart/Chart';
import { ApexOptions } from 'apexcharts';

export function ScatterChartAnalysis({ data }) {
    const chartOptions: ApexOptions = {
        xaxis: {
            type: 'category',
            categories: data.map(item => item.sectionName),
        },
        theme: {
            mode: 'dark' as const,
        },
    };

    const chartData = [{
        name: 'Total',
        data: data.map(item => item.total),
    }];

    return (
        <DynamicChart
            options={chartOptions}
            series={chartData}
            type="scatter"
            height={350}
        />
    );
}
