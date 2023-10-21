import { DynamicChart } from '../Chart/Chart';
import { ApexOptions } from 'apexcharts'; // Importando el tipo correcto

export function AreaChartAnalysis({ data }) {
    const chartOptions: ApexOptions = {
        xaxis: {
            categories: data.map(item => item.sectionName),
        },
        theme: {
            mode: 'dark' as const,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
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
            type="area"
            height={350}
        />
    );
}
