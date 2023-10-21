import { ApexOptions } from 'apexcharts';
import { DynamicChart } from '../Chart/Chart';

export function BubbleChartAnalysis({ data }) {
    const chartOptions: ApexOptions = { 
        xaxis: {
            type: 'category',
            categories: data.map(item => item.sectionName),
        },
        theme: {
            mode: 'dark',
        },
    };

    const chartData = [{
        name: 'Total',
        data: data.map(item => ({
            x: item.sectionName,
            y: item.total,
            z: item.total * 2
        })),
    }];

    return (
        <DynamicChart
            options={chartOptions}
            series={chartData}
            type="bubble"
            height={350}
        />
    );
}
