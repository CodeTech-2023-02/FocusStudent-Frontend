import React from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { DASHBOARD } from "../../constants/routes";

type NotFoundProps = {
  role?: "TEACHER" | "STUDENT" | "ADMIN";
};

const NotFound: React.FC<NotFoundProps> = ({ role }) => {
  const dashboardPath = role === "TEACHER" ? DASHBOARD : DASHBOARD;

  return (
    <Container>
      <Box textAlign="center" mt={10}>
        <Typography variant="h2" gutterBottom pb={2}>
          404 - La página que estás buscando no existe
        </Typography>
        <Button variant="outlined" component={Link} to={dashboardPath}>
          Regresar
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
