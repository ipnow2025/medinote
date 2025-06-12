"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Clock, Flame, Plus, Edit, Trash2, TrendingUp } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import { getUserId, isLoggedIn, goToInternalUrl } from "@/lib/func"

interface ExerciseRecord {
  id: string
  date: string
  type: string
  duration: number
  intensity: "low" | "medium" | "high"
  calories?: number
  notes?: string
  heartRate?: number
}

export default function ExerciseRecordPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [records, setRecords] = useState<ExerciseRecord[]>([
    {
      id: "1",
      date: "2024-12-20",
      type: "걷기",
      duration: 30,
      intensity: "medium",
      calories: 150,
      notes: "공원에서 가벼운 산책",
      heartRate: 110,
    },
    {
      id: "2",
      date: "2024-12-19",
      type: "수영",
      duration: 45,
      intensity: "high",
      calories: 300,
      notes: "25m 풀에서 자유형",
      heartRate: 140,
    },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    duration: "",
    intensity: "medium" as const,
    calories: "",
    notes: "",
    heartRate: "",
  })

  const exerciseTypes = [
    "걷기",
    "조깅",
    "달리기",
    "수영",
    "자전거",
    "등산",
    "요가",
    "필라테스",
    "웨이트 트레이닝",
    "스트레칭",
    "테니스",
    "배드민턴",
    "골프",
    "기타",
  ]

  useEffect(() => {
    const uid = getUserId()
    setUserId(uid)
    if (!isLoggedIn()) {
      goToInternalUrl("/login")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingId
            ? {
                ...record,
                ...formData,
                duration: Number.parseInt(formData.duration),
                calories: formData.calories ? Number.parseInt(formData.calories) : undefined,
                heartRate: formData.heartRate ? Number.parseInt(formData.heartRate) : undefined,
              }
            : record,
        ),
      )
      setEditingId(null)
    } else {
      const newRecord: ExerciseRecord = {
        id: Date.now().toString(),
        date: formData.date,
        type: formData.type,
        duration: Number.parseInt(formData.duration),
        intensity: formData.intensity,
        calories: formData.calories ? Number.parseInt(formData.calories) : undefined,
        notes: formData.notes || undefined,
        heartRate: formData.heartRate ? Number.parseInt(formData.heartRate) : undefined,
      }
      setRecords((prev) => [...prev, newRecord])
    }

    setFormData({
      date: "",
      type: "",
      duration: "",
      intensity: "medium",
      calories: "",
      notes: "",
      heartRate: "",
    })
    setShowAddForm(false)
  }

  const handleEdit = (record: ExerciseRecord) => {
    setFormData({
      date: record.date,
      type: record.type,
      duration: record.duration.toString(),
      intensity: record.intensity,
      calories: record.calories?.toString() || "",
      notes: record.notes || "",
      heartRate: record.heartRate?.toString() || "",
    })
    setEditingId(record.id)
    setShowAddForm(true)
  }

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getIntensityText = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "낮음"
      case "medium":
        return "보통"
      case "high":
        return "높음"
      default:
        return "알 수 없음"
    }
  }

  const getTotalStats = () => {
    const thisMonth = records.filter((record) => {
      const recordDate = new Date(record.date)
      const now = new Date()
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear()
    })

    return {
      totalDays: thisMonth.length,
      totalDuration: thisMonth.reduce((sum, record) => sum + record.duration, 0),
      totalCalories: thisMonth.reduce((sum, record) => sum + (record.calories || 0), 0),
      avgHeartRate:
        thisMonth.length > 0
          ? Math.round(thisMonth.reduce((sum, record) => sum + (record.heartRate || 0), 0) / thisMonth.length)
          : 0,
    }
  }

  const stats = getTotalStats()

  if (!userId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">운동 기록</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">운동 활동을 기록하고 건강 목표를 달성하세요.</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            운동 기록 추가
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">이번 달 운동일</CardTitle>
              <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDays}일</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">목표: 20일</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 운동시간</CardTitle>
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDuration}분</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">이번 달</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">소모 칼로리</CardTitle>
              <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCalories}kcal</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">이번 달</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 심박수</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgHeartRate}bpm</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">운동 중 평균</p>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? "운동 기록 수정" : "새 운동 기록 추가"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">운동 날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">운동 종류</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="운동 종류를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">운동 시간 (분)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="운동 시간을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intensity">운동 강도</Label>
                    <Select
                      value={formData.intensity}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData((prev) => ({ ...prev, intensity: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">낮음</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="high">높음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calories">소모 칼로리 (선택)</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value }))}
                      placeholder="소모된 칼로리"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">평균 심박수 (선택)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="평균 심박수 (bpm)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">메모</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="운동에 대한 추가 메모사항"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                    {editingId ? "수정하기" : "기록하기"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingId(null)
                      setFormData({
                        date: "",
                        type: "",
                        duration: "",
                        intensity: "medium",
                        calories: "",
                        notes: "",
                        heartRate: "",
                      })
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Exercise Records List */}
        <div className="space-y-4">
          {records.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">운동 기록이 없습니다</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">첫 번째 운동을 기록해보세요.</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />첫 운동 기록하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            records
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <Card key={record.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(record.intensity)}`}
                          >
                            {getIntensityText(record.intensity)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(record.date).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-white">{record.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">{record.duration}분</span>
                            </div>
                            {record.calories && (
                              <div className="flex items-center space-x-2">
                                <Flame className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{record.calories}kcal</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {record.heartRate && (
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  평균 심박수: {record.heartRate}bpm
                                </span>
                              </div>
                            )}
                            {record.notes && (
                              <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">메모: </span>
                                <span className="text-gray-600 dark:text-gray-400">{record.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(record)}
                          className="border-gray-200 dark:border-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </MainLayout>
  )
}
