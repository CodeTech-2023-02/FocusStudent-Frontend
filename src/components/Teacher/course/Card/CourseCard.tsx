import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Card, CardContent, Grid, IconButton } from "@mui/material";
import React from "react";
import CourseDrawer from "../Drawer/CourseDrawer";
import { ICourseForm } from "../ICourseForm";

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
        <CourseDrawer isOpen={drawerOpen} selectedCourse={course} onClose={() => setDrawerOpen(false)} />
      )}
    </Card>
  );
};

export default CourseCard;
