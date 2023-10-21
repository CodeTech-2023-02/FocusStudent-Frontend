import { DynamicChart } from '../Chart/Chart';
import { ApexOptions } from 'apexcharts';

export function RadarChartAnalysis({ data }) {
    const chartOptions: ApexOptions = {
        labels: data.map(item => item.sectionName),
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
            type="radar"
            height={350}
        />
    );
}
