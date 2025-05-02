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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Skeleton,
} from "@mui/material"
import { Search as SearchIcon, Visibility as ViewIcon, Receipt as ReceiptIcon } from "@mui/icons-material"
import NavigationLayout from "@/components/layout/navigation-layout"

// Define order type
interface Order {
  id: string
  customer: string
  date: string
  total: number
  status: "Completed" | "Processing" | "Shipped" | "Cancelled"
  paymentMethod: string
  items: number
}

// Mock data for orders
const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))

  return {
    id: `ORD-${10000 + i}`,
    customer: `Customer ${i + 1}`,
    date: date.toISOString().split("T")[0],
    total: Number.parseFloat((Math.random() * 1000 + 50).toFixed(2)),
    status: ["Completed", "Processing", "Shipped", "Cancelled"][Math.floor(Math.random() * 4)] as
      | "Completed"
      | "Processing"
      | "Shipped"
      | "Cancelled",
    paymentMethod: ["Credit Card", "PayPal", "Bank Transfer"][Math.floor(Math.random() * 3)],
    items: Math.floor(Math.random() * 5) + 1,
  }
})

// Define order details type
interface OrderItem {
  id: string
  product: string
  price: number
  quantity: number
  total: number
}

// Mock data for order items
const generateOrderItems = (itemCount: number): OrderItem[] => {
  return Array.from({ length: itemCount }, (_, i) => {
    const price = Number.parseFloat((Math.random() * 200 + 10).toFixed(2))
    const quantity = Math.floor(Math.random() * 3) + 1

    return {
      id: `ITEM-${1000 + i}`,
      product: `Product ${i + 1}`,
      price,
      quantity,
      total: price * quantity,
    }
  })
}

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOrders(mockOrders)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderItems(generateOrderItems(order.items))
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedOrder(null)
  }

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? order.status === statusFilter : true
    const matchesDate = dateFilter ? order.date.includes(dateFilter) : true

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <NavigationLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sales Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your orders and sales
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            label="Search Orders"
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
            aria-label="Search orders by ID or customer"
          />

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
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date"
            type="date"
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
            aria-label="Filter by date"
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table aria-label="sales table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
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
                    <TableCell>
                      <Skeleton animation="wave" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton animation="wave" width={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "Completed"
                            ? "success"
                            : order.status === "Processing"
                              ? "primary"
                              : order.status === "Shipped"
                                ? "info"
                                : "error"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOrder(order)}
                        aria-label={`View order ${order.id}`}
                        size="small"
                      >
                        <ViewIcon />
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
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ReceiptIcon color="primary" />
                Order Details - {selectedOrder.id}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography variant="body1">{selectedOrder.customer}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1">{selectedOrder.date}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedOrder.status}
                    color={
                      selectedOrder.status === "Completed"
                        ? "success"
                        : selectedOrder.status === "Processing"
                          ? "primary"
                          : selectedOrder.status === "Shipped"
                            ? "info"
                            : "error"
                    }
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">{selectedOrder.paymentMethod}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
                        Order Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        ${selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" color="primary">
                Print Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </NavigationLayout>
  )
}
