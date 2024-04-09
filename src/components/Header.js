import React, { useState } from "react";
import {useDispatch, useSelector } from "react-redux"
import { AppBar, Toolbar, Typography, Button, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import '@fontsource/roboto';
import axios from "axios";
import { authActions , adminActions} from "../store";

axios.defaults.withCredentials = true

const Header = () => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

    const [activeButton, setActiveButton] = useState(null);

    const logoutReq = async() => {
        const res = await axios.post("http://localhost:5000/api/logout", null , {
            withCredentials : true
        })

        if(res.status == 200) {
            return res
        }

        return new Error("Unable to logout")
    }

    const handleButtonClick = (button) => {
        if(button == 'logout') {
            logoutReq().then(() => {
                dispatch(authActions.logout())
                dispatch(adminActions.logoutAdmin())
            })
        }
        setActiveButton(button);
    };

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#3f51b5', // Cambia el color principal según tus preferencias
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
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Your App Name
                    </Typography>
                    {!isLoggedIn && <> <Button
                        color={activeButton === 'login' ? 'secondary' : 'inherit'}
                        onClick={() => handleButtonClick('login')}
                        component={Link} to="/login" // Agrega el atributo "component" y "to" para redireccionar a /login
                        sx={{ 
                            backgroundColor: activeButton === 'login' ? 'rgba(255, 235, 59, 0.3)' : 'inherit',
                            '&:hover': {
                                backgroundColor: activeButton === 'login' ? 'rgba(255, 235, 59, 0.5)' : 'inherit',
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        color={activeButton === 'signup' ? 'secondary' : 'inherit'}
                        onClick={() => handleButtonClick('signup')}
                        component={Link} to="/signup" // Agrega el atributo "component" y "to" para redireccionar a /signup
                        sx={{ 
                            backgroundColor: activeButton === 'signup' ? 'rgba(255, 235, 59, 0.3)' : 'inherit',
                            '&:hover': {
                                backgroundColor: activeButton === 'signup' ? 'rgba(255, 235, 59, 0.5)' : 'inherit',
                            }
                        }}
                    >
                        Sign up
                    </Button> </> }
                    { isLoggedIn && <Button
                        color={activeButton === 'logout' ? 'secondary' : 'inherit'}
                        onClick={() => handleButtonClick('logout')}
                        component={Link} to="/login" // Agrega el atributo "component" y "to" para redireccionar a /signup
                        sx={{ 
                            backgroundColor: activeButton === 'logout' ? 'rgba(255, 235, 59, 0.3)' : 'inherit',
                            '&:hover': {
                                backgroundColor: activeButton === 'logout' ? 'rgba(255, 235, 59, 0.5)' : 'inherit',
                            }
                        }}
                    >
                        Log Out
                    </Button>}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default Header;
