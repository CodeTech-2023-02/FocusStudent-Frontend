import { memo } from "react";

import { useAuth } from "../../state/AuthContext";

import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants/roles";
import { STUDENT_DASHBOARD, TEACHER_DASHBOARD } from "../../constants/routes";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { OkModal } from "../../abstracts/Modals/Modals";
import useModal from "../../hooks/useModal";

const StyledImage = styled(
  memo((props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />)
)({
  maxWidth: "70%",
  height: "auto",
  display: "block",
  margin: "auto",
});

type FieldName =
  | "names"
  | "lastNames"
  | "phoneNumber"
  | "dni"
  | "email"
  | "address"
  | "password"
  | "sectionId";

function getLabel(fieldName: FieldName): string {
  switch (fieldName) {
    case "names":
      return "Nombres";
    case "lastNames":
      return "Apellidos";
    case "phoneNumber":
      return "Número de Teléfono";
    case "dni":
      return "DNI";
    case "email":
      return "Correo";
    case "address":
      return "Dirección";
    case "password":
      return "Contraseña";
    default:
      return "";
  }
}

const registerSchema = yup.object().shape({
  names: yup
    .string()
    .required("Nombre es requerido")
    .transform((value) =>
      value
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ),
  lastNames: yup
    .string()
    .required("Apellidos son requeridos")
    .transform((value) =>
      value
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ),
  phoneNumber: yup
    .string()
    .required("Número de teléfono es requerido")
    .matches(/^\d{9}$/, "Número de teléfono debe tener 9 dígitos"),
  dni: yup
    .string()
    .required("DNI es requerido")
    .matches(/^\d{8}$/, "DNI debe tener 8 dígitos"),
  email: yup
    .string()
    .matches(
      /_estudiante|_profesor/,
      'El correo debe contener "_estudiante" o "_profesor" antes del @.'
    )
    .required("Correo es requerido"),
  address: yup
    .string()
    .required("Dirección es requerida")
    .transform((value) =>
      value
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ),
  password: yup
    .string()
    .required("Contraseña es requerida")
    .min(4, "Contraseña debe tener al menos 4 caracteres"),
  sectionId: yup.number().required("Section ID es requerido"),
});

const Register = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const successModal = useModal();

  if (auth && auth.currentUser) {
    navigate(
      auth.currentUser.role === Roles.STUDENT
        ? STUDENT_DASHBOARD
        : TEACHER_DASHBOARD
    );
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      names: "",
      lastNames: "",
      phoneNumber: "",
      dni: "",
      email: "",
      address: "",
      password: "",
      sectionId: 0,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const fieldNames: FieldName[] = [
    "names",
    "lastNames",
    "phoneNumber",
    "dni",
    "email",
    "address",
    "password",
  ];

  return (
    <Box m={2}>
      <Grid container spacing={4} style={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item p={2}>
            <Typography variant="h1" gutterBottom>
              Registro en FocusStudent
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fieldNames.map((fieldName) => (
              <Grid key={fieldName} item style={{ width: "20rem" }} mt={2}>
                <Controller
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={fieldName === "password" ? "password" : "text"}
                      label={getLabel(fieldName)}
                      variant="outlined"
                      error={!!errors[fieldName]}
                      helperText={errors[fieldName]?.message}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item style={{ width: "20rem" }} mt={2}>
              <Controller
                name="sectionId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="ID de Sección"
                    variant="outlined"
                    error={!!errors.sectionId}
                    helperText={errors.sectionId?.message}
                  />
                )}
              />
            </Grid>
            <Grid item mt={4}>
              <Typography variant="body2">
                ¿Ya tienes una cuenta?
                <Link onClick={() => navigate("/login")}> INGRESA AQUÍ</Link>
              </Typography>
            </Grid>
            <Grid item mt={2}>
              <Button variant="contained" color="primary" type="submit">
                REGISTRARSE
              </Button>
            </Grid>
          </form>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          alignItems="center"
          justifyContent="center"
        >
          <StyledImage src="assets/register.svg" alt="Login illustration" />
        </Grid>
      </Grid>
      <OkModal
        height={230}
        open={successModal.isOpen}
        handleOnClose={successModal.closeModal}
        message={successModal.message}
      >
        {successModal.modalTitle}
      </OkModal>
    </Box>
  );
};

export default Register;
