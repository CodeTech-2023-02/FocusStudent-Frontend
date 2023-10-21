import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import TasksAnalytics from "../../abstracts/Analytics/AnalyticsGraph";
import Performance from "../../abstracts/Analytics/Performance";
import { AreaChartAnalysis } from "../../abstracts/Chart/AreaChartAnalysis";
import { BubbleChartAnalysis } from "../../abstracts/Chart/BubbleChartAnalysis";
import { DonutChartAnalysis } from "../../abstracts/Chart/DonutChartAnalysis";
import { PieChartAnalysis } from "../../abstracts/Chart/PieChartAnalysis";
import { RadarChartAnalysis } from "../../abstracts/Chart/RadarChartAnalysis";
import { ScatterChartAnalysis } from "../../abstracts/Chart/ScatterChartAnalysis";
import { useGetAnalysis } from "../../domain/analysis/services/analysis-services";
import { concatMap, from, toArray } from "rxjs";


const ReportComponent: React.FC = () => {
  const getAnalysisMutation = useGetAnalysis();

  const [analysisData, setAnalysisData] = useState<Record<string, any>>({}); 
    const faceStatusValues = ["NEUTRAL", "HAPPY", "SAD", "ANGRY", "FEARFUL", "DISGUSTED", "SURPRISED"];

    useEffect(() => {

        const subscription = from(faceStatusValues).pipe(
            concatMap(faceStatus => 
                new Promise(resolve => {
                    getAnalysisMutation.mutate({ faceStatus }, {
                        onSuccess: (data) => {
                            setAnalysisData(prevData => {
                                const newData = { ...prevData, [faceStatus]: data };
                                resolve(newData);
                                return newData;
                            });
                        }
                    });
                })
            ),
            toArray()
        ).subscribe();

        return () => subscription.unsubscribe();
    }, []);

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
                <Grid item xs={12}>
                    <AreaChartAnalysis data={analysisData["NEUTRAL"] || []} />
                </Grid>
                <Grid item xs={12}>
                    <BubbleChartAnalysis data={analysisData["HAPPY"] || []} />
                </Grid>
                <Grid item xs={12}>
                    <DonutChartAnalysis data={analysisData["SAD"] || []} />
                </Grid>
                <Grid item xs={12}>
                    <PieChartAnalysis data={analysisData["ANGRY"] || []} />
                </Grid>
                <Grid item xs={12}>
                    <RadarChartAnalysis data={analysisData["FEARFUL"] || []} />
                </Grid>
                <Grid item xs={12}>
                    <ScatterChartAnalysis data={analysisData["DISGUSTED"] || []} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportComponent;
