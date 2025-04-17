"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Mock data for analytics
const salesTrendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Sales",
      data: [12000, 19000, 15000, 25000, 22000, 30000, 29000, 35000, 32000, 38000, 41000, 48000],
      borderColor: "rgba(25, 118, 210, 1)",
      backgroundColor: "rgba(25, 118, 210, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
}

const categoryDistributionData = {
  labels: ["Electronics", "Clothing", "Home", "Office", "Food"],
  datasets: [
    {
      label: "Sales by Category",
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        "rgba(25, 118, 210, 0.7)",
        "rgba(245, 0, 87, 0.7)",
        "rgba(76, 175, 80, 0.7)",
        "rgba(255, 152, 0, 0.7)",
        "rgba(156, 39, 176, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
}

const customerAcquisitionData = {
  labels: ["Direct", "Referral", "Social Media", "Email", "Ads"],
  datasets: [
    {
      label: "Customer Acquisition",
      data: [30, 15, 25, 20, 10],
      backgroundColor: [
        "rgba(25, 118, 210, 0.7)",
        "rgba(245, 0, 87, 0.7)",
        "rgba(76, 175, 80, 0.7)",
        "rgba(255, 152, 0, 0.7)",
        "rgba(156, 39, 176, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
}

const topProductsData = {
  labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
  datasets: [
    {
      label: "Units Sold",
      data: [120, 98, 85, 75, 60],
      backgroundColor: "rgba(25, 118, 210, 0.7)",
    },
  ],
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sales Trend",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Insights and statistics about your business
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
            aria-label="Select time range"
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="40%" height={30} />
                <Skeleton width="100%" height={300} />
              </Box>
            ) : (
              <>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Sales Trend
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300, position: "relative" }}>
                  <Line options={lineChartOptions} data={salesTrendData} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" height={30} />
                <Skeleton width="100%" height={300} />
              </Box>
            ) : (
              <>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Sales by Category
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300, position: "relative" }}>
                  <Pie options={pieChartOptions} data={categoryDistributionData} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Customer Acquisition */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" height={30} />
                <Skeleton width="100%" height={300} />
              </Box>
            ) : (
              <>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Customer Acquisition Channels
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300, position: "relative" }}>
                  <Pie options={pieChartOptions} data={customerAcquisitionData} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="40%" height={30} />
                <Skeleton width="100%" height={300} />
              </Box>
            ) : (
              <>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Top Selling Products
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300, position: "relative" }}>
                  <Bar options={barChartOptions} data={topProductsData} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* ELK Stack Integration */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" height={30} />
                <Skeleton width="100%" height={200} />
              </Box>
            ) : (
              <>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  System Performance Metrics (ELK Stack)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" paragraph>
                    This section would integrate with your ELK Stack (Elasticsearch, Logstash, Kibana) to display system
                    performance metrics, logs, and other analytics data.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Typical metrics that could be displayed here include:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">Server response times and availability</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">API usage patterns and performance</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">Error rates and common exceptions</Typography>
                    </li>
                    <li>
                      <Typography variant="body1">User behavior analytics</Typography>
                    </li>
                  </ul>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Note: This is a placeholder for ELK Stack integration. Actual implementation would require
                    connecting to your Elasticsearch instance or Kibana dashboards.
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
