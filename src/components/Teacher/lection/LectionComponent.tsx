import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";

import { ConfirmationModal } from "../../../abstracts/Modals/Modals";
import useModal from "../../../hooks/useModal";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import LectionCard from "./Card/LectionCard";
import { LectionFormDialog } from "./Dialogs/LectionFormDialog";
import { ILectionForm } from "./ILectionForm";

const LectionComponent: React.FC = () => {
  const confirmationDeleteModal = useModal();
  const students: ILectionForm[] = [
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
  const [selectedLection, setSelectedLection] = React.useState<
  ILectionForm | undefined
  >();

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create"
  );

  const handleCreateLection = () => {
    setDialogMode("create");
    handleOpenDialog();
  };

  const handleEditLection = (lection: ILectionForm) => {
    setDialogMode("edit");
    handleOpenDialog(lection);
  };

  const handleOpenDialog = (lection?: ILectionForm) => {
    setSelectedLection(lection || undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLection(undefined);
  };

  const handleDeleteLection = (lection: ILectionForm) => {
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

  const handleSubmitLection = (data: ILectionForm) => {
    console.log(data);
    handleCloseDialog();
  };

  return (
    <div>
      <Box p={4}>
        <h1>Lecciones</h1>
        <Grid container spacing={2} pt={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              style={{ height: 50 }}
              onClick={handleCreateLection}
            >
              Crear nueva lección
              <AddCircleIcon style={{ margin: 4 }} />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} pt={4}>
          {students.map((lection, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <LectionCard
                lection={lection}
                onEdit={handleEditLection}
                onDelete={handleDeleteLection}
              />
            </Grid>
          ))}
        </Grid>
        <LectionFormDialog
          key={selectedLection ? selectedLection.id : "new-course"}
          open={openDialog}
          mode={dialogMode}
          onClose={handleCloseDialog}
          defaultValues={selectedLection}
          onSubmit={handleSubmitLection}
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

export default LectionComponent;
