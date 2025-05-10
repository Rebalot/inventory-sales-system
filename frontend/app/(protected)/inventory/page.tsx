"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Skeleton,
  Alert,
} from "@mui/material"
import { Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import NavigationLayout from "@/components/navigation/NavigationLayout"

// Define product type
interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  sku: string
}

// Mock data for products
const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => {
  const stock = Math.floor(Math.random() * 100)
  let status: "In Stock" | "Low Stock" | "Out of Stock"

  if (stock === 0) {
    status = "Out of Stock"
  } else if (stock < 10) {
    status = "Low Stock"
  } else {
    status = "In Stock"
  }

  return {
    id: `PRD-${1000 + i}`,
    name: `Product ${i + 1}`,
    category: ["Electronics", "Clothing", "Home", "Office", "Food"][Math.floor(Math.random() * 5)],
    price: Number.parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    stock,
    status,
    sku: `SKU-${10000 + i}`,
  }
})

// Define form schema with Zod
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().positive({ message: "Price must be positive" }),
  stock: z.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
})

type ProductFormData = z.infer<typeof productSchema>

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      sku: "",
    },
  })

  useEffect(() => {
    // Simulate API call to fetch products
    const fetchProducts = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setProducts(mockProducts)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Reset form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
        sku: editingProduct.sku,
      })
    } else {
      reset({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        sku: "",
      })
    }
  }, [editingProduct, reset])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduct(null)
  }

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...data,
              status: data.stock === 0 ? "Out of Stock" : data.stock < 10 ? "Low Stock" : "In Stock",
            }
          : p,
      )
      setProducts(updatedProducts)
      setSuccessMessage("Product updated successfully!")
    } else {
      // Add new product
      const newProduct: Product = {
        id: `PRD-${1000 + products.length + 1}`,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        status: data.stock === 0 ? "Out of Stock" : data.stock < 10 ? "Low Stock" : "In Stock",
        sku: data.sku,
      }
      setProducts([...products, newProduct])
      setSuccessMessage("Product added successfully!")
    }

    // Close dialog and reset form
    handleCloseDialog()

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
      setSuccessMessage("Product deleted successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }
  }

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter ? product.category === categoryFilter : true
    const matchesStatus = statusFilter ? product.status === statusFilter : true

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get unique categories for filter
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your product inventory
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            aria-label="Search products by name or SKU"
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            aria-label="Add new product"
          >
            Add Product
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from(new Array(10)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" width={80} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton animation="wave" width={100} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        color={
                          product.status === "In Stock"
                            ? "success"
                            : product.status === "Low Stock"
                              ? "warning"
                              : "error"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(product)}
                        aria-label={`Edit ${product.name}`}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteProduct(product.id)}
                        aria-label={`Delete ${product.name}`}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12}}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      aria-label="Product Name"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select {...field} labelId="category-label" label="Category" aria-label="Product Category">
                        <MenuItem value="">Select Category</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Clothing">Clothing</MenuItem>
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Food">Food</MenuItem>
                      </Select>
                      {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SKU"
                      fullWidth
                      error={!!errors.sku}
                      helperText={errors.sku?.message}
                      aria-label="Product SKU"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Price"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      aria-label="Product Price"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock"
                      type="number"
                      fullWidth
                      error={!!errors.stock}
                      helperText={errors.stock?.message}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                      aria-label="Product Stock"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            {editingProduct ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
