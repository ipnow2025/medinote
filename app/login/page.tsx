"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { apiFetch, saveSession, getBasePath } from "@/lib/func"

export default function LoginPage() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  //const { push } = useBasePathRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await apiFetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      })
      const data = await res.json()
      console.log(data);
      if (!res.ok) {
        setError(data.error || "로그인 실패")
        return
      }
      saveSession(data.result)
      // 메인 페이지로 이동
      router.push("/")
      
    } catch (e) {
      console.log(e);
      setError("서버 오류2")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-center mb-4">
          <img 
            src={`/placeholder-logo.svg`} 
            alt="로고" 
            className="w-full h-auto max-h-16 object-contain dark:invert dark:brightness-200 transition-all duration-200" 
          />
        </div>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          required
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          로그인
        </button>
      </form>
    </div>
  )
}
