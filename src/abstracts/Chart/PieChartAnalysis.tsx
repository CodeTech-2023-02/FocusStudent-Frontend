import { DynamicChart } from '../Chart/Chart';
import { ApexOptions } from 'apexcharts';

export function PieChartAnalysis({ data }) {
    const chartOptions: ApexOptions = {
        labels: data.map(item => item.sectionName),
        theme: {
            mode: 'dark' as const,
        },
    };

    const chartData = data.map(item => item.total);

    return (
        <DynamicChart
            options={chartOptions}
            series={chartData}
            type="pie"
            height={350}
        />
    );
}
