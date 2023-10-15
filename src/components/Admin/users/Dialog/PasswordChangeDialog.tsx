import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { SimpleDialog } from "../../../../abstracts/Modals/SimpleDialog";
import { IUsersForm } from "../interfaces";
import { useChangePassword } from "../../../../domain/auth/services/auth-service";
import {
  ConfirmationModal,
  OkModal,
} from "../../../../abstracts/Modals/Modals";
import useModal from "../../../../hooks/useModal";

const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Required")
    .min(6, "Debe tener al menos 6 caracteres"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Las contraseñas deben ser iguales")
    .required("Required"),
});

interface IPasswordChangeDialogProps {
  open: boolean;
  onClose: () => void;
  user: IUsersForm;
}

interface IPasswordChangeForm {
  newPassword: string;
  confirmPassword: string;
}

export const PasswordChangeDialog: React.FC<IPasswordChangeDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const confirmationDeleteModal = useModal();
  const successModal = useModal();

  const changePasswordMutation = useChangePassword();

  const onSubmit = (data: IPasswordChangeForm) => {
    confirmationDeleteModal.openModal(
      () => {
        confirmationDeleteModal.startProcessing();
        changePasswordMutation.mutate(
          {
            id: user.id!,
            data: {
              password: data.newPassword,
            },
          },
          {
            onSuccess: () => {
              successModal.openModal(
                () => {
                  successModal.closeModal();
                },
                () => {},
                "Operación exitosa",
                "Contraseña cambiada con éxito"
              );
              confirmationDeleteModal.stopProcessing();
              confirmationDeleteModal.closeModal();
            },
            onError: () => {
              successModal.openModal(
                () => {
                  successModal.closeModal();
                },
                () => {},
                "Ocurrió un error",
                "No se pudo cambiar la contraseña"
              );
              confirmationDeleteModal.stopProcessing();
              confirmationDeleteModal.closeModal();
            },
          }
        );
      },
      () => {},
      "Cambio de contraseña",
      "¿Estás seguro de que deseas cambiar la contraseña?"
    );
  };

  return (
    <SimpleDialog
      open={open}
      handleOnClose={onClose}
      title="Cambio de contraseña"
      width={500}
      height={360}
      actions={
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Cambiar contraseña
        </Button>
      }
    >
      <form noValidate autoComplete="off">
        <Box pb={3}>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type={showNewPassword ? "text" : "password"}
                label="Nueva contraseña"
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box pb={3}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type={showConfirmPassword ? "text" : "password"}
                label="Confirmar contraseña"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>
      </form>
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
    </SimpleDialog>
  );
};
