import { Box, Button, Grid } from '@mui/material';
import React from 'react';
import CourseCard from './Card/CourseCard';
import { CourseFormDialog } from './Dialogs/CourseFormDialog';
import { ICourseForm } from './ICourseForm';
import { ConfirmationModal, OkModal } from '../../../abstracts/Modals/Modals';
import useModal from '../../../hooks/useModal';
import { useCreateCourse, useDeleteCourse, useEditCourse } from '../../../domain/course/services/course-service';

const CourseComponent: React.FC = () => {

    const confirmationDeleteModal = useModal();

    const createCourseMutation = useCreateCourse();
    const editCourseMutation = useEditCourse();
    const deleteCourseMutation = useDeleteCourse();

    const courses: ICourseForm[] = [
        {
            id: 1,
            name: "Matemáticas",
            year: 30,
            description: "Clase de matemáticas para estudiantes de primaria",
        },
        {
            id: 2,
            name: "Ciencias",
            year: 25,
            description: "Clase de ciencias para estudiantes de secundaria",
        },
        {
            id: 3,
            name: "Programación",
            year: 20,
            description: "Clase de programación para estudiantes de preparatoria",
        },
    ];

    const [openDialog, setOpenDialog] = React.useState(false);
    const successModal = useModal();
    const [selectedCourse, setSelectedCourse] = React.useState<ICourseForm | undefined>();

    const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');

    const handleCreateCourse = () => {
        setDialogMode('create');
        setSelectedCourse(undefined); 
        handleOpenDialog();
    };

    const handleEditCourse = (course: ICourseForm) => {
        setDialogMode('edit');
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
                    onSuccess: (response) => {
                        console.log("Curso eliminado con éxito:", response.message);
                        confirmationDeleteModal.stopProcessing();
                        confirmationDeleteModal.closeModal();
                        // Actualiza la lista de cursos si es necesario
                    },
                    onError: (error) => {
                        console.error("Error al eliminar curso:", error);
                        confirmationDeleteModal.stopProcessing();
                        confirmationDeleteModal.closeModal();
                    }
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
        if (dialogMode === 'create') {
            createCourseMutation.mutate(data, {
                onSuccess: (response) => {
                    successModal.openModal(
                        () => {
                            successModal.closeModal();
                        },
                        () => { },
                        "Operación exitosa",
                        response.message
                    );
                    handleCloseDialog();
                    // Aquí puedes actualizar la lista de cursos si es necesario
                },
                onError: (error : any) => {
                    debugger;
                    console.error("Error al crear curso:", error);
                    successModal.openModal(
                        () => {
                            successModal.closeModal();
                        },
                        () => { },
                        "Ocurrió un error",
                        error.response.data.message
                    );
                }
            });
        } else if (dialogMode === 'edit' && selectedCourse && selectedCourse.id !== undefined) {
            editCourseMutation.mutate({ courseId: selectedCourse.id, data }, {
                onSuccess: (response) => {
                    successModal.openModal(
                        () => {
                            successModal.closeModal();
                        },
                        () => { },
                        "Operación exitosa",
                        response.message
                    );
                    handleCloseDialog();
                    // Actualiza la lista de cursos si es necesario
                },
                onError: (error: any) => {
                    successModal.openModal(
                        () => {
                            successModal.closeModal();
                        },
                        () => { },
                        "Ocurrió un error",
                        error.response.data.message
                    );
                }
            });
        }
    };


    return (
        <div>
            <Box p={4}>
                <h1>Cursos</h1>
                <Button variant="outlined" onClick={handleCreateCourse}>
                    Crear nuevo curso
                </Button>
                <Grid container spacing={3} pt={4}>
                    {courses.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CourseCard course={course} onEdit={handleEditCourse} onDelete={handleDeleteCourse} />
                        </Grid>
                    ))}
                </Grid>
                <CourseFormDialog
                    key={selectedCourse ? selectedCourse.name : 'new-course'}
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
