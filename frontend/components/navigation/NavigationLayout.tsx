"use client"

import type React from "react"
import { useState } from "react"
import { Box, Toolbar } from "@mui/material"
import Header from "./header"
import Sidebar from "./sidebar"

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (

    <Box sx={{ display: "flex" }}>
      <Header toggleDrawer={toggleDrawer}/>
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
