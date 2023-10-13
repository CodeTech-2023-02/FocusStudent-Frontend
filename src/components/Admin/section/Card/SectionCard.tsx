import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Card, CardContent, Grid, IconButton } from "@mui/material";
import React from "react";
import { ISectionForm } from "../ISectionForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
interface SectionCardProps {
  course: ISectionForm;
  config: (course: ISectionForm) => void;
  onEdit: (course: ISectionForm) => void;
  onDelete: (course: ISectionForm) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  course,
  config,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = React.useState(false);

  return (
    <Card
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
            <PeopleIcon fontSize="large" />
          </Grid>
          <Grid
            item
            xs={4}
            container
            direction="column"
            justifyContent="center"
          >
            <Box textAlign="center">Nombre: {course.name}</Box>
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
                <IconButton color="primary" onClick={() => onEdit(course)}>
                  <EditIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(course)}>
                  <DeleteIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton color="primary" onClick={() => config(course)}>
                  <SettingsIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </>
            ) : (
              <ArrowForwardIosIcon
                fontSize="large"
                onMouseEnter={() => setShowActions(true)}
                style={{ cursor: "pointer" }}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SectionCard;
