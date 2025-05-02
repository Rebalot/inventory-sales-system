"use client"

import type React from "react"

import { useState, useContext, use, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { ColorModeContext } from "@/app/ClientLayout"
import { useAuth } from "@/lib/auth/AuthContext"
import { get } from "http"

interface HeaderProps {
  toggleDrawer: () => void
}
export default function Header({ toggleDrawer }: HeaderProps) {
  const router = useRouter()
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()

  // useEffect(() => {
  //   const getName = (user: User) => {
  //     if (user?.firstName && user?.lastName) {
  //       return `${user.firstName} ${user.lastName}`
  //     } else if (user?.firstName) {
  //       return user.firstName
  //     }
  //     else if (user?.lastName) {
  //       return user.lastName
  //     }
  //     return "Default Name"
  //   }
  // if (user) {
  //   getName(user)
  // }
  // }, [user])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory & Sales Management
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" aria-label="toggle theme" onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              aria-label="account of current user"
            >
              <Avatar alt={"User avatar"} sx={{ width: 32, height: 32 }} src={user?.avatar}/>
            </IconButton>
          </Tooltip>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
