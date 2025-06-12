"use client"
import { useEffect } from "react"
import { goToInternalUrl, isLoggedIn } from "@/lib/func"

export default function HomePage() {
  useEffect(() => {
    if (!isLoggedIn()) {
      goToInternalUrl("/login")
    } else {
      // 로그인된 사용자는 대시보드로 리다이렉트
      goToInternalUrl("/dashboard")
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>메디노트로 이동 중...</p>
      </div>
    </div>
  )
}
