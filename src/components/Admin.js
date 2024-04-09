import React, { useEffect, useState } from 'react';
import { Container, Typography, ThemeProvider, CssBaseline, createTheme, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Checkbox, MenuItem, FormControl, Select } from '@mui/material';

import '@fontsource/roboto';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { adminActions } from "../store";

axios.defaults.withCredentials = true;

let firstRender = true;

const Admin = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [user, setUser] = useState();
    const [users, setUsers] = useState([]);

    const sendRequest = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin', {
                withCredentials: true
            });
            const data = await res.data;
            if (!data) {
                throw new Error("No se pudo obtener la información del usuario.");
            }
            return data;
        } catch (error) {
            console.log(error)
            history('/login');
        }
    }

    const fetchData = async () => {
        try {
            const data = await sendRequest();
            if (data) {
                setUser(data.user);
                dispatch(adminActions.loginAdmin());
            }
        } catch (error) {
            handleLogout()
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

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (firstRender) {
            firstRender = false
            fetchData();
        }
        getUsers()
        const interval = setInterval(() => {
            refresh();
        }, 1000 * 60 * .25);
        return () => clearInterval(interval);
    }, [dispatch])

    const handleLogout = () => {
        dispatch(adminActions.logoutAdmin())
        history("/login");
    };

    const handleToggleStatus = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/admin/toggleStatus/${userId}`);
            if (response.status === 200) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, status: user.status === 1 ? 0 : 1 } : user
                ));
            } else {
                console.error('Error al cambiar el estado del usuario:', response.data.message);
            }
        } catch (error) {
            console.error('Error al cambiar el estado del usuario:', error);
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/admin/changeRole/${userId}`, { role });
            if (response.status === 200) {
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, role } : user
                ));
            } else {
                console.error('Error al cambiar el rol del usuario:', response.data.message);
            }
        } catch (error) {
            console.error('Error al cambiar el rol del usuario:', error);
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
            <Container maxWidth="md" style={{ marginTop: '50px' }}>
                <Typography variant="h4" gutterBottom>
                    Lista de Usuarios
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="user table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Rol</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={user.status === 1}
                                            onChange={() => handleToggleStatus(user._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                value={user.role || 'user'}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <MenuItem value="admin">Admin</MenuItem>
                                                <MenuItem value="user">User</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </ThemeProvider>
    );
}

export default Admin;
