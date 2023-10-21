
import { Box, Grid, useTheme } from "@mui/material";
import { TasksAnalytics } from "../../abstracts/Analytics/TasksAnalytics";
import Performance from "../../abstracts/Analytics/Performance";
const StudentDashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <div>
      <Box
        p={4}
        sx={{
          background: `${theme.colors.alpha.black[5]}`,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={8}>
            <TasksAnalytics />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Performance />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default StudentDashboard;
