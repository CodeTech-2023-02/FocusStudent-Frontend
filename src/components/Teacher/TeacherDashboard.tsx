import { Box, Grid, useTheme } from "@mui/material";
import Performance from "../../abstracts/Analytics/Performance";
import { TasksAnalytics } from "../../abstracts/Analytics/TasksAnalytics";
import useModal from "../../hooks/useModal";

const TeacherDashboard: React.FC = () => {
  const theme = useTheme();
  const confirmationDeleteModal = useModal();
  const successModal = useModal();

  const handleDelete = () => {
    confirmationDeleteModal.openModal(
      () => {
        confirmationDeleteModal.startProcessing();
        setTimeout(() => {
          console.log("Operación completada");
          confirmationDeleteModal.stopProcessing();
          confirmationDeleteModal.closeModal();
        }, 2000);
      },
      () => {
        console.log("Modal cerrado");
      },
      "Eliminar a la loca",
      "¿Estás seguro de que deseas eliminar la loca?"
    );
  };

  const handleSuccess = () => {
    successModal.openModal(
      () => {
        successModal.closeModal();
      },
      () => {},
      "Operación exitosa",
      "La operación se realizó con éxito"
    );
  };

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

export default TeacherDashboard;
