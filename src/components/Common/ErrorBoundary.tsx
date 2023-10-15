import { Box, Typography, Container, styled } from '@mui/material';
import { Component, ErrorInfo, memo } from 'react';

interface State {
    hasError: boolean;
}

const StyledImage = styled(
    memo((props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />)
)({
    maxWidth: "80%",
    height: "auto",
    display: "block",
    margin: "auto",
});

class ErrorBoundary extends Component<{}, State> {
    state: State = {
        hasError: false
    };

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    style={{

                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white"
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            variant="h4"
                            color="black"
                            gutterBottom
                            style={{ fontWeight: "bold" }}
                        >
                            Ocurrió un error inesperado.
                        </Typography>
                        <Typography color="black">
                            Por favor, recarga la página o contacta al soporte si el problema persiste.
                        </Typography>
                    </Container>
                    <Box textAlign="center" pt={20}>
                        <StyledImage src="./assets/error.svg" alt="Login illustration" />
                    </Box>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
