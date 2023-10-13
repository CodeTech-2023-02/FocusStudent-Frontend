import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Box } from "@mui/material";
import { SimpleDialog } from "../../../../abstracts/Modals/SimpleDialog";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { ILessonForm } from "../ILessonForm";
import { useCreateLesson, useEditLesson } from "../../../../domain/lesson/services/lesson-service";
import { useParams } from "react-router-dom";
import useModal from "../../../../hooks/useModal";
import { OkModal } from "../../../../abstracts/Modals/Modals";

interface LectionFormDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: ILessonForm;
  onSubmit: (data: ILessonForm) => void;
  mode: "create" | "edit";
  fetchLessons: () => void;
}

const lectionSchema = yup.object().shape({
  courseSectionId: yup.number().required("Id es requerido"),
  name: yup.string().required("Nombre es requerido"),
  initialTime: yup.date().required("Fecha de inicio es requerido"),
  finalTime: yup.date().required("Fecha de fin es requerido"),
});

export const LectionFormDialog: React.FC<LectionFormDialogProps> = ({
  open,
  onClose,
  defaultValues,
  onSubmit,
  mode,
  fetchLessons
}) => {
  const initialValues = defaultValues || {
    courseSectionId: 0,
    name: "",
    initialTime: new Date(),
    finalTime: new Date(),
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ILessonForm>({
    defaultValues: initialValues,
    resolver: yupResolver(lectionSchema),
  });

  const { id } = useParams();

  const successModal = useModal();

  const createLesson = useCreateLesson();
  const editLesson = useEditLesson();

  const handleFormSubmit = (data: ILessonForm) => {

    if (mode === "create") {
      data.courseSectionId = Number(id);
      createLesson.mutate(data, {
        onSuccess: (response) => {
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {
              fetchLessons && fetchLessons();
            },
            "Operación exitosa",
            response.message
          );
          reset();
          onSubmit(data);
        },
        onError: (error) => {
          console.error("Error al crear la lección:", error);
        }
      });

    } else if (mode === "edit" && defaultValues) {
      editLesson.mutate({
        lessonId: Number(defaultValues.id),
        data: data,
      },{
        onSuccess: () => {
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {
              fetchLessons && fetchLessons();
            },
            "Operación exitosa",
            "Lección editada correctamente"
          );
        },
        onError: (error) => {
          console.error("Error al crear la lección:", error);
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {
              fetchLessons && fetchLessons();
            },
            "Ocurrío un error",
            "Ocurrío un error al editar la lección"
          );
        }
      });
    }
    //handleCloseDialog();
  };

  React.useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset(defaultValues);
    } else {
      reset({
        courseSectionId: 0,
        name: "",
        initialTime: new Date(),
        finalTime: new Date(),
      });
    }
  }, [mode, defaultValues, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SimpleDialog
        open={open}
        handleOnClose={handleClose}
        title="Lección"
        width={600}
        minHeight={500}
        height={350}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    helperText={errors.name?.message}
                    error={!!errors.name}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="initialTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de inicio (dd/MM/yyyy)"
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        fullWidth
                        helperText={errors.initialTime?.message}
                        error={!!errors.initialTime}
                      />
                    }
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="finalTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de fin (dd/MM/yyyy)"
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        fullWidth
                        helperText={errors.finalTime?.message}
                        error={!!errors.finalTime}
                      />
                    }
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" type="submit">
                  Guardar
                </Button>
                <Button variant="contained" onClick={handleClose}>
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </SimpleDialog>
      <OkModal
        height={230}
        open={successModal.isOpen}
        handleOnClose={successModal.closeModal}
        message={successModal.message}
      >
        {successModal.modalTitle}
      </OkModal>
    </LocalizationProvider>
  );
};
