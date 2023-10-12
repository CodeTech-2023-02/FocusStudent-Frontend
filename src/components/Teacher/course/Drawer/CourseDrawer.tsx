import React from "react";
import { Box, Drawer } from "@mui/material";

interface CourseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CourseDrawer: React.FC<CourseDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} >
        <Box sx={{ width: 250 }} p={4}>
        <h1>Hola</h1>
        </Box>
      
    </Drawer>
  );
};

export default CourseDrawer;
