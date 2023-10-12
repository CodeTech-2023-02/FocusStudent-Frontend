import { Box, Button, CircularProgress, Grid } from "@mui/material";
import React from "react";
import { ConfirmationModal, OkModal } from "../../../abstracts/Modals/Modals";
import {
  useCreateCourse,
  useDeleteCourse,
  useEditCourse,
  useGetAllCourses,
} from "../../../domain/course/services/course-service";
import useModal from "../../../hooks/useModal";
import SectionCard from "./Card/SectionCard";
import { SectionFormDialog } from "./Dialogs/SectionFormDialog";
import { ISectionForm } from "./ISectionForm";

const SectionComponent: React.FC = () => {
  const confirmationDeleteModal = useModal();
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState<ISectionForm[]>([]);


  
  const getCourseMutation = useGetAllCourses();


  const [openDialog, setOpenDialog] = React.useState(false);
  const successModal = useModal();
  const [selectedCourse, setSelectedCourse] = React.useState<
    ISectionForm | undefined
  >();

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create"
  );

  const fetchCourses = () => {
    setLoading(true);
    getCourseMutation.mutate(undefined, {
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
    setSelectedCourse(undefined);
    handleOpenDialog();
  };

  const handleConfig = (course: ISectionForm) => {
    setDialogMode("edit");
    handleOpenDialog(course);
  };

  const handleOpenDialog = (course?: ISectionForm) => {
    setSelectedCourse(course || undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(undefined);
  };


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
                />
              </Grid>
            ))
          )}
        </Grid>
        <SectionFormDialog
          key={selectedCourse ? selectedCourse.name : "new-course"}
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitCourse}
          mode={dialogMode} 
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
