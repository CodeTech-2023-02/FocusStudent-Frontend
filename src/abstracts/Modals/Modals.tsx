import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { BaseModalProps, SimpleDialog } from "./SimpleDialog";

const typographyStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 3,
  textAlign: "center",
  fontWeight: 600,
  fontSize: "2rem",
};

const GenericModal: React.FC<BaseModalProps & { message?: string, actions: React.ReactNode }> = ({
  children,
  message,
  actions,
  ...props
}) => {
  return (
    <SimpleDialog isscroll={false} title={props.title}  {...props} actions={actions}>
      {children && (
  <Typography sx={typographyStyles}>{children}</Typography>
)}

      {message && (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
          fontSize="1.1rem"
        >
          {message}
        </Typography>
      )}
    </SimpleDialog>
  );
};

export const OkModal: React.FC<BaseModalProps & { message?: string }> = (props) => (
  <GenericModal
    {...props}
    actions={
      <Button
        sx={{ backgroundColor: "#296ff1", color: "#fff" }}
        variant="contained"
        color="primary"
        onClick={props.handleOnClose}
      >
        Ok
      </Button>
    }
  />
);

export const ConfirmationModal: React.FC<BaseModalProps & { handleOnConfirm: () => void; message?: string; isProcessing: boolean }> = ({
  handleOnConfirm,
  isProcessing,
  ...props
}) => (
  <GenericModal
    {...props}
    actions={
      isProcessing ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 1em",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOnConfirm}
            sx={{
              backgroundColor: "#296ff1",
              color: "#fff",
              marginRight: "6rem",
              "&:hover": {
                backgroundColor: "#5b91f5",
              },
            }}
          >
            Sí
          </Button>
          <Button
            variant="contained"
            onClick={props.handleOnClose}
            sx={{
              backgroundColor: "#363f4a",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#282b2e",
              },
            }}
          >
            No
          </Button>
        </Box>
      )
    }
  />
);