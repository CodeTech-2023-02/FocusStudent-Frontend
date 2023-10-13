import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Table } from "../../../../abstracts/Table/Table";
import { IGetAllResponse } from "../../../../domain/course/constants/interfaces";
import { useGetAllCourses } from "../../../../domain/course/services/course-service";
import { ITeacher } from "../../../../domain/teacher/constants/interfaces";
import { useGetAllTeachers } from "../../../../domain/teacher/services/teacher-service";
import {
  useCreateCourseSection,
  useDeleteCourseSection,
  useEditCourseSection,
  useGetAllCoursesSectionBySection,
} from "../../../../domain/course_section/services/course_section-service";
import { ISectionForm } from "../ISectionForm";
import { from } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  ConfirmationModal,
  OkModal,
} from "../../../../abstracts/Modals/Modals";
import useModal from "../../../../hooks/useModal";

interface Entry {
  courseId: number;
  teacherId: number;
  id?: number;
}

const schema = yup.object().shape({
  courseId: yup.number().min(1).required(),
  teacherId: yup.number().min(1).required(),
});

export const SectionsTable: React.FC<{ selectedSection?: ISectionForm }> = ({
  selectedSection,
}) => {
  const [data, setData] = useState<Entry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const {
    control,
    getValues,
    reset,
    setValue,
    formState: {},
  } = useForm<Entry>({
    resolver: yupResolver(schema),
  });

  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [courses, setCourses] = useState<IGetAllResponse[]>([]);
  const [refKey, setRefKey] = useState<number>(0);
  const confirmationDeleteModal = useModal();
  const successModal = useModal();

  const getAllTeachers = useGetAllTeachers();
  const getAllCourses = useGetAllCourses();
  const createCourseSection = useCreateCourseSection();
  const editCourseSection = useEditCourseSection();
  const deleteCourseSection = useDeleteCourseSection();
  const getAllCoursesSectionBySection = useGetAllCoursesSectionBySection();

  React.useEffect(() => {
    if (selectedSection?.id) {
      getAllCoursesSectionBySection.mutate(selectedSection.id, {
        onSuccess: (fetchedData) => {
          const transformedData = fetchedData.map((item) => ({
            courseId: item.course.id,
            teacherId: item.teacher.id,
            id: item.id,
          }));
          setData(transformedData);
        },
        onError: (error) => {
          console.error("Error al cargar datos iniciales:", error);
        },
      });
    }
  }, [selectedSection]);

  React.useEffect(() => {
    getAllTeachers.mutate();
    getAllCourses.mutate();
  }, []);

  React.useEffect(() => {
    if (getAllTeachers.data) {
      setTeachers(getAllTeachers.data);
    }
    if (getAllCourses.data) {
      setCourses(getAllCourses.data);
    }
  }, [getAllTeachers.data, getAllCourses.data]);

  const deleteEntry = (index: number) => {
    if (data[index].id !== undefined) {
      const courseSectionIdToDelete = [data[index].id as number];

      confirmationDeleteModal.openModal(
        () => {
          confirmationDeleteModal.startProcessing();
          from(deleteCourseSection.mutateAsync(courseSectionIdToDelete))
            .pipe(
              switchMap(() =>
                from(
                  getAllCoursesSectionBySection.mutateAsync(
                    selectedSection?.id || 0
                  )
                )
              )
            )
            .subscribe(
              (fetchedData) => {
                const transformedData = fetchedData.map((item) => ({
                  courseId: item.course.id,
                  teacherId: item.teacher.id,
                  id: item.id,
                }));
                setData(transformedData);
                confirmationDeleteModal.stopProcessing();
                confirmationDeleteModal.closeModal();
                successModal.openModal(
                  undefined,
                  undefined,
                  "Operación exitosa",
                  "Sección de dicho curso eliminada con éxito"
                );
              },
              (error) => {
                console.error("Error al eliminar una entrada:", error);
                confirmationDeleteModal.stopProcessing();
                confirmationDeleteModal.closeModal();
                successModal.openModal(
                  undefined,
                  undefined,
                  "Ocurrió un error",
                  "No se pudo eliminar la sección de dicho curso"
                );
              }
            );
        },
        undefined,
        "Eliminar ",
        "¿Estás seguro de que deseas eliminar esta sección de dicho curso?"
      );
    } else {
      console.error("El ID no está definido para el índice:", index);
    }
  };

  const handleEdit = (index: number) => {
    const values = getValues();
    const courseSectionToUpdate = {
      courseId: values.courseId,
      teacherId: values.teacherId,
      sectionId: selectedSection?.id || 0,
      courseSectionId: data[index].id,
    };

    from(editCourseSection.mutateAsync({ data: [courseSectionToUpdate] }))
      .pipe(
        switchMap(() =>
          from(
            getAllCoursesSectionBySection.mutateAsync(selectedSection?.id || 0)
          )
        )
      )
      .subscribe(
        (fetchedData) => {
          const transformedData = fetchedData.map((item) => ({
            courseId: item.course.id,
            teacherId: item.teacher.id,
            id: item.id,
          }));
          setData(transformedData);
          setEditingIndex(null);
          successModal.openModal(
            undefined,
            undefined,
            "Operación exitosa",
            "Sección de dicho curso editada con éxito"
          );
        },
        (error) => {
          console.error("Error al editar una entrada:", error);
          successModal.openModal(
            undefined,
            undefined,
            "Ocurrió un error",
            "No se pudo editar la sección de dicho curso"
          );
        }
      );
  };

  const handleAdd = () => {
    const values = getValues();

    if (values.courseId && values.teacherId) {
      const newCourseSection = {
        courseId: values.courseId,
        teacherId: values.teacherId,
        sectionId: selectedSection?.id || 0,
      };

      from(createCourseSection.mutateAsync([newCourseSection]))
        .pipe(
          switchMap(() =>
            from(
              getAllCoursesSectionBySection.mutateAsync(
                selectedSection?.id || 0
              )
            )
          )
        )
        .subscribe(
          (fetchedData) => {
            const transformedData = fetchedData.map((item) => ({
              courseId: item.course.id,
              teacherId: item.teacher.id,
              id: item.id,
            }));
            setData(transformedData);
            reset();
            setRefKey((prevKey) => prevKey + 1);
            successModal.openModal(
              undefined,
              undefined,
              "Operación exitosa",
              "Sección de dicho curso agregada con éxito"
            );
          },
          (error) => {
            console.error("Error al agregar una entrada:", error);
            successModal.openModal(
              undefined,
              undefined,
              "Ocurrió un error",
              "No se pudo agregar la sección de dicho curso"
            );
          }
        );
    }
  };

  const startEditing = (index: number) => {
    reset(data[index]);
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const getCourseNameById = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "";
  };

  const getTeacherNameById = (teacherId: number) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.user.names : "";
  };

  return (
    <>
      <Table
        cells={[
          { id: "course", label: "Curso" },
          { id: "teacher", label: "Profesor" },
          { id: "action", label: "Acción" },
        ]}
        isEmpty={data.length === 0}
        isLoading={false}
        isError={false}
        withAction={false}
        withPagination={false}
      >
        <TableRow key={refKey}>
          {["courseId", "teacherId"].map((name) => (
            <TableCell key={name}>
              <Controller
                name={name as keyof Entry}
                control={control}
                render={({ field }) => {
                  const [localValues, setLocalValues] = useState<{
                    [key: string]: { id: number; name: string } | null;
                  }>({
                    courseId: null,
                    teacherId: null,
                  });
                  return (
                    <Autocomplete
                      value={localValues[name]}
                      fullWidth
                      options={
                        name === "courseId"
                          ? courses.map((course) => ({
                              id: course.id,
                              name: course.name,
                            }))
                          : teachers.map((teacher) => ({
                              id: teacher.id,
                              name: teacher.user.names,
                            }))
                      }
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={name === "courseId" ? "Curso" : "Profesor"}
                          fullWidth
                        />
                      )}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.id || "");
                        setLocalValues((prev) => ({
                          ...prev,
                          [name]: newValue,
                        }));
                      }}
                    />
                  );
                }}
              />
            </TableCell>
          ))}
          <TableCell>
            <IconButton onClick={handleAdd}>
              <AddCircleIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        {data.map((entry, index) => (
          <TableRow key={index}>
            {["courseId", "teacherId"].map((name) => (
              <TableCell key={name}>
                {editingIndex === index ? (
                  <Autocomplete
                    value={
                      name === "courseId"
                        ? courses
                            .map((course) => ({
                              id: course.id,
                              name: course.name,
                            }))
                            .find((course) => course.id === entry.courseId) ||
                          null
                        : teachers
                            .map((teacher) => ({
                              id: teacher.id,
                              name: teacher.user.names,
                            }))
                            .find(
                              (teacher) => teacher.id === entry.teacherId
                            ) || null
                    }
                    fullWidth
                    options={
                      name === "courseId"
                        ? courses.map((course) => ({
                            id: course.id,
                            name: course.name,
                          }))
                        : teachers.map((teacher) => ({
                            id: teacher.id,
                            name: teacher.user.names,
                          }))
                    }
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={name === "courseId" ? "Curso" : "Profesor"}
                        fullWidth
                      />
                    )}
                    onChange={(_, newValue) => {
                      const newData = [...data];
                      newData[index][name as keyof Entry] = newValue?.id || 0;
                      setData(newData);
                      setValue(name as keyof Entry, newValue?.id || 0);
                    }}
                  />
                ) : name === "courseId" ? (
                  getCourseNameById(entry.courseId)
                ) : (
                  getTeacherNameById(entry.teacherId)
                )}
              </TableCell>
            ))}
            <TableCell>
              {editingIndex === index ? (
                <>
                  <IconButton onClick={() => handleEdit(index)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={cancelEditing}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton onClick={() => startEditing(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteEntry(index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </Table>
      <ConfirmationModal
        height={230}
        title={confirmationDeleteModal.modalTitle}
        handleOnConfirm={confirmationDeleteModal.handleOnConfirm}
        open={confirmationDeleteModal.isOpen}
        handleOnClose={confirmationDeleteModal.closeModal}
        message={confirmationDeleteModal.message}
        isProcessing={confirmationDeleteModal.isProcessing}
      ></ConfirmationModal>
      <OkModal
        height={230}
        open={successModal.isOpen}
        handleOnClose={successModal.closeModal}
        message={successModal.message}
      >
        {successModal.modalTitle}
      </OkModal>
    </>
  );
};
