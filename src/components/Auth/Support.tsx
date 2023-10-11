import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=51926711737&text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <Box m={2}>
      <Grid container spacing={4} style={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item p={2}>
            <Typography variant="h1" gutterBottom pb={2}>
              Soporte
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              type="text"
              label="Mensaje para soporte"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleSendMessage}
            >
              Enviar Mensaje
            </Button>
            <Button
              
              variant="text"
              style={{ marginTop: "20px" , marginLeft: "20px"}}
              onClick={() => navigate("/login")}
            >
              Volver al login
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Support;
