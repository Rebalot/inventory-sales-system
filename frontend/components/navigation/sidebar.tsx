"use client"
import { usePathname, useRouter } from "next/navigation"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as SalesIcon,
  Analytics as AnalyticsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
import { PROTECTED_ROUTES } from "@/lib/constants"
import { useMemo } from "react"
import { useAuth } from "@/lib/AuthContext"

const drawerWidth = 240

interface SidebarProps {
  open: boolean
  toggleDrawer: () => void
}

export default function Sidebar({ open, toggleDrawer }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user, logout } = useAuth()

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
    { text: "Sales", icon: <SalesIcon />, path: "/sales" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
  ]

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const allowedRoles = PROTECTED_ROUTES[item.path];
      return user?.role.some(role => allowedRoles.includes(role));
    });
  }, [user]);

  const handleLogout = async () => {
    try{
      await logout()
      router.push("/login")
    }catch (error) {
      console.error("Logout error", error)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      toggleDrawer()
    }
  }

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={toggleDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer} aria-label="Close sidebar">
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.text}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} aria-label="Logout">
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
