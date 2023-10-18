import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { SimpleDialog } from "../../../../abstracts/Modals/SimpleDialog";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { OkModal } from "../../../../abstracts/Modals/Modals";
import { IRegister } from "../../../../domain/auth/constants/interfaces";
import {
  useRegister,
  useUpdateUser,
} from "../../../../domain/auth/services/auth-service";
import { ISectionGet } from "../../../../domain/section/constants/interfaces";
import { useGetAllSections } from "../../../../domain/section/services/section-services";
import useModal from "../../../../hooks/useModal";
import { IUsersForm, UserFormStrategy } from "../interfaces";

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: IUsersForm;
  onSubmit: (data: IUsersForm) => void;
  mode: "create" | "edit";
  userType: "students" | "teachers";
  refetch: () => void;
}

const getEmailSchema = (userType: "students" | "teachers") => {
  if (userType === "students") {
    return yup
      .string()
      .required("Correo es requerido")
      .matches(
        /^.*_estudiante@.*$/,
        "Formato de correo inválido para estudiante"
      );
  } else {
    return yup
      .string()
      .required("Correo es requerido")
      .matches(/^.*_profesor@.*$/, "Formato de correo inválido para profesor");
  }
};

export const UsersFormDialog: React.FC<StudentFormDialogProps> = ({
  open,
  onClose,
  defaultValues,
  mode,
  userType,
  refetch,
}) => {
  const title = userType === "students" ? "Estudiante" : "Profesor";
  const usuario = userType === "students" ? "estudiante" : "profesor";
  const strategy = userType === "students" ? StudentStrategy : TeacherStrategy;
  const createUserMutation = useRegister();
  const editUserMutation = useUpdateUser();
  const successModal = useModal();

  const courseSchema = yup.object().shape({
    id: yup.number().nullable(),
    names: yup.string().required("Nombre es requerido"),
    lastNames: yup.string().required("Apellido es requerido"),
    phoneNumber: yup
      .string()
      .required("Teléfono es requerido")
      .matches(/^[0-9]{9}$/, "El teléfono debe tener 9 dígitos"),
    email: getEmailSchema(userType),
    dni: yup
      .string()
      .required("DNI es requerido")
      .matches(/^[0-9]{8}$/, "El DNI debe tener 8 dígitos"),
    address: yup.string().required("Dirección es requerida"),
    password: mode === "create"
      ? yup
          .string()
          .required("Contraseña es requerida")
          .min(6, "La contraseña debe tener al menos 6 caracteres")
      : yup.string().nullable(),
    sectionId: yup.number().nullable(),
    studentId: yup.number().nullable(),
  });
  

  const internalHandleSubmit = (data: IUsersForm) => {
    if (mode === "create") {
      delete data.id;
      if (data.password !== undefined) {
        const userData: IRegister = {
          ...data,
          password: data.password,
        };
        createUserMutation.mutate(userData, {
          onSuccess: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {
                refetch && refetch();
                onClose();
                reset();
              },
              "Operación exitosa",
              "Usuario " + usuario + " creado correctamente"
            );
          },
          onError: (error: any) => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {},
              "Ocurrió un error",
              error.response.data.message ||
                "Ocurrió un error al eliminar la sección"
            );
          },
        });
      }
    } else if (mode === "edit") {
      if (userType === "teachers") {
          delete data.sectionId;
          delete data.studentId;
      }

      editUserMutation.mutate(
          { id: data.id!, data },
          {
              onSuccess: () => {
                  successModal.openModal(
                      () => {
                          successModal.closeModal();
                      },
                      () => {
                          refetch && refetch();
                          onClose();
                          reset();
                      },
                      "Operación exitosa",
                      "Usuario " + usuario + " actualizado correctamente"
                  );
              },
              onError: (error: any) => {
                  successModal.openModal(
                      () => {
                          successModal.closeModal();
                      },
                      () => {},
                      "Ocurrió un error",
                      error.response.data.message ||
                      "Ocurrió un error al actualizar el usuario"
                  );
              },
          }
      );
  }
  };

  const initialValues = defaultValues || {
    id: 0,
    names: "",
    lastNames: "",
    phoneNumber: "",
    email: "",
    dni: "",
    address: "",
    password: "",
    sectionId: null,
    studentId: null,
  };

  const { handleSubmit, control, reset, formState: { errors } } = useForm<{
    sectionId?: number;
    id?: number;
    names?: string;
    lastNames?: string;
    phoneNumber?: string;
    email?: string;
    dni?: string;
    address?: string;
    password?: string;
    studentId?: number;
  }>({
    defaultValues: initialValues,
    resolver: yupResolver(courseSchema)
  });

  React.useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset(defaultValues);
    } else {
      reset({
        id: 0,
        names: "",
        lastNames: "",
        phoneNumber: "",
        email: "",
        dni: "",
        address: "",
        password: "",
        sectionId: null,
        studentId: null,
      });
    }
  }, [mode, defaultValues, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <SimpleDialog
      open={open}
      handleOnClose={handleClose}
      title={`${mode === "create" ? "Crear" : "Editar"} ${title}`}
      width={630}
      minHeight={500}
      height={userType === "students" ? 600 : 540}
    >
      <Box p={3}>
      <form onSubmit={handleSubmit(internalHandleSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="names"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    helperText={errors.names?.message}
                    error={!!errors.names}
                    inputProps={{ autocomplete: "off" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="lastNames"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellido"
                    fullWidth
                    helperText={errors.lastNames?.message}
                    error={!!errors.lastNames}
                    inputProps={{ autocomplete: "off" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    helperText={errors.phoneNumber?.message}
                    error={!!errors.phoneNumber}
                    inputProps={{ autocomplete: "off" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo"
                    fullWidth
                    helperText={errors.email?.message}
                    error={!!errors.email}
                    inputProps={{ autoComplete: "off" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="dni"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="DNI"
                    fullWidth
                    helperText={errors.dni?.message}
                    error={!!errors.dni}
                    inputProps={{ autocomplete: "off" }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={mode === "edit" ? "******" : "Contraseña"}
                    fullWidth
                    type="password"
                    helperText={errors.password?.message}
                    error={!!errors.password}
                    inputProps={{ autocomplete: "off" }}
                    disabled={mode === "edit"}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección"
                    fullWidth
                    helperText={errors.address?.message}
                    error={!!errors.address}
                    inputProps={{ autocomplete: "off" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {strategy.renderExtraFields(control)}
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
      </Box>
      <OkModal
        height={230}
        open={successModal.isOpen}
        handleOnClose={successModal.closeModal}
        message={successModal.message}
      >
        {successModal.modalTitle}
      </OkModal>
    </SimpleDialog>
  );
};

const StudentStrategy: UserFormStrategy = {
  renderExtraFields: (control) => {
    const [sections, setSections] = React.useState<ISectionGet[]>([]);

    const getSections = useGetAllSections();

    React.useEffect(() => {
      getSections.mutate();
    }, []);

    React.useEffect(() => {
      if (getSections.data) {
        setSections(getSections.data);
      }
    }, [getSections.data]);

    return (
      <Controller
        name="sectionId"
        control={control}
        render={({ field }) => (
          <Autocomplete<ISectionGet, undefined, undefined, undefined>
            id="section-combobox"
            options={sections}
            getOptionLabel={(option: ISectionGet) => option.name}
            {...field}
            value={
              sections.find((section) => section.id === field.value) || null
            }
            onChange={(_, newValue: ISectionGet | null) => {
              field.onChange(newValue ? newValue.id : null);
          }}
          
            renderInput={(params) => <TextField {...params} label="Sección" />}
          />
        )}
      />
    );
  },
  transformSubmitData: (data) => data,
};

const TeacherStrategy: UserFormStrategy = {
  renderExtraFields: (____) => {
    const [_, __] = React.useState([]);
    const ___ = useGetAllSections();
    React.useEffect(() => {}, []);
    React.useEffect(() => {}, [___]);

    return null;
  },
  transformSubmitData: (data) => {
    const { sectionId, ...rest } = data;
    return {
      ...rest,
      sectionId: null
    };
},

};
