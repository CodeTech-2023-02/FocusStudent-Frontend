import { Box, Button, CircularProgress, Grid } from "@mui/material";
import React from "react";
import CourseCard from "./Card/CourseCard";
import { CourseFormDialog } from "./Dialogs/CourseFormDialog";
import { ICourseForm } from "./ICourseForm";
import { ConfirmationModal, OkModal } from "../../../abstracts/Modals/Modals";
import useModal from "../../../hooks/useModal";
import {
  useCreateCourse,
  useDeleteCourse,
  useEditCourse,
  useGetAllCourses,
} from "../../../domain/course/services/course-service";
import { useAuth } from "../../../state/AuthContext";
import { useGetAllCoursesSectionBySection, useGetAllCoursesSectionByTeacher } from "../../../domain/course_section/services/course_section-service";

const CourseComponent: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState<ICourseForm[]>([]);
  const [idForLessons, setIdForLessons] = React.useState<number[]>([]);

  const createCourseMutation = useCreateCourse();
  const editCourseMutation = useEditCourse();
  const deleteCourseMutation = useDeleteCourse();
  const getCourseMutation = useGetAllCoursesSectionBySection();
  const getAllCoursesSectionByTeacherMutation =
    useGetAllCoursesSectionByTeacher();
  const getAllCourses = useGetAllCourses();

  const [openDialog, setOpenDialog] = React.useState(false);
  const successModal = useModal();
  const confirmationDeleteModal = useModal();
  const [selectedCourse, setSelectedCourse] = React.useState<
    ICourseForm | undefined
  >();

  const { currentUser } = useAuth();
  const role = currentUser?.role || "";
  const sectionId = currentUser?.sectionId || 0;

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create"
  );

  const fetchCourses = () => {
    setLoading(true);
    if (role === "TEACHER" && currentUser) {
      getAllCoursesSectionByTeacherMutation.mutate(currentUser.teacherId, {
        onSuccess: (response) => {
          setCourses(response.map((item) => item.course));
          setIdForLessons(response.map((item) => item.id));
          setLoading(false);
        },
        onError: (error) => {
          console.error("Error al obtener los cursos por maestro:", error);
          setLoading(false);
        },
      });
    } else if (role === "STUDENT" && currentUser){
      getCourseMutation.mutate(sectionId, {
        onSuccess: (response) => {
          const mappedCourses = response.map(item => ({
            id: item.id,
            name: item.course.name,
            year: item.course.year,
            description: item.course.description,
          }));
          
          setCourses(mappedCourses);
          setLoading(false);
        },
        onError: (error) => {
          console.error("Error al obtener los cursos:", error);
          setLoading(false);
        },
      });
    }
    else {
      getAllCourses.mutate(undefined, {
        onSuccess: (response) => {
          setCourses(response);
          setLoading(false);
        },
        onError: (error) => {
          console.error("Error al obtener los cursos:", error);
          setLoading(false);
        },
      });
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    setDialogMode("create");
    setSelectedCourse(undefined);
    handleOpenDialog();
  };

  const handleEditCourse = (course: ICourseForm) => {
    setDialogMode("edit");
    handleOpenDialog(course);
  };

  const handleOpenDialog = (course?: ICourseForm) => {
    setSelectedCourse(course || undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(undefined);
  };

  const handleDeleteCourse = (course: ICourseForm) => {
    if (course.id === undefined) {
      console.error("El ID del curso no está definido");
      return;
    }
    confirmationDeleteModal.openModal(
      () => {
        confirmationDeleteModal.startProcessing();
        deleteCourseMutation.mutate(course.id!, {
          onSuccess: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {},
              "Operación exitosa",
              "Curso eliminado con éxito"
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
              () => {},
              "Ocurrió un error",
              "No se pudo eliminar el curso"
            );
            confirmationDeleteModal.stopProcessing();
            confirmationDeleteModal.closeModal();
          },
        });
      },
      () => {
        console.log("Modal cerrado");
      },
      "Eliminar el curso",
      "¿Estás seguro de que deseas eliminar el curso?"
    );
  };

  const handleSubmitCourse = (data: ICourseForm) => {
    if (dialogMode === "create") {
      createCourseMutation.mutate(data, {
        onSuccess: (response) => {
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {},
            "Operación exitosa",
            response.message
          );
          handleCloseDialog();
          fetchCourses();
        },
        onError: (error: any) => {
          console.error("Error al crear curso:", error);
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {},
            "Ocurrió un error",
            error.response.data.message
          );
        },
      });
    } else if (
      dialogMode === "edit" &&
      selectedCourse &&
      selectedCourse.id !== undefined
    ) {
      editCourseMutation.mutate(
        { courseId: selectedCourse.id, data },
        {
          onSuccess: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {},
              "Operación exitosa",
              "Curso editado con éxito"
            );
            handleCloseDialog();
            fetchCourses();
          },
          onError: (error: any) => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {},
              "Ocurrió un error",
              error.response.data.message
            );
          },
        }
      );
    }
  };

  return (
    <div>
      <Box p={4}>
        <h1>Cursos</h1>
        {role !== "STUDENT" && role !== "TEACHER" && (
          <Button variant="outlined" onClick={handleCreateCourse}>
            Crear nuevo curso
          </Button>
        )}
        <Grid container spacing={3} pt={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CourseCard
                  idForLessons={idForLessons[index]}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  role={role}
                />
              </Grid>
            ))
          )}
        </Grid>
        <CourseFormDialog
          key={selectedCourse ? selectedCourse.name : "new-course"}
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

export default CourseComponent;
