import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";

import { ConfirmationModal } from "../../../abstracts/Modals/Modals";
import useModal from "../../../hooks/useModal";
import { IStudentForm } from "./IStudentForm";
import StudentCard from "./Card/StudentCard";
import { StudentFormDialog } from "./Dialogs/StudentFormDialog";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const StudentComponent: React.FC = () => {
  const confirmationDeleteModal = useModal();
  const students: IStudentForm[] = [
    {
      id: "001",
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "1234567890",
      correo: "juan.perez@example.com",
      dni: "12345678",
      direccion: "Calle 123",
    },
    {
      id: "002",
      nombre: "Ana",
      apellido: "García",
      telefono: "0987654321",
      correo: "ana.garcia@example.com",
      dni: "87654321",
      direccion: "Avenida 456",
    },
  ];

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<
    IStudentForm | undefined
  >();

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create"
  );

  const handleCreateCourse = () => {
    setDialogMode("create");
    handleOpenDialog();
  };

  const handleEditCourse = (course: IStudentForm) => {
    setDialogMode("edit");
    handleOpenDialog(course);
  };

  const handleOpenDialog = (course?: IStudentForm) => {
    setSelectedCourse(course || undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(undefined);
  };

  const handleDeleteCourse = (course: IStudentForm) => {
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
      "Eliminar el estudiante",
      "¿Estás seguro de que deseas eliminar el estudiante?"
    );
  };

  const handleSubmitCourse = (data: IStudentForm) => {
    console.log(data);
    handleCloseDialog();
  };

  return (
    <div>
      <Box p={4}>
        <h1>Estudiantes</h1>
        <Grid container spacing={2} pt={2}>
          <Grid item xs={12} sm={6} md={9}>
            <TextField
              label="Buscar por apellido"
              inputProps={{ autocomplete: "off" }}
              fullWidth
              style={{ height: 50 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              style={{ height: 50 }}
              onClick={handleCreateCourse}
            >
              Crear nuevo estudiante
              <AddCircleIcon style={{ margin: 4 }} />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} pt={4}>
          {students.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StudentCard
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            </Grid>
          ))}
        </Grid>
        <StudentFormDialog
          key={selectedCourse ? selectedCourse.id : "new-course"}
          open={openDialog}
          mode={dialogMode}
          onClose={handleCloseDialog}
          defaultValues={selectedCourse}
          onSubmit={handleSubmitCourse}
        />
        <ConfirmationModal
          height={230}
          title={confirmationDeleteModal.modalTitle}
          handleOnConfirm={confirmationDeleteModal.handleOnConfirm}
          open={confirmationDeleteModal.isOpen}
          handleOnClose={confirmationDeleteModal.closeModal}
          message={confirmationDeleteModal.message}
          isProcessing={confirmationDeleteModal.isProcessing}
        ></ConfirmationModal>
      </Box>
    </div>
  );
};

export default StudentComponent;
