"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export function useUser() {
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUsuario(user)  // ← era setUsuario(usuario), debe ser setUsuario(user)
      setLoading(false)
    }

    getUser()
  }, [])

  return { usuario, loading }
}