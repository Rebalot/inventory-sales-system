'use client'

import { useAuth } from "@/lib/auth/AuthContext"
import { use, useEffect } from "react"

export default function Logout() {
    const {logout} = useAuth()
    useEffect(() => {
        const performLogout = async () => {
            await logout()
        }
        performLogout()
    }, [])

    return null

}