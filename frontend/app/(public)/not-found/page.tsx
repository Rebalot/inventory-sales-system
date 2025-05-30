'use client'

import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
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
          <FileQuestion size={80} color="#f44336" />
  
          <Typography variant="h2" component="h1" sx={{ mt: 4, fontWeight: "bold" }}>
            404
          </Typography>
  
          <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
            Page Not Found
          </Typography>
  
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
            Sorry, the page you’re looking for doesn’t exist or has been moved.
          </Typography>
  
          <Button variant="contained" color="primary" component={Link} href="/login" aria-label="Back to Home">
            Back to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}