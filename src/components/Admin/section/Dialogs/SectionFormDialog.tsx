import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import { SimpleDialog } from "../../../../abstracts/Modals/SimpleDialog";
import { ISectionForm } from "../ISectionForm";
import { SectionsTable } from "../Table/SectionsTable";
import { useCreateSection, useEditSection } from "../../../../domain/section/services/section-services";
import { OkModal } from "../../../../abstracts/Modals/Modals";
import useModal from "../../../../hooks/useModal";

interface SectionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ISectionForm) => void;
  mode: "create" | "edit" | "config";
  refetch?: () => void;
  selectedSection?: ISectionForm;
}

export const SectionFormDialog: React.FC<SectionFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
  refetch,
  selectedSection: selectedSection
}) => {

  const [courseName, setCourseName] = React.useState("");
  const createSectionMutation = useCreateSection();
  const editSectionMutation = useEditSection();
  const successModal = useModal();

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (mode === "create" && courseName.trim()) {
      createSectionMutation.mutate({ name: courseName }, {
        onSuccess: () => {

          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => {
              onClose();
              setCourseName("");
              refetch && refetch();
            },
            "Operación exitosa",
            "Sección creada correctamente"
          );
        },
        onError: (error: any) => {
          successModal.openModal(
            () => {
              successModal.closeModal();
            },
            () => { },
            "Ocurrió un error",
            error.response.data.message || "Ocurrió un error al crear la sección"
          );
        }
      });
    } else if (mode === "edit" && selectedSection && selectedSection.id) {
      editSectionMutation.mutate(
        { sectionId: selectedSection.id, data: { name: courseName } },
        {
          onSuccess: () => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => {
                onClose();
                setCourseName("");
                refetch && refetch();
              },
              "Operación exitosa",
              "Sección editada correctamente"
            );
          },
          onError: (error: any) => {
            successModal.openModal(
              () => {
                successModal.closeModal();
              },
              () => { },
              "Ocurrió un error",
              error.response.data.message || "Ocurrió un error al editar la sección"
            );
          }
        }
      );
    }
  };

  React.useEffect(() => {
    if (mode === "edit" && selectedSection) {
      setCourseName(selectedSection.name);
    }
  }, [mode, selectedSection]);


  const handleClose = () => {
    setCourseName("");
    onClose();
  };

  return (
    <SimpleDialog
      open={open}
      handleOnClose={handleClose}
      title={(mode === "create" ? "Crear" : mode === "edit" ? "Editar" : "Configurar") + " sección"}
      width={600}
      minHeight={500}
      height={(mode === "config" ? 500 : 260)}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {mode !== "config" ? (
              <TextField
                fullWidth
                label="Nombre"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            ) : (
              <SectionsTable selectedSection={selectedSection}  />
            )}
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              {mode !== "config" && (
                <>
                  <Button variant="contained" color="primary" type="submit">
                    Guardar
                  </Button>
                  <Button variant="contained" onClick={handleClose}>
                    Cancelar
                  </Button>
                </>
              )}
            </Box>
          </Grid>

        </Grid>
      </form>
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
