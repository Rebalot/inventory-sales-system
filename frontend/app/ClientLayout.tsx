"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useState, useEffect, createContext, useMemo } from "react"
import Box from "@mui/material/Box"
import { AuthProvider } from "@/lib/auth/AuthContext"

const inter = Inter({ subsets: ["latin"] })

// Create a theme context
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mode, setMode] = useState<"light" | "dark">("light")

  // Update the theme only on the client
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as "light" | "dark"
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light"
          localStorage.setItem("themeMode", newMode)
          return newMode
        })
      },
    }),
    [],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#f50057",
          },
        },
        typography: {
          fontFamily: inter.style.fontFamily,
        },
      }),
    [mode, inter.style.fontFamily],
  )

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100vh" }}>{children}</Box>
          </ThemeProvider>
        </ColorModeContext.Provider>
        </AuthProvider>
        
      </body>
    </html>
  )
}
