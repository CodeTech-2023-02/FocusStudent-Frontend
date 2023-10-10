
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField, Button, Grid, Box
} from '@mui/material';
import { SimpleDialog } from '../../../../abstracts/Modals/SimpleDialog';

import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import { IStudentForm } from '../IStudentForm';

interface StudentFormDialogProps {
    open: boolean;
    onClose: () => void;
    defaultValues?: IStudentForm;
    onSubmit: (data: IStudentForm) => void;
    mode: 'create' | 'edit';
}

const courseSchema = yup.object().shape({
    id: yup.string().required('Id es requerido'),
    nombre: yup.string().required('Nombre es requerido'),
    apellido: yup.string().required('Apellido es requerida'),
    telefono: yup.string().typeError('Debe ser un número').required('Telefono es requerido'),
    correo: yup.string().required('Correo es requerido'),
    dni: yup.string().required('DNI es requerido'),
    direccion: yup.string().required('Dirección es requerida'),
});

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({ open, onClose, defaultValues, onSubmit, mode  }) => {
    const initialValues = defaultValues || {
        id: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        dni: '',
        direccion: '',
    };

    const { handleSubmit, control, reset, formState: { errors } } = useForm<IStudentForm>({
        defaultValues: initialValues,
        resolver: yupResolver(courseSchema)
    });

    React.useEffect(() => {
        if (mode === 'edit' && defaultValues) {
            reset(defaultValues);
        } else {
            reset({
                id: '',
                nombre: '',
                apellido: '',
                telefono: '',
                correo: '',
                dni: '',
                direccion: '',
            });
        }
    }, [mode, defaultValues, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <SimpleDialog open={open} handleOnClose={handleClose} title="Estudiante" width={600} minHeight={500} height={500}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Controller
                            name="id"
                            control={control}
                            render={({ field }) => <TextField {...field} error={!!errors.id} helperText={errors.id?.message} label="Id" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="nombre"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Nombre" fullWidth
                            helperText={errors.nombre?.message} error={!!errors.nombre} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="apellido"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Apellido" fullWidth
                            helperText={errors.apellido?.message} error={!!errors.apellido} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="telefono"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Teléfono" fullWidth
                            helperText={errors.telefono?.message} error={!!errors.telefono} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="correo"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Correo" fullWidth
                            helperText={errors.correo?.message} error={!!errors.correo} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="dni"
                            control={control}
                            render={({ field }) => <TextField {...field} label="DNI" fullWidth
                            helperText={errors.dni?.message} error={!!errors.dni} />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="direccion"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Dirección" fullWidth
                            helperText={errors.direccion?.message} error={!!errors.direccion} />}
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
