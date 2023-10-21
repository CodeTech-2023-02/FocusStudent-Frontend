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
import { DASHBOARD } from "../../constants/routes";
import { useLogin } from "../../domain/auth/services/auth-service";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { OkModal } from "../../abstracts/Modals/Modals";
import useModal from "../../hooks/useModal";
import { HttpStatusCode } from "../../infra/interfaces";

const StyledImage = styled(
  memo((props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />)
)({
  maxWidth: "100%",
  height: "auto",
  display: "block",
  margin: "auto",
});

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /_estudiante|_profesor|_admin/,
      'El correo debe contener "_estudiante" o "_profesor" o "_admin" antes del @.'
    )
    .required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerida"),
});

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const loginMutation = useLogin();
  const successModal = useModal();

  if (!auth) {
    return <div>Error: No se pudo obtener el contexto de autenticación.</div>;
  }

  const { login } = auth;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    handleLogin(data.username, data.password);
  };

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (typeof data.id !== "number") {
            console.error(
              "Error: la respuesta del servidor no contiene un campo 'id'."
            );
            return;
          }
          login({
            role: data.role,
            token: data.token,
            id: data.id,
            name: data.name,
            studentId: data.studentId,
            teacherId: data.teacherId,
            sectionId: data.sectionId,
          });

          if (data.role === Roles.TEACHER) {
            navigate(DASHBOARD);
          } else if (data.role === Roles.STUDENT) {
            navigate(DASHBOARD);
          }
        },
        onError: (error: any) => {
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {},
            "Ocurrió un error",
            error.response.data.status === HttpStatusCode.unauthorized
              ? "Credenciales inválidas"
              : error.response.data.message
          );
        },
      }
    );
  };

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
              Bienvenido a FocusStudent
            </Typography>
          </Grid>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item style={{ width: "20rem" }} mt={2}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Correo"
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>

            <Grid item style={{ width: "20rem" }} mt={2}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Contraseña"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item mt={4}>
              <Typography variant="body2">
                ¿Problemas con tu cuenta?
                <Link onClick={() => navigate("/support")}>
                  {" "}
                  Contacta a soporte
                </Link>
              </Typography>
            </Grid>

            <Grid item mt={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={loginMutation.isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                {loginMutation.isLoading ? "Cargando..." : "INGRESAR"}
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
          <StyledImage src="assets/login.svg" alt="Login illustration" />
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

export default Login;
