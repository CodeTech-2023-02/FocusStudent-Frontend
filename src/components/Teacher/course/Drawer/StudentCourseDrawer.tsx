import { Box, Button, Card, CardActions, CardContent, CircularProgress, Drawer, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GetLessons } from "../../../../domain/lesson/constants/interfaces";
import { useGetLessonsByCourseSection } from "../../../../domain/lesson/services/lesson-service";
import { ICourseForm } from "../ICourseForm";

interface StudentCourseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCourse: ICourseForm;
}

const StudentCourseDrawer: React.FC<StudentCourseDrawerProps> = ({
    isOpen,
    onClose,
    selectedCourse,
}) => {
    const navigate = useNavigate();
    const [courses, setCourses] = React.useState<GetLessons[]>([]);
    const [loading, setLoading] = React.useState(true);

    const lessonsByCourse = useGetLessonsByCourseSection()

    const fetchCourses = () => {
        setLoading(true);
        lessonsByCourse.mutate(selectedCourse.id, {
            onSuccess: (response) => {
                setCourses(response);
                setLoading(false);
            },
            onError: (error) => {
                console.error("Error al obtener los cursos:", error);
                setLoading(false);
            },
        });
    };

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const redirectTracking = (courseId: number) => {
        navigate(`/tracking/${courseId}`);
    };

    

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <Box sx={{ width: 400, overflow: 'auto' }} p={4}>
                <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 2 }}>
                    Detalle del curso {selectedCourse.name}
                </Typography>
                <Grid container spacing={2} pt={4}>
                {loading ? (
            <CircularProgress />
          ) : (
                    courses.map((course, index) => (
                        <Grid item xs={12} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" component="div">{course.name}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => redirectTracking(course.id)} variant="contained" color="primary">
                                        Tracking
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )))}
                    
                </Grid>
            </Box>
        </Drawer>
    );
};

export default StudentCourseDrawer;
