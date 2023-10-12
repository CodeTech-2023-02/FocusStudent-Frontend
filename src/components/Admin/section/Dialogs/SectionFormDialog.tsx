import { Box, Button, Grid } from "@mui/material";
import React from "react";
import { SimpleDialog } from "../../../../abstracts/Modals/SimpleDialog";
import { ISectionForm } from "../ISectionForm";

import { SectionsTable } from "../Table/SectionsTable";

interface SectionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ISectionForm) => void;
  mode: "create" | "edit";
}

// SectionFormDialog.tsx

import { TextField } from "@mui/material";

export const SectionFormDialog: React.FC<SectionFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
}) => {

  const [courseName, setCourseName] = React.useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onSubmit({ name: courseName });
    setCourseName("");
  };

  const handleClose = () => {
    setCourseName("");
    onClose();
  };

  return (
    <SimpleDialog
      open={open}
      handleOnClose={handleClose}
      title={mode === "edit" ? "Editar Sección" : "Crear Sección"}
      width={600}
      minHeight={500}
      height={mode === "edit" ? 500 : 300}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {mode === "edit" ? (
              <SectionsTable />
            ) : (
              <TextField
                fullWidth
                label="Nombre"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            )}
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
  );
};
