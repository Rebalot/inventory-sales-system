"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Toolbar } from "@mui/material"
import Header from "./header"
import Sidebar from "./sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
