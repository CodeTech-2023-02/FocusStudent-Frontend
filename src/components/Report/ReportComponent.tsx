import { Box, Grid } from '@mui/material';
import React from 'react';
import TasksAnalytics from '../../abstracts/Analytics/AnalyticsGraph';
import Performance from "../../abstracts/Analytics/Performance";

const ReportComponent: React.FC = () => {
    return (
        <Box p={4} boxShadow={3}>
            <h1>Reportes</h1>
            <Grid container spacing={2}>

                <Grid item xs={12} sm={6} md={8}>
                    <TasksAnalytics />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Performance />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportComponent;
