import React, { useState } from "react";
import { Container, Typography, TextField, Button, Snackbar, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import '@fontsource/roboto';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [inputs, setInputs] = useState({
        name:"",
        email:"",
        password:"",
        confpass: ""
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const history = useNavigate();

    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputs.password !== inputs.confpass) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const res = await sendRequest();
            setSuccess(true);
            setTimeout(() => {
                history("/login");
            }, 2000);
        } catch (error) {
            setError("Error al registrar el usuario");
        }
    };

    const sendRequest = async () => {
        const res = await axios.post('http://localhost:5000/api/signup', {
            name: inputs.name,
            email: inputs.email,
            password: inputs.password
        });
        return res.data;
    }

    const handleClose = () => {
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
            <Container maxWidth="xs" style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Signup
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        onChange={handleChange}
                        name="name"
                        value={inputs.name}
                        label="Name"
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        onChange={handleChange}
                        name="email"
                        value={inputs.email}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        type="email"
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        onChange={handleChange}
                        name="password"
                        value={inputs.password}
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        onChange={handleChange}
                        name="confpass"
                        value={inputs.confpass}
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: '20px', backgroundColor: '#FFEB3B', color: '#000' }}
                    >
                        Signup
                    </Button>
                </form>
            </Container>
            <Snackbar
                open={error !== null}
                onClose={() => setError(null)}
                message={error}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                severity="error"
            />
            <Snackbar
                open={success}
                onClose={handleClose}
                message="Solicitud de registro enviada, espera a que el administrador autorize tu sesion"
                autoHideDuration={10000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                severity="success"
            />
        </ThemeProvider>
    );
}

export default Signup;
