import { Box, Button, Grid } from "@mui/material";
import React from "react";

import { ConfirmationModal, OkModal } from "../../../abstracts/Modals/Modals";
import useModal from "../../../hooks/useModal";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useParams } from "react-router-dom";
import {
  useDeleteLesson,
  useGetLessonsByCourseSection,
} from "../../../domain/lesson/services/lesson-service";
import LectionCard from "./Card/LessonnCard";
import { LectionFormDialog } from "./Dialogs/LessonFormDialog";
import { ILessonForm } from "./ILessonForm";

const LectionComponent: React.FC = () => {
  const confirmationDeleteModal = useModal();
  const getLessons = useGetLessonsByCourseSection();
  const [lessons, setLessosn] = React.useState<ILessonForm[]>([]);

  const { id } = useParams();

  React.useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = () => {
    getLessons.mutate(Number(id), {
      onSuccess: (response) => {
        const transformedData = response.map((item) => ({
          id: item.id,
          courseSectionId: item.courseSection.id,
          name: item.name,
          initialTime: item.initialTime,
          finalTime: item.finalTime,
        }));

        setLessosn(transformedData);
      },
      onError: (error) => {
        console.error("Error al obtener los cursos por maestro:", error);
      },
    });
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedLection, setSelectedLection] = React.useState<
    ILessonForm | undefined
  >();

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create"
  );

  const deleteLesson = useDeleteLesson();
  const successModal = useModal();

  const handleCreateLection = () => {
    setDialogMode("create");
    handleOpenDialog();
  };

  const handleEditLection = (lection: ILessonForm) => {
    setDialogMode("edit");
    handleOpenDialog(lection);
  };

  const handleOpenDialog = (lection?: ILessonForm) => {
    setSelectedLection(lection || undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLection(undefined);
  };

  const handleDeleteLection = (course: ILessonForm) => {
    if (course.id === undefined) {
      console.error("El ID de la sección no está definido");
      return;
    }
    confirmationDeleteModal.openModal(
      () => {
        confirmationDeleteModal.startProcessing();
        deleteLesson.mutate(course.id!, {
          onSuccess: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {},
              "Operación exitosa",
              "Lección eliminada con éxito"
            );
            confirmationDeleteModal.stopProcessing();
            confirmationDeleteModal.closeModal();
            fetchLessons();
          },
          onError: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {},
              "Ocurrió un error",
              "No se pudo eliminar la lección"
            );
            confirmationDeleteModal.stopProcessing();
            confirmationDeleteModal.closeModal();
          },
        });
      },
      () => {
        console.log("Modal cerrado");
      },
      "Eliminar la sección",
      "¿Estás seguro de que deseas eliminar la sección?"
    );
  };

  const handleSubmitLection = (data: ILessonForm) => {
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
          {lessons.map((lection, index) => (
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
          key={selectedLection ? selectedLection.courseSectionId : "new-course"}
          open={openDialog}
          mode={dialogMode}
          onClose={handleCloseDialog}
          defaultValues={selectedLection}
          onSubmit={handleSubmitLection}
          fetchLessons={fetchLessons}
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
        <OkModal
          height={230}
          open={successModal.isOpen}
          handleOnClose={successModal.closeModal}
          message={successModal.message}
        >
          {successModal.modalTitle}
        </OkModal>
      </Box>
    </div>
  );
};

export default LectionComponent;
