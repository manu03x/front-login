import React, { useState } from "react";
import { Container, Typography, TextField, Button, ThemeProvider, CssBaseline, createTheme, Snackbar } from '@mui/material';
import '@fontsource/roboto';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux"
import { authActions , adminActions} from "../store";

axios.defaults.withCredentials = true
const Login = () => {
    const dispatch = useDispatch()
    
    const [inputs, setInputs] = useState({
        email:"",
        password:"",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const history = useNavigate();

    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!inputs.email || !inputs.password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const res = await sendRequest().then((data) => {
                dispatch(authActions.login())
                console.log(data)
                setSuccess(true);
                if(data.user.role == "admin") {
                    dispatch(adminActions.loginAdmin())
                    history('/admin')
                } else {
                    history('/user');
                }

                            // Aquí puedes manejar la lógica de inicio de sesión
            });;
        } catch (error) {
            setError('Credenciales incorrectas');
        }
    };

    const sendRequest = async () => {
        const res = await axios.post('https://login-mern-77k1.onrender.com/api/login', {
            email: inputs.email,
            password: inputs.password
        });
        return res.data;
    }

    const handleClose = () => {
        setError(null);
        setSuccess(false);
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
            <Container maxWidth="xs">
                <div style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '30px' }}>
                        <TextField
                            onChange={handleChange}
                            name="email"
                            value={inputs.email}
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            onChange={handleChange}
                            name="password"
                            value={inputs.password}
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            style={{ marginTop: '30px' }}
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </Container>
            <Snackbar
                open={error !== null}
                autoHideDuration={6000}
                onClose={handleClose}
                message={error}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                color="error"
            />
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Inicio de sesión exitoso"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                color="success"
            />
        </ThemeProvider>
    );
}

export default Login;
