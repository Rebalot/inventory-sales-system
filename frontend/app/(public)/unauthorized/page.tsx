'use client'

import { useAuth } from "@/lib/auth/AuthContext"
import { Box, Button, Container, Typography, Paper, CircularProgress } from "@mui/material"
import { ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"


export default function Unauthorized() {
  const router = useRouter()
  const { logout, isLoading } = useAuth()

  const handleLoginRedirect = async () => {
    await logout(); // Cierra la sesión
  };
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <ShieldAlert size={80} color="#ff9800" />

          <Typography variant="h2" component="h1" sx={{ mt: 4, fontWeight: "bold" }}>
            401
          </Typography>

          <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
            Unauthorized Access
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
            You do not have permission to access this page. Please log in with an account that has the necessary permissions.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={handleLoginRedirect}  aria-label="Log in" disabled={isLoading}>
            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Log in"}
            </Button>

            <Button variant="outlined" onClick={() => router.back()} aria-label="Go back">
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}