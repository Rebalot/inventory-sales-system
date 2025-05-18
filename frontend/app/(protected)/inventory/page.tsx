"use client"

import type React from "react"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
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
import { API_ENDPOINTS } from "@/lib/config"
import useSWR, { mutate } from "swr"
import { TablePaginationActions } from "@/components/table/tablePagination"
import { set } from "date-fns"
// Define product type
export enum Category {
  Electronics = "Electronics",
  Clothing = "Clothing",
  Home = "Home",
  Office = "Office",
  Food = "Food"
}
interface Product {
  id: string
  name: string
  category: Category
  price: number
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  sku: string
}

// Define form schema with Zod
const productSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().positive({ message: "Price must be positive" }),
  stock: z.number().int().nonnegative({ message: "Stock must be a non-negative integer" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
})

type ProductFormData = z.infer<typeof productSchema>

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(67);
  const categories = Object.values(Category);

  useLayoutEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.getBoundingClientRect().height;
      if (height) setRowHeight(height);
    }
  }, [products]);

  const [query, setQuery] = useState({
  page: 0,
  limit: 10,
  search: "",
  category: "",
  status: "",
});
  
  const queryParams = {
  page: String(query.page),
  limit: String(query.limit),
  ...(query.search && { search: query.search }),
  ...(query.category && { category: query.category }),
  ...(query.status && { status: query.status }),
};
console.log('Query Params:', queryParams);
  const key = API_ENDPOINTS.INVENTORY.GET_PRODUCTS(queryParams)
  const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include',
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Error al obtener datos')
    }
    return res.json()
  })
  const { data, error, isLoading } = useSWR(key, fetcher)

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
    if (data && Array.isArray(data.items) && data.items.length > 0) {
    console.log('Fetched data:', data);
    console.log('Fetched products:', data.items);
    const itemsMapped = data.items.map((item: Product) => ({
        ...item,
        price: parseFloat(item.price.toFixed(2)),
        status:
          item.stock === 0
            ? "Out of Stock"
            : item.stock < 10
            ? "Low Stock"
            : "In Stock",
      }))
      console.log('Mapped products:', itemsMapped);
    setProducts(itemsMapped);
  } else {
    setProducts([]);
    console.log('No products found or data.items is missing');
  }
}, [data]);

  // Reset form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      reset({
        id: editingProduct.id,
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
        sku: editingProduct.sku,
      })
    } else {
      reset({
        id: "",
        name: "",
        category: "",
        price: 0,
        stock: 0,
        sku: "",
      })
    }
  }, [editingProduct, reset])

  const handleChangePage = (_: unknown, newPage: number) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery((prev) => ({
      ...prev,
      limit: Number.parseInt(event.target.value, 10),
      page: 0,
    }))
  }

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduct(null)
  }

  const onSubmit = async (data: ProductFormData) => {
    console.log(data)
    if (editingProduct) {
      // Update existing product
      console
      await fetch(API_ENDPOINTS.INVENTORY.UPDATE_PRODUCT(data.id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          setErrorMessage("Failed to update the product")
          throw new Error('Failed to update the product')
        }
        return res.json()
      })
      await mutate(key)
      setSuccessMessage("Product updated successfully!")
    } else {
      // Add new product
      await fetch(API_ENDPOINTS.INVENTORY.CREATE_PRODUCT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          setErrorMessage("Failed to create the product")
          throw new Error('Failed to create the product')
        }
        return res.json()
      })
      await mutate(key)
      setSuccessMessage("Product added successfully!")
    
    }

    // Close dialog and reset form
    handleCloseDialog()

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleDeleteProduct = async(id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(API_ENDPOINTS.INVENTORY.DELETE_PRODUCT(id), {
        method: "DELETE",
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          setErrorMessage("Failed to delete the product")
          throw new Error('Failed to delete the product')
        }
        return res.json()
      })
      const updatedProducts = products.filter((product) => product.id !== id);

      // Si era el último producto de la página y no estamos en la primera página, retrocedé
      if (updatedProducts.length === 0 && query.page > 0) {
        setQuery((prev) => ({
          ...prev,
          page: prev.page - 1,
        }))
      } else {
        await mutate(key); // recarga normalmente
      }
      setSuccessMessage("Product deleted successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }
  }

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
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {/* searchTerm, setCategory, setStatus */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={query.search}
            onChange={(e) => setQuery((prev) => ({
              ...prev,
              page: 0,
              search: e.target.value,
            }))
            }
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
              value={query.category}
              label="Category"
              onChange={(e) => setQuery((prev) => ({
                ...prev,
                page: 0,
                category: e.target.value,
              }))}
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
              value={query.status}
              label="Status"
              onChange={(e) => setQuery((prev) => ({
                ...prev,
                page: 0,
                status: e.target.value,
              }))}
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
              {isLoading ? (
                // Loading skeleton
                Array.from(new Array(query.limit)).map((_, index) => (
                  <TableRow key={index} sx={{height: rowHeight}}>
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
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton animation="wave" />
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, idx) => (
                  <TableRow key={product.id} ref={idx === 0 ? rowRef : null}>
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
          count={data?.totalItems ?? -1}
          rowsPerPage={query.limit}
          page={query.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
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
