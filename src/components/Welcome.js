import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, ThemeProvider, CssBaseline, createTheme, TextField } from '@mui/material';
import '@fontsource/roboto';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from "../store";

axios.defaults.withCredentials = true;

let firstRender = true;

const Welcome = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });

    const sendRequest = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user', {
                withCredentials: true
            });
            const data = await res.data;
            if (!data) {
                history('/login');
                throw new Error("No se pudo obtener la información del usuario.");
            }
            return data;
        } catch (error) {
            console.log(error)
            history('/login');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await sendRequest();
                if (data) {
                    setUser(data.user);
                    console.log('Info del user')
                    dispatch(authActions.login());
                }
            } catch (error) {
                // Si ocurre un error, redirige a /login
                history('/login');
            }
        };

        const refresh = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/refresh', {
                    withCredentials: true
                });
                console.log(res.data); // Maneja los datos de la respuesta como desees
            } catch (error) {
                console.error(error); // Maneja el error de la solicitud
                handleLogout()
            }
        };

        if (firstRender) {
            fetchData();
            firstRender = false;
        }

        const interval = setInterval(() => {
            refresh();
        }, 1000 * 60 * .25);

        return () => clearInterval(interval);
    }, [dispatch, history]);

    const handleLogout = () => {
        // Lógica para cerrar sesión...
        history("/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = user._id; // Asigna el ID del usuario adecuado
        try {
            const res = await axios.put(`http://localhost:5000/api/user/${userId}`, user, {
                withCredentials: true
            });

        } catch (error) {
            console.error('Error updating user:', error);
        }
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
                    ¡Bienvenido!
                </Typography>
                <Typography variant="body1" paragraph>
                    Gracias por registrarte en nuestra aplicación.
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        name="name"
                        label="Nombre"
                        variant="outlined"
                        margin="normal"
                        value={user.name || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="email"
                        type="email"
                        label="Correo Electrónico"
                        variant="outlined"
                        margin="normal"
                        value={user.email || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="password"
                        type="password"
                        label="Contraseña"
                        variant="outlined"
                        margin="normal"
                        value={user.password || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                        Guardar Cambios
                    </Button>
                </form>
            </Container>
        </ThemeProvider>
    );
}

export default Welcome;
