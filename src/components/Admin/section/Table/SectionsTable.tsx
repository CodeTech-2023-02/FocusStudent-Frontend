import React, { useState } from 'react';
import { IconButton, MenuItem, Select, TableCell, TableRow } from '@mui/material';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Table } from '../../../../abstracts/Table/Table';

interface Entry {
    courseId: number;
    sectionId: number;
    teacherId: number;
}

const schema = yup.object().shape({
    courseId: yup.number().min(1).required(),
    sectionId: yup.number().min(1).required(),
    teacherId: yup.number().min(1).required(),
});

export const SectionsTable: React.FC = () => {
    const [data, setData] = useState<Entry[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { control, getValues, reset, formState: { } } = useForm<Entry>({
        resolver: yupResolver(schema),
    });

    const handleAdd = () => {
        const values = getValues();
    
        if (values.courseId && values.sectionId && values.teacherId) {
            setData(prevData => [...prevData, values]);
            reset();
        }
    };
    

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

    return (
        <>
            <Table
                cells={[
                    { id: 'course', label: 'Curso' },
                    { id: 'section', label: 'Seccion' },
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
                    {['courseId', 'sectionId', 'teacherId'].map(name => (
                        <TableCell key={name}>
                            <Controller
                                name={name as keyof Entry}
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} fullWidth>
                                        <MenuItem value={0}>Seleccione</MenuItem>
                                        <MenuItem value={1}>Option 1</MenuItem>
                                        <MenuItem value={2}>Option 2</MenuItem>
                                    </Select>
                                )}
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
                        {['courseId', 'sectionId', 'teacherId'].map(name => (
                            <TableCell key={name}>
                                {editingIndex === index ? (
                                    <Select
                                        fullWidth
                                        value={entry[name as keyof Entry]}
                                        onChange={(e) => {
                                            const newData = [...data];
                                            newData[index][name as keyof Entry] = Number(e.target.value);
                                            setData(newData);
                                        }}
                                    >
                                        <MenuItem value={0}>Seleccione</MenuItem>
                                        <MenuItem value={1}>Option 1</MenuItem>
                                        <MenuItem value={2}>Option 2</MenuItem>
                                    </Select>
                                ) : (
                                    entry[name as keyof Entry]
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
