"use client"

import type React from "react"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
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
  Tooltip,
  Container,
} from "@mui/material"
import { Search as SearchIcon, Visibility as ViewIcon, Receipt as ReceiptIcon } from "@mui/icons-material"
import useSWR from "swr"
import { API_ENDPOINTS } from "@/lib/config"
import { TablePaginationActions } from "@/components/table/tablePagination"
import { getUtcRangeFromLocalDate } from "@/lib/utils/utils"

// Define order type
interface Order {
  id: string
  orderNumber: string
  customerId: string
  date: string
  total: number
  status: "Completed" | "Processing" | "Shipped" | "Cancelled"
  paymentMethod: "Credit Card" | "PayPal" | "Bank Transfer"
  items: OrderItem[]
}
// Define order details type
interface OrderItem {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(67);

    useLayoutEffect(() => {
      if (rowRef.current) {
        const height = rowRef.current.getBoundingClientRect().height;
        if (height) setRowHeight(height);
      }
    }, [orders]);

  const [query, setQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
    status: "",
    date: {
      gte: "",
      lte: "",
    },
  });
    
    const queryParams = {
    page: String(query.page),
    limit: String(query.limit),
    ...(query.search && { search: query.search }),
    ...(query.status && { status: query.status }),
    ...(query.date?.gte && query.date?.lte &&  { date: JSON.stringify(query.date) }),
  };
  console.log('Query Params:', queryParams);
    const key = API_ENDPOINTS.SALES.GET_ORDERS(queryParams)
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
    console.log('Data:', data)

  useEffect(() => {
      if (data && Array.isArray(data.items) && data.items.length > 0) {
      console.log('Fetched data:', data);
      console.log('Fetched orders:', data.items);
      const itemsMapped = data.items.map((item: Order) => ({
          ...item,
          date: new Date(item.date).toLocaleString(),
          status: item.status.toLowerCase()
            .split("_")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          paymentMethod: item.paymentMethod
            .toLowerCase()
            .split("_")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }))
        console.log('Mapped products:', itemsMapped);
      setOrders(itemsMapped);
    } else {
      setOrders([]);
      console.log('No products found or data.items is missing');
    }
  }, [data]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setQuery((prev) => ({ 
      ...prev, 
      page: newPage 
    }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery((prev) => ({ 
      ...prev, 
      limit: Number.parseInt(event.target.value, 10),
      page: 0
    }))
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedOrder(null)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 120px)", width: { sm: 'calc(100vw - 48px)', md: 'calc(100vw - 288px)'}}}>
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
            value={query.search}
            onChange={(e) => setQuery((prev) => ({
              ...prev,
              page: 0,
              search: e.target.value
            }))}
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
              value={query.status}
              label="Status"
              onChange={(e) => setQuery((prev) => ({
                ...prev,
                page: 0,
                status: e.target.value
              }))}
              aria-label="Filter by status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="SHIPPED">Shipped</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date"
            type="date"
            size="small"
            value={query.date?.gte?.slice(0, 10) || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (!inputValue) {
                setQuery((prev) => ({
                  ...prev,
                  page: 0,
                  date: { gte: "", lte: "" },
                }));
                return;
              }
              const utcDate = getUtcRangeFromLocalDate(inputValue);
              console.log('Selected date range:', utcDate);
              setQuery((prev) => ({
                ...prev,
                page: 0,
                date: utcDate
              }));
            }}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
            aria-label="Filter by date"
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column"}}>
        <TableContainer sx={{ overflow: "auto"}}>
          <Table aria-label="sales table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell >Order Number</TableCell>
                <TableCell >Customer</TableCell>
                <TableCell >Date</TableCell>
                <TableCell >Total</TableCell>
                <TableCell >Status</TableCell>
                <TableCell >Payment Method</TableCell>
                <TableCell >Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from(new Array(query.limit)).map((_, index) => (
                  <TableRow key={index} sx={{height: rowHeight}}>
                    <TableCell sx={{width: 140, minWidth: 140}}>
                      <Skeleton animation="wave"/>
                    </TableCell>
                    <TableCell sx={{width: 140, minWidth: 140}}>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell sx={{width: 200, minWidth: 200}}>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell sx={{width: 125, minWidth: 125}}>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell sx={{width: 130, minWidth: 130}}>
                      <Skeleton animation="wave"/>
                    </TableCell>
                    <TableCell sx={{width: 150, minWidth: 150}}>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell sx={{width: 140, minWidth: 140}}>
                      <Skeleton animation="wave"/>
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, idx) => (
                  <TableRow key={order.id} ref={idx === 0 ? rowRef : null}>
                    <TableCell sx={{width: 140, minWidth: 140}}>
                      {order.orderNumber}
                    </TableCell >
                    <TableCell sx={{width: 140, minWidth: 140}}>
                      <Tooltip title={order.customerId} placement="top-start" arrow>
                        <Typography
                        variant="body2"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {order.customerId}
                      </Typography>
                      </Tooltip>
                      </TableCell>
                    <TableCell sx={{width: 200, minWidth: 200}}>{order.date}</TableCell>
                    <TableCell sx={{width: 125, minWidth:125}}>${order.total.toFixed(2)}</TableCell>
                    <TableCell sx={{width: 130, minWidth: 130}}>
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
                    <TableCell sx={{width: 150, minWidth: 150}}>{order.paymentMethod}</TableCell>
                    <TableCell sx={{width: 140, minWidth: 140}}>
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
          count={data?.totalItems ?? -1}
          rowsPerPage={query.limit}
          page={query.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          sx={{ minHeight: 52, overflow: "hidden", borderTop: '1px solid hsl(var(--border))' }}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ReceiptIcon color="primary" />
                Order Details: <Typography component='span' variant="h6" sx={{color: 'text.secondary'}}>{selectedOrder.id}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6}}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography variant="body1">{selectedOrder.customerId}</Typography>
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
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
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
    </Box>
  )
}
