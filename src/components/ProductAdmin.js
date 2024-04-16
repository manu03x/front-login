import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Products from './Products'

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    _id: '',
    name: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://login-mern-77k1.onrender.com/api/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (product) => {
    setEditedProduct(product);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('https://login-mern-77k1.onrender.com/api/products/add', editedProduct);
      fetchProducts();
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`https://login-mern-77k1.onrender.com/api/products/update/${editedProduct._id}`, editedProduct);
      fetchProducts();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`https://login-mern-77k1.onrender.com/api/products/delete/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Productos
      </Typography>
      <List>
        {loading ? (
          <CircularProgress />
        ) : (
          products.map((product) => (
            <ListItem key={product._id}>
              <ListItemAvatar>
                <Avatar>{product.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`Precio: ${product.price}, Stock: ${product.stock}`}
              />
              <IconButton onClick={() => handleOpenEditDialog(product)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteProduct(product._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
        Añadir Producto
      </Button>

      {/* Diálogo para añadir producto */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Añadir Producto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            name="name"
            value={editedProduct.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Precio"
            name="price"
            type="number"
            value={editedProduct.price}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            type="number"
            value={editedProduct.stock}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancelar</Button>
          <Button onClick={handleAddProduct} color="primary">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar producto */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            name="name"
            value={editedProduct.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Precio"
            name="price"
            type="number"
            value={editedProduct.price}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            type="number"
            value={editedProduct.stock}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleEditProduct} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export { ProductAdmin };
