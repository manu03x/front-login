import React from 'react';
import { Typography, Container, Paper } from '@mui/material';

const Inicio = () => {
    const paperStyle = {
        padding: '20px',
        marginTop: '50px',
        textAlign: 'center'
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={paperStyle}>
                <Typography variant="h4" gutterBottom>
                    ¡Bienvenido al Sistema de Administración!
                </Typography>
                <Typography variant="body1" paragraph>
                    Este sistema te permite administrar usuarios y realizar tareas de gestión de manera eficiente.
                </Typography>
                <Typography variant="body1" paragraph>
                    Por favor, inicia sesión con tus credenciales para acceder a tu cuenta.
                </Typography>
            </Paper>
        </Container>
    );
};

export default Inicio;
