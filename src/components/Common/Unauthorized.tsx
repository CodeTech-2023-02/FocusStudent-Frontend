import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Unauthorized: React.FC = () => {
  return (
    <Container>
      <Box textAlign="center" mt={10}>
        <Typography variant="h2" gutterBottom>
          403 - Unauthorized
        </Typography>
        <Typography variant="h6">
          Usted no tiene permisos para acceder a esta página.
        </Typography>
      </Box>
    </Container>
  );
};

export default Unauthorized;
