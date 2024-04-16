import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, IconButton, Snackbar } from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

axios.defaults.withCredentials = true;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://login-mern-77k1.onrender.com/api/products');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        // Verifica si el producto ya está en el carrito
        const existingProduct = cart.find(item => item._id === product._id);
        if (existingProduct) {
            // Si el producto ya está en el carrito, aumenta la cantidad
            setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            // Si el producto no está en el carrito, añádelo con cantidad 1
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleRemoveFromCart = (productId) => {
        // Filtra los productos del carrito para quitar el producto con el ID proporcionado
        const updatedCart = cart.filter(item => item._id !== productId);
        setCart(updatedCart);
    };

    const handleBuy = async () => {
        try {
            const response = await axios.post('https://login-mern-77k1.onrender.com/api/products/buy', { cart });
            console.log('Compra exitosa:', response.data);
            // Vaciar el carrito después de la compra exitosa
            setCart([]);
            // Mostrar el mensaje de compra exitosa
            setSnackbarMessage('¡Compra exitosa!');
            setSnackbarOpen(true);
            fetchProducts()
        } catch (error) {
            console.error('Error al comprar:', error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Lista de Productos
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="product table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {products
                        .filter(product => product.stock > 0) // Filtra los productos con stock mayor que 0
                        .map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleAddToCart(product)}>
                                        <AddIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h4" gutterBottom style={{ marginTop: '50px' }}>
                Carrito de Compras
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="cart table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                    <IconButton color="secondary" onClick={() => handleRemoveFromCart(product._id)}>
                                        <RemoveIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={handleBuy} style={{ marginTop: '20px' }}>
                Comprar
            </Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default Products;
