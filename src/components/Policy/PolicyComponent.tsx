import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PageviewIcon from "@mui/icons-material/Pageview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import HistoryIcon from "@mui/icons-material/History";

const PolicyComponent: React.FC = () => {
  return (
    <Box p={4} boxShadow={3}>
      <Typography variant="h4" gutterBottom>
        Términos y Condiciones y Políticas de Uso
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText
            primary="Crear Perfiles"
            secondary="Registrar a los estudiantes con información como nombre, edad, grado, etc."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <PageviewIcon />
          </ListItemIcon>
          <ListItemText
            primary="Leer Perfiles"
            secondary="Ver la información y el progreso de cada estudiante."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText
            primary="Actualizar Perfiles"
            secondary="Modificar la información de los estudiantes."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText
            primary="Eliminar Perfiles"
            secondary="Borrar perfiles cuando sea necesario."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <NotificationImportantIcon />
          </ListItemIcon>
          <ListItemText
            primary="Alertas de Desconcentración"
            secondary="Notificar cuando el sistema detecta desconcentración frecuente."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText
            primary="Historial de Concentración"
            secondary="Acceder a informes sobre la concentración de los estudiantes en diferentes clases."
          />
        </ListItem>
      </List>

      <Typography variant="h5">
        Los términos y condiciones y las políticas de uso detalladas
        anteriormente están sujetas a cambios. Los usuarios deben revisar
        regularmente esta sección para estar al tanto de cualquier modificación.
        El uso continuado de "FocusStudent" implica la aceptación de estos
        términos y políticas.
      </Typography>
    </Box>
  );
};

export default PolicyComponent;
