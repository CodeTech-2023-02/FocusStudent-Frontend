import { Box, Card, CardContent, IconButton, Grid, Drawer } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { ICourseForm } from "../ICourseForm";
import CourseDrawer from "../Drawer/CourseDrawer";

interface CourseCardProps {
  course: ICourseForm;
  onEdit: (course: ICourseForm) => void;
  onDelete: (course: ICourseForm) => void;
  role: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  role
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
            {role === 'TEACHER' ? (
              <ArrowForwardIosIcon
                fontSize="large"
                onClick={() => setDrawerOpen(true)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              showActions ? (
                <>
                  <IconButton color="primary" onClick={() => onEdit(course)}>
                    <EditIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(course)}>
                    <DeleteIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                </>
              ) : (
                <ArrowForwardIosIcon
                  fontSize="large"
                  onMouseEnter={() => setShowActions(true)}

                  style={{ cursor: 'pointer' }}
                />
              )
            )}
          </Grid>
        </Grid>
      </CardContent>
      {role === 'TEACHER' && (
        <CourseDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </Card>
  );
};

export default CourseCard;
