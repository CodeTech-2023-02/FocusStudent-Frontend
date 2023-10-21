// DynamicChart.tsx
import React, { lazy, Suspense } from "react";
import { ApexOptions } from "apexcharts";
import { Box, Typography } from "@mui/material";

const Chart = lazy(() => import("react-apexcharts"));

interface DynamicChartProps {
  options: ApexOptions;
  series: { name: string; data: number[] }[];
  type: string;
  height: number;
}

export const DynamicChart: React.FC<DynamicChartProps> = ({
  options,
  series,
  type,
  height,
}) => {
  
  const isEmptyData = !series.length

  if (isEmptyData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height} flexDirection="column">
        <Typography variant="h6" color="textSecondary">
          No hay datos disponibles
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No se encontraron resultados para esta categoría.
        </Typography>
      </Box>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart options={options} series={series} type={type} height={height} />
    </Suspense>
  );
};
