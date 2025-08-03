import React, { useState, useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardMedia, CardContent,
    CardActions, Button, CircularProgress, Alert, Modal, Box, IconButton, Drawer,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Badge, Divider, Rating,
    Chip, Paper
} from '@mui/material';
import { ShoppingCart, Add, Remove, Delete, Search, Menu } from '@mui/icons-material';
import { useCart } from './main';

// Helper Functions
const USD_TO_INR_RATE = 84;
const formatCurrency = (priceInUSD) => `₹${(priceInUSD * USD_TO_INR_RATE).toFixed(2)}`;

// Modern Navbar Component
const ModernNavbar = ({ cartItemCount, onCartOpen }) => {
    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                backgroundColor: '#1a237e',
                borderBottom: '1px solid #e0e0e0'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
                    <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'white',
                            fontSize: { xs: '1.2rem', sm: '1.5rem' }
                        }}
                    >
                        🛍️ E-Commerce Store
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            color="inherit" 
                            onClick={onCartOpen}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <Badge badgeContent={cartItemCount} color="error">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

// Enhanced ProductCard Component
const ProductCard = ({ product, onViewDetails }) => {
    const { dispatch } = useCart();
    
    const handleAddToCart = () => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    },
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        sx={{ 
                            height: 280, 
                            objectFit: 'contain', 
                            p: 2,
                            backgroundColor: '#fafafa'
                        }}
                        image={product.image}
                        alt={product.title}
                    />
                    <Chip
                        label={product.category}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: 'rgba(26, 35, 126, 0.9)',
                            color: 'white',
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h2" 
                        sx={{
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            display: '-webkit-box',
                            WebkitLineClamp: '2', 
                            WebkitBoxOrient: 'vertical',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            lineHeight: 1.3,
                            mb: 1
                        }}
                    >
                        {product.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating 
                            name="read-only" 
                            value={product.rating.rate} 
                            readOnly 
                            precision={0.5}
                            size="small"
                        />
                        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            ({product.rating.count})
                        </Typography>
                    </Box>
                    
                    <Typography 
                        variant="h5" 
                        color="primary"
                        sx={{ 
                            fontWeight: 700,
                            fontSize: '1.1rem'
                        }}
                    >
                        {formatCurrency(product.price)}
                    </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => onViewDetails(product)}
                        sx={{ 
                            flex: 1,
                            borderColor: '#1a237e',
                            color: '#1a237e',
                            '&:hover': {
                                borderColor: '#0d47a1',
                                backgroundColor: 'rgba(26, 35, 126, 0.04)'
                            }
                        }}
                    >
                        View Details
                    </Button>
                    <Button 
                        size="small" 
                        variant="contained" 
                        onClick={handleAddToCart}
                        sx={{ 
                            flex: 1,
                            backgroundColor: '#1a237e',
                            '&:hover': {
                                backgroundColor: '#0d47a1'
                            }
                        }}
                    >
                        Add to Cart
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

// Enhanced ProductDetailModal Component
const ProductDetailModal = ({ product, open, onClose }) => {
    const { dispatch } = useCart();
    if (!product) return null;

    const handleAddToCart = () => {
        dispatch({ type: 'ADD_ITEM', payload: product });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '90%', 
                maxWidth: 900, 
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                borderRadius: 2,
                p: 0,
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3 }}>
                            <img 
                                src={product.image} 
                                alt={product.title} 
                                style={{ 
                                    width: '100%', 
                                    maxHeight: 400, 
                                    objectFit: 'contain' 
                                }} 
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3 }}>
                            <Chip 
                                label={product.category} 
                                color="primary" 
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                                {product.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating name="read-only" value={product.rating.rate} readOnly precision={0.5} />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    {product.rating.rate} ({product.rating.count} reviews)
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                                {product.description}
                            </Typography>
                            <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, color: '#1a237e' }}>
                                {formatCurrency(product.price)}
                            </Typography>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={handleAddToCart}
                                sx={{ 
                                    backgroundColor: '#1a237e',
                                    '&:hover': {
                                        backgroundColor: '#0d47a1'
                                    }
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

// Enhanced CartDrawer Component
const CartDrawer = ({ open, onClose }) => {
    const { cart, dispatch } = useCart();

    const handleUpdateQuantity = (id, quantity) => {
        if (quantity > 0) {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        }
    };

    const handleRemoveItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Drawer 
            anchor="right" 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 } }
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#1a237e', 
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6">Shopping Cart</Typography>
                    <IconButton color="inherit" onClick={onClose}>
                        <Delete />
                    </IconButton>
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {cart.length === 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            textAlign: 'center'
                        }}>
                            <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Add some products to get started!
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {cart.map(item => (
                                <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar 
                                            src={item.image} 
                                            variant="square" 
                                            sx={{ width: 60, height: 60, mr: 2 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(item.price)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Remove />
                                            </IconButton>
                                            <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Add />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </List>
                    )}
                </Box>
                
                {cart.length > 0 && (
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                {formatCurrency(cartTotal)}
                            </Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                                backgroundColor: '#1a237e',
                                '&:hover': {
                                    backgroundColor: '#0d47a1'
                                }
                            }}
                        >
                            Checkout
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

// Enhanced ProductList Component
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://fakestoreapi.com/products');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleViewDetails = (product) => setSelectedProduct(product);
    const handleCloseModal = () => setSelectedProduct(null);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Grid container spacing={3}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
                ))}
            </Grid>
            <ProductDetailModal product={selectedProduct} open={!!selectedProduct} onClose={handleCloseModal} />
        </>
    );
};

// Main App Component
function App() {
    const [cartOpen, setCartOpen] = useState(false);
    const { cart } = useCart();
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <ModernNavbar cartItemCount={cartItemCount} onCartOpen={() => setCartOpen(true)} />
            
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ 
                        fontWeight: 700, 
                        color: '#1a237e',
                        mb: 1
                    }}>
                        Our Products
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Discover amazing products at great prices
                    </Typography>
                </Box>
                
                <ProductList />
            </Container>
            
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </Box>
    );
}

export default App;