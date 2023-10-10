
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField, Button, Grid, Box
} from '@mui/material';
import { SimpleDialog } from '../../../../abstracts/Modals/SimpleDialog';
import { ICourseForm } from '../ICourseForm';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

interface CourseFormDialogProps {
    open: boolean;
    onClose: () => void;
    defaultValues?: ICourseForm;
    onSubmit: (data: ICourseForm) => void;
    mode: 'create' | 'edit';
}

const courseSchema = yup.object().shape({
    id: yup.number().optional(),
    name: yup.string().required('Nombre de la clase es requerido'),
    year: yup.number()
    .typeError('Debe ser un número')
    .required('Año es requerido')
    .test('is-year', 'El año debe empezar con "20" y tener 4 dígitos', value => {
        return /^20\d{2}$/.test(String(value));
    }),
    description: yup.string().required('Descripción es requerida')
});

export const CourseFormDialog: React.FC<CourseFormDialogProps> = ({ open, onClose, defaultValues, onSubmit, mode  }) => {
    const initialValues = defaultValues || {
        id: 0,
        name: '',
        year: 20,
        description: ''
    };

    const { handleSubmit, control, reset, formState: { errors } } = useForm<ICourseForm>({
        defaultValues: initialValues,
        resolver: yupResolver(courseSchema)
    });

    React.useEffect(() => {
        if (mode === 'edit' && defaultValues) {
            reset(defaultValues);
        } else {
            reset({
                id: 0,
                name: '',
                year: 20,
                description: ''
            });
        }
    }, [mode, defaultValues, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <SimpleDialog open={open} handleOnClose={handleClose} title="Curso" width={600} minHeight={500} height={350}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    
                    <Grid item xs={6}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Nombre de la clase" 
                            helperText={errors.name?.message} error={!!errors.name}
                            fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="year"
                            control={control}
                            render={({ field }) => <TextField {...field} 
                            helperText={errors.year?.message} error={!!errors.year}
                            label="Año" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <TextField {...field} 
                            helperText={errors.description?.message} error={!!errors.description}
                            label="Descripción breve de la clase" fullWidth multiline />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="contained" color="primary" type="submit">Guardar</Button>
                            <Button variant="contained" onClick={handleClose}>Cancelar</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </SimpleDialog>
    );
};
