import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, ThemeProvider, CssBaseline, createTheme, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from '@mui/material';
import '@fontsource/roboto';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from "../store";
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

import Products from './Products'

axios.defaults.withCredentials = true;

const Welcome = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false); 
    const [dialogOpen, setDialogOpen] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://login-mern-77k1.onrender.com/api/user', {
                    withCredentials: true
                });
                const data = await res.data;
                if (!data) {
                    history('/login');
                    throw new Error("No se pudo obtener la información del usuario.");
                }
                setUser(data.user);
                dispatch(authActions.login());
            } catch (error) {
                console.log(error);
                history('/login');
            }
        };

        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 1000 * 60 * 59);

        return () => clearInterval(interval);
    }, [dispatch, history]);

    const handleLogout = () => {
        dispatch(authActions.logout());
        history("/login");
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleEditSubmit = async () => {
        try {
            const res = await axios.put(`https://login-mern-77k1.onrender.com/api/user/${user._id}`, user, {
                withCredentials: true
            });
            if (res.status === 200) {
                setDialogOpen(false);
            } else {
                console.error('Error updating user:', res.data);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#c4a13f',
            },
            secondary: {
                main: '#FFEB3B',
            }
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm" style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <IconButton
                    onClick={handleOpenDialog}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                    }}
                >
                    <SettingsIcon />
                </IconButton>
            </Container>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} TransitionComponent={Slide}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditSubmit} style={{ width: '100%' }}>
                        <TextField
                            name="name"
                            label="Nombre"
                            variant="outlined"
                            margin="normal"
                            value={user ? user.name : ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="email"
                            type="email"
                            label="Correo Electrónico"
                            variant="outlined"
                            margin="normal"
                            value={user ? user.email : ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="password"
                            type="password"
                            label="Contraseña"
                            variant="outlined"
                            margin="normal"
                            value={user ? user.password : ''}
                            onChange={handleChange}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        <CloseIcon /> Cancelar
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary" variant="contained">
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>

        <Products />

        </ThemeProvider>
    );
}

export default Welcome;