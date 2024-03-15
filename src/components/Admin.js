import React, { useEffect, useState } from 'react';
import { Container, Typography, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import '@fontsource/roboto';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { adminActions } from "../store";

axios.defaults.withCredentials = true;

const Admin = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [adminData, setAdminData] = useState();

    const sendRequest = async() => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin', {
                withCredentials: true
            });
    
            const data = await res.data;
    
            if (!data) {
                throw new Error("No se pudo obtener la información del administrador.");
            }
    
            return data;
        } catch (error) {
            // Si ocurre un error, redirige a /login
            history('/login');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await sendRequest();
                if (data) {
                    setAdminData(data.admin);
                    dispatch(adminActions.loginAdmin());
                }
            } catch (error) {
                // Si ocurre un error, redirige a /login
                history('/login');
            }
        };

        fetchData();

        // Aquí puedes agregar la lógica de refresco de token si es necesario

    }, [dispatch, history]);

    const handleLogout = () => {
        // Lógica para cerrar sesión...
        dispatch(adminActions.logoutAdmin());
        history("/login");
    };

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#c4a13f', // Cambia el color principal según tus preferencias
            },
            secondary: {
                main: '#FFEB3B', // Cambia el color secundario a amarillo
            }
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm" style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    ¡Bienvenido Administrador!
                </Typography>
                <Typography variant="body1" paragraph>
                    Gracias por acceder al panel de administración.
                </Typography>
            </Container>
        </ThemeProvider>
    );
}

export default Admin;
