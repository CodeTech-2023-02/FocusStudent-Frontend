import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardContent, Grid, IconButton } from "@mui/material";
import React from "react";
import { ILectionForm } from "../ILectionForm";

interface StudentCardProps {
  lection: ILectionForm;
  onEdit: (lection: ILectionForm) => void;
  onDelete: (lection: ILectionForm) => void;
}

const LectionCard: React.FC<StudentCardProps> = ({
  lection: lection,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <Card
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      sx={{ pb: "2px", maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            container
            justifyContent="center"
            alignItems="center"
          >
            <PersonIcon fontSize="large" />
          </Grid>
          <Grid
            item
            xs={4}
            container
            direction="column"
            justifyContent="center"
          >
            <Box textAlign="center">ID: {lection.id}</Box>
            <Box textAlign="center">
              {lection.nombre} {lection.apellido}{" "}
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            {showActions ? (
              <>
                <IconButton color="primary" onClick={() => onEdit(lection)}>
                  <EditIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(lection)}>
                  <DeleteIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </>
            ) : (
              <ArrowForwardIosIcon fontSize="large" />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default LectionCard;
