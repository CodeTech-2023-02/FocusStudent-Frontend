import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, IconButton, TableCell, TableRow, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import { Table } from '../../../../abstracts/Table/Table';
import { IGetAllResponse } from '../../../../domain/course/constants/interfaces';
import { useGetAllCourses } from '../../../../domain/course/services/course-service';
import { ITeacher } from '../../../../domain/teacher/constants/interfaces';
import { useGetAllTeachers } from '../../../../domain/teacher/services/teacher-service';

interface Entry {
    courseId: number;
    teacherId: number;
}

const schema = yup.object().shape({
    courseId: yup.number().min(1).required(),
    teacherId: yup.number().min(1).required(),
});

export const SectionsTable: React.FC = () => {
    const [data, setData] = useState<Entry[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { control, getValues, reset, formState: { } } = useForm<Entry>({
        resolver: yupResolver(schema),
    });
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [courses, setCourses] = useState<IGetAllResponse[]>([]);

    const getAllTeachers = useGetAllTeachers();
    const getAllCourses = useGetAllCourses();

    const handleAdd = () => {
        const values = getValues();

        if (values.courseId && values.teacherId) {
            setData(prevData => [...prevData, values]);
            reset();
        }
    };

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


    const handleEdit = (index: number) => {
        const values = getValues();
        const updatedData = [...data];
        updatedData[index] = values;
        setData(updatedData);
        setEditingIndex(null);
    };

    const startEditing = (index: number) => {
        reset(data[index]);
        setEditingIndex(index);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
    };

    const deleteEntry = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const getCourseNameById = (courseId: number) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.name : '';
    };

    const getTeacherNameById = (teacherId: number) => {
        const teacher = teachers.find(t => t.id === teacherId);
        return teacher ? teacher.user.names : '';
    };

    return (
        <>
            <Table
                cells={[
                    { id: 'course', label: 'Curso' },
                    { id: 'teacher', label: 'Profesor' },
                    { id: 'action', label: 'Acción' }
                ]}
                isEmpty={data.length === 0}
                isLoading={false}
                isError={false}
                withAction={false}
                withPagination={false}
            >
                <TableRow>
                    {['courseId', 'teacherId'].map(name => (
                        <TableCell key={name}>
                            <Controller
                                name={name as keyof Entry}
                                control={control}
                                render={({ field }) => {
                                    const [localValue, setLocalValue] = useState<{ id: number; name: string } | null>(null);

                                    return (
                                        <Autocomplete
                                            value={localValue}
                                            fullWidth
                                            options={
                                                name === 'courseId' ?
                                                    courses.map(course => ({ id: course.id, name: course.name })) :
                                                    teachers.map(teacher => ({ id: teacher.id, name: teacher.user.names }))
                                            }
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) =>
                                                <TextField {...params} label={name === 'courseId' ? 'Curso' : 'Profesor'} fullWidth />
                                            }
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue?.id || "");
                                                setLocalValue(newValue);
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
                        {['courseId', 'teacherId'].map(name => (
                            <TableCell key={name}>
                                {editingIndex === index ? (
                                    <Autocomplete
                                        value={
                                            name === 'courseId' ?
                                                courses.map(course => ({ id: course.id, name: course.name })).find(course => course.id === entry.courseId) || null :
                                                teachers.map(teacher => ({ id: teacher.id, name: teacher.user.names })).find(teacher => teacher.id === entry.teacherId) || null
                                        }
                                        fullWidth
                                        options={
                                            name === 'courseId' ?
                                                courses.map(course => ({ id: course.id, name: course.name })) :
                                                teachers.map(teacher => ({ id: teacher.id, name: teacher.user.names }))
                                        }
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) =>
                                            <TextField {...params} label={name === 'courseId' ? 'Curso' : 'Profesor'} fullWidth />
                                        }
                                        onChange={(_, newValue) => {
                                            const newData = [...data];
                                            newData[index][name as keyof Entry] = newValue?.id || 0;
                                            setData(newData);
                                        }}
                                    />
                                ) : (
                                    name === 'courseId' ? getCourseNameById(entry.courseId) : getTeacherNameById(entry.teacherId)
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
        </>
    );
};
