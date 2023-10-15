import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ConfirmationModal } from "../../../abstracts/Modals/Modals";
import { useGetAllUsersByLastNamesAndRole } from "../../../domain/auth/services/auth-service";
import useModal from "../../../hooks/useModal";
import UsersCard from "./Card/UsersCard";
import { UsersFormDialog } from "./Dialog/UsersFormDialog";
import { IUsersForm } from "./interfaces";
import { useGetAllTeachers } from "../../../domain/teacher/services/teacher-service";
import { ITeacher } from "../../../domain/teacher/constants/interfaces";
import { IGetUsers } from "../../../domain/auth/constants/interfaces";
import { PasswordChangeDialog } from "./Dialog/PasswordChangeDialog";

const mapTeacherToUsersForm = (teacher: ITeacher): IUsersForm => {
  return {
    id: teacher.user.id,
    names: teacher.user.names,
    lastNames: teacher.user.lastNames,
    phoneNumber: teacher.user.phoneNumber,
    email: teacher.user.email,
    dni: teacher.user.dni,
    address: teacher.user.address,
    password: "",
  };
};

const mapDataToUsersForm = (data: IGetUsers): IUsersForm => {
  return {
    id: data.id,
    names: data.names,
    lastNames: data.lastNames,
    phoneNumber: data.phoneNumber,
    email: data.email,
    dni: data.dni,
    address: data.address,
    password: "",
  };
};

const UsersComponent: React.FC<{ userType: "students" | "teachers" }> = ({
  userType,
}) => {
  const title = userType === "students" ? "Estudiantes" : "Profesores";
  const usuario = userType === "students" ? "estudiante" : "profesor";
  const getTeachers = useGetAllTeachers();

  const getAllUsersByLastNamesAndRoleMutation =
    useGetAllUsersByLastNamesAndRole();

  const confirmationDeleteModal = useModal();
  const [users, setUsers] = React.useState<IUsersForm[]>([]);

  const fetchUsersData = () => {
    if (userType === "teachers") {
      getTeachers.mutate();
    } else if (userType === "students") {
      //getStudents.mutate();
    }
  };

  const fetchAndMapUsers = React.useCallback(() => {
    if (userType === "teachers" && getTeachers.data) {
      const mappedUsers = getTeachers.data.map(mapTeacherToUsersForm);
      setUsers(mappedUsers);
    } else if (userType === "students") {
      //  && getStudents.data
      //const mappedUsers = getStudents.data.map(mapStudentToUsersForm); // Assuming you create a similar function to map students.
      //setUsers(mappedUsers);
    }
  }, [getTeachers.data, userType]); // getStudents.data,

  React.useEffect(() => {
    fetchUsersData();
  }, [userType]);

  React.useEffect(() => {
    fetchAndMapUsers();
  }, [fetchAndMapUsers]);

  React.useEffect(() => {
    if (getAllUsersByLastNamesAndRoleMutation.data) {
      const mappedData =
        getAllUsersByLastNamesAndRoleMutation.data.map(mapDataToUsersForm);
      setUsers(mappedData);
    }
  }, [getAllUsersByLastNamesAndRoleMutation.data]);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [selectedUserForPasswordChange, setSelectedUserForPasswordChange] =
    React.useState<IUsersForm | null>(null);

  const [selectedCourse, setSelectedCourse] = React.useState<
    IUsersForm | undefined
  >();

  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">(
    "create"
  );

  const handleCreateCourse = () => {
    setDialogMode("create");
    handleOpenDialog();
  };

  const handleEditCourse = (course: IUsersForm) => {
    setDialogMode("edit");
    handleOpenDialog(course);
  };

  const handleOpenDialog = (course?: IUsersForm) => {
    setSelectedCourse(course || undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(undefined);
  };

  const handlePasswordChangeClick = (user: IUsersForm) => {
    setSelectedUserForPasswordChange(user);
    setIsPasswordModalOpen(true);
  };

  const handleSubmitCourse = (data: IUsersForm) => {
    console.log(data);
    handleCloseDialog();
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (value.trimStart() !== value) {
      return;
    }
    if (value === "") {
      fetchUsersData();
      return;
    }
    if (value.length % 3 === 0) {
      getAllUsersByLastNamesAndRoleMutation.mutate({
        lastNames: value,
        role: userType.toUpperCase() === "TEACHERS" ? "TEACHER" : "STUDENT",
      });
    }
  };

  return (
    <div>
      <Box p={4}>
        <h1>{title}</h1>
        <Grid container spacing={2} pt={2}>
          <Grid item xs={12} sm={6} md={9}>
            <TextField
              label="Buscar por apellido"
              onChange={handleSearchInputChange}
              inputProps={{ autocomplete: "off" }}
              fullWidth
              style={{ height: 50 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              style={{ height: 50 }}
              onClick={handleCreateCourse}
            >
              Crear nuevo {usuario}
              <AddCircleIcon style={{ margin: 4 }} />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} pt={4}>
          {users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <UsersCard
                user={user}
                onEdit={handleEditCourse}
                changePassword={() => handlePasswordChangeClick(user)}
              />
            </Grid>
          ))}
        </Grid>
        {selectedUserForPasswordChange && (
          <PasswordChangeDialog
            open={isPasswordModalOpen}
            onClose={() => {
              setIsPasswordModalOpen(false);
              setSelectedUserForPasswordChange(null);
            }}
            user={selectedUserForPasswordChange}
          />
        )}
        <UsersFormDialog
          userType={userType}
          key={selectedCourse ? selectedCourse.id : "new-course"}
          open={openDialog}
          mode={dialogMode}
          onClose={handleCloseDialog}
          defaultValues={selectedCourse}
          onSubmit={handleSubmitCourse}
          refetch={fetchUsersData}
        />
        <ConfirmationModal
          height={230}
          title={confirmationDeleteModal.modalTitle}
          handleOnConfirm={confirmationDeleteModal.handleOnConfirm}
          open={confirmationDeleteModal.isOpen}
          handleOnClose={confirmationDeleteModal.closeModal}
          message={confirmationDeleteModal.message}
          isProcessing={confirmationDeleteModal.isProcessing}
        ></ConfirmationModal>
      </Box>
    </div>
  );
};

export default UsersComponent;
