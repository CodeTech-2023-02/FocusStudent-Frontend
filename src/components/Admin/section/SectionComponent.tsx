import { Box, Button, CircularProgress, Grid } from "@mui/material";
import React from "react";
import { ConfirmationModal, OkModal } from "../../../abstracts/Modals/Modals";
import { useDeleteSection, useGetAllSections } from "../../../domain/section/services/section-services";
import useModal from "../../../hooks/useModal";
import SectionCard from "./Card/SectionCard";
import { SectionFormDialog } from "./Dialogs/SectionFormDialog";
import { ISectionForm } from "./ISectionForm";

const SectionComponent: React.FC = () => {
  const confirmationDeleteModal = useModal();
  const successModal = useModal();
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState<ISectionForm[]>([]);



  const getSectionMutation = useGetAllSections();
  const deleteSectionMutation = useDeleteSection();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<
    ISectionForm | undefined
  >();

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit" | "config">(
    "create"
  );

  const fetchCourses = () => {
    setLoading(true);
    getSectionMutation.mutate(undefined, {
      onSuccess: (response) => {
        setCourses(response);
        setLoading(false);
      },
      onError: (error) => {
        console.error("Error al obtener los cursos:", error);
        setLoading(false);
      },
    });
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);


  const handleCreateCourse = () => {
    setDialogMode("create");
    setSelectedSection(undefined);
    setOpenDialog(true);
  };

  const handleConfig = (course: ISectionForm) => {
    setDialogMode("config");
    setSelectedSection(course);
    setOpenDialog(true);
  };

  const handleEdit = (course: ISectionForm) => {
    setDialogMode("edit");
    setSelectedSection(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSection(undefined);
    setDialogMode("create");
  };

  const handleDelete = (course: ISectionForm) => {
    if (course.id === undefined) {
      console.error("El ID de la sección no está definido");
      return;
    }
    confirmationDeleteModal.openModal(
      () => {
        confirmationDeleteModal.startProcessing();
        deleteSectionMutation.mutate(course.id!, {
          onSuccess: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => { },
              "Operación exitosa",
              "Sección eliminada con éxito"
            );
            confirmationDeleteModal.stopProcessing();
            confirmationDeleteModal.closeModal();
            fetchCourses();
          },
          onError: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => { },
              "Ocurrió un error",
              "No se pudo eliminar la sección"
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
  }

  const handleSubmitCourse = (data: ISectionForm) => {

  };

  return (
    <div>
      <Box p={4}>
        <h1>Secciones</h1>
        <Button variant="outlined" onClick={handleCreateCourse}>
          Crear nueva sección
        </Button>
        <Grid container spacing={3} pt={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SectionCard
                  course={course}
                  config={handleConfig}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))
          )}
        </Grid>
        <SectionFormDialog
          key={selectedSection ? selectedSection.name : "new-course"}
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitCourse}
          mode={dialogMode}
          refetch={fetchCourses}
          selectedSection={selectedSection}
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

export default SectionComponent;
