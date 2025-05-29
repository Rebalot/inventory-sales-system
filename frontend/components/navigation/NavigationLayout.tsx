"use client"

import type React from "react"
import { useState } from "react"
import { Box, Container, Toolbar } from "@mui/material"
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
          flex: 1,
          p: 3,
          width: "100%",
          overflow: "hidden",
          maxWidth: { sm: '100vw',md: 'calc(100vw - 240px)'},
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  
  )
}
