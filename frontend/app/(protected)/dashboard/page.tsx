"use client"

import { useState, useEffect } from "react"
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider, Skeleton } from "@mui/material"
import { AttachMoney, Inventory, ShoppingCart, TrendingUp } from "@mui/icons-material"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Mock data for monthly sales
const monthlySalesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Sales 2023",
      data: [12000, 19000, 15000, 25000, 22000, 30000, 29000, 35000, 32000, 38000, 41000, 48000],
      backgroundColor: "rgba(25, 118, 210, 0.6)",
    },
    {
      label: "Sales 2022",
      data: [10000, 15000, 12000, 20000, 18000, 25000, 22000, 28000, 26000, 30000, 35000, 40000],
      backgroundColor: "rgba(245, 0, 87, 0.6)",
    },
  ],
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Sales",
    },
  },
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenue: 0,
  })
  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        setSummaryData({
          totalSales: 325000,
          totalOrders: 1250,
          totalProducts: 384,
          revenue: 42500,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your inventory and sales management dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{ xs: 6, sm: 6, md: 3}}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="80%" height={60} />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h2" variant="subtitle1" color="text.secondary">
                    Total Sales
                  </Typography>
                  <AttachMoney color="primary" />
                </Box>
                <Typography component="p" variant="h4" sx={{ py: 2 }}>
                  ${summaryData.totalSales.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +15% from last month
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3}}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="80%" height={60} />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h2" variant="subtitle1" color="text.secondary">
                    Total Orders
                  </Typography>
                  <ShoppingCart color="primary" />
                </Box>
                <Typography component="p" variant="h4" sx={{ py: 2 }}>
                  {summaryData.totalOrders.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +8% from last month
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3}}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="80%" height={60} />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h2" variant="subtitle1" color="text.secondary">
                    Total Products
                  </Typography>
                  <Inventory color="primary" />
                </Box>
                <Typography component="p" variant="h4" sx={{ py: 2 }}>
                  {summaryData.totalProducts.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  12 low stock items
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3}}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="80%" height={60} />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h2" variant="subtitle1" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                  <TrendingUp color="primary" />
                </Box>
                <Typography component="p" variant="h4" sx={{ py: 2 }}>
                  ${summaryData.revenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +12% from last month
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        
        {/* Sales Chart */}
        <Grid size={{ xs: 12}}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 400,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="40%" height={30} />
                <Skeleton width="100%" height={300} />
              </Box>
            ) : (
              <>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Sales Overview
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300, position: "relative" }}>
                  <Bar options={chartOptions} data={monthlySalesData} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Recent Orders and Top Products */}
        <Grid size={{ xs: 12, md: 6}}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardHeader title="Recent Orders" />
            <Divider />
            <CardContent sx={{ minHeight: 240 }}>
              {loading ? (
                <>
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Recent orders data will be displayed here
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6}}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardHeader title="Top Selling Products" />
            <Divider />
            <CardContent sx={{ minHeight: 240 }}>
              {loading ? (
                <>
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Top selling products data will be displayed here
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
