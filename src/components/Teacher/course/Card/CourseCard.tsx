import { Box, Card, CardContent, IconButton, Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { ICourseForm } from "../ICourseForm";

interface CourseCardProps {
  course: ICourseForm;
  onEdit: (course: ICourseForm) => void;
  onDelete: (course: ICourseForm) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
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
            <PeopleIcon fontSize="large" />
          </Grid>
          <Grid
            item
            xs={4}
            container
            direction="column"
            justifyContent="center"
          >
            <Box textAlign="center">Año: {course.year}</Box>
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
export default CourseCard;
