import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PasswordIcon from '@mui/icons-material/Password';
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Card, CardContent, Grid, IconButton } from "@mui/material";
import React from "react";
import { IUsersForm } from "../interfaces";

interface StudentCardProps {
  user: IUsersForm;
  onEdit: (course: IUsersForm) => void;
  changePassword: (course: IUsersForm) => void;
}

const UsersCard: React.FC<StudentCardProps> = ({
  user: course,
  onEdit,
  changePassword,
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
            <Box textAlign="center">ID: {course.id}</Box>
            <Box textAlign="center">
              {course.names} {course.lastNames}{" "}
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
                <IconButton color="primary" onClick={() => onEdit(course)}>
                  <EditIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton color="info" onClick={() => changePassword(course)}>
                  <PasswordIcon sx={{ fontSize: 22 }} />
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
export default UsersCard;
