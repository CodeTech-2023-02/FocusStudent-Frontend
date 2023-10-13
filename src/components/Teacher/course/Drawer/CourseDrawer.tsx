import React, { memo } from "react";
import { Box, Button, Drawer, Typography, styled } from "@mui/material";
import { ICourseForm } from "../ICourseForm";
import { useNavigate } from "react-router-dom";

interface CourseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: ICourseForm;
  idForLessons: number;
}

const StyledImage = styled(
  memo((props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />)
)({
  maxWidth: "80%",
  height: "auto",
  display: "block",
  margin: "auto",
});


const CourseDrawer: React.FC<CourseDrawerProps> = ({ isOpen, onClose, selectedCourse , idForLessons}) => {
  const navigate = useNavigate();

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} >
      <Box sx={{ width: 400 }} p={4}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Detalle del curso
        </Typography>
        <Box textAlign="center" pt={3}>
          <Typography variant="h5" fontWeight={2} pb={1}>Año: {selectedCourse.year}</Typography>
          <Typography variant="h5" fontWeight={2} pb={1}>Nombre: {selectedCourse.name}</Typography>
          <Typography variant="h5" fontWeight={2} pb={1}>Descripción: {selectedCourse.description}</Typography>
        </Box>
        <hr />
      </Box>
      <Box sx={{ width: 400 }} textAlign="center" >
        <Button onClick={() => navigate(`/lection/${idForLessons}`)}>
          Lecciones
        </Button>

      </Box>
      <Box sx={{ width: 400 }} textAlign="center" pt={20} >
        <StyledImage src="assets/leccion.svg" alt="Login illustration" />
      </Box>

    </Drawer>
  );
};

export default CourseDrawer;
