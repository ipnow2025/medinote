"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2, Bell } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import { getUserId, isLoggedIn, goToInternalUrl } from "@/lib/func"

interface Appointment {
  id: string
  date: string
  time: string
  hospital: string
  doctor: string
  department: string
  purpose: string
  notes?: string
  status: "scheduled" | "completed" | "cancelled"
}

export default function AppointmentsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      date: "2024-12-25",
      time: "14:30",
      hospital: "서울대병원",
      doctor: "김철수",
      department: "내과",
      purpose: "정기 검진",
      notes: "혈압약 처방 받기",
      status: "scheduled",
    },
    {
      id: "2",
      date: "2024-12-30",
      time: "10:00",
      hospital: "연세병원",
      doctor: "이영희",
      department: "심장내과",
      purpose: "심전도 검사",
      status: "scheduled",
    },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    hospital: "",
    doctor: "",
    department: "",
    purpose: "",
    notes: "",
  })

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
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === editingId ? { ...apt, ...formData, status: "scheduled" as const } : apt)),
      )
      setEditingId(null)
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...formData,
        status: "scheduled",
      }
      setAppointments((prev) => [...prev, newAppointment])
    }

    setFormData({
      date: "",
      time: "",
      hospital: "",
      doctor: "",
      department: "",
      purpose: "",
      notes: "",
    })
    setShowAddForm(false)
  }

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      date: appointment.date,
      time: appointment.time,
      hospital: appointment.hospital,
      doctor: appointment.doctor,
      department: appointment.department,
      purpose: appointment.purpose,
      notes: appointment.notes || "",
    })
    setEditingId(appointment.id)
    setShowAddForm(true)
  }

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예정"
      case "completed":
        return "완료"
      case "cancelled":
        return "취소"
      default:
        return "알 수 없음"
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">진료 일정 관리</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              예정된 진료 일정을 관리하고 새로운 예약을 추가하세요.
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />새 일정 추가
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? "일정 수정" : "새 일정 추가"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">진료 날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">진료 시간</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">병원명</Label>
                    <Input
                      id="hospital"
                      value={formData.hospital}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hospital: e.target.value }))}
                      placeholder="병원명을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">담당의</Label>
                    <Input
                      id="doctor"
                      value={formData.doctor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, doctor: e.target.value }))}
                      placeholder="담당의명을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">진료과</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="진료과를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="내과">내과</SelectItem>
                        <SelectItem value="심장내과">심장내과</SelectItem>
                        <SelectItem value="내분비내과">내분비내과</SelectItem>
                        <SelectItem value="신경과">신경과</SelectItem>
                        <SelectItem value="정형외과">정형외과</SelectItem>
                        <SelectItem value="안과">안과</SelectItem>
                        <SelectItem value="이비인후과">이비인후과</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">진료 목적</Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                      placeholder="진료 목적을 입력하세요"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">메모</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="추가 메모사항을 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                    {editingId ? "수정하기" : "추가하기"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingId(null)
                      setFormData({
                        date: "",
                        time: "",
                        hospital: "",
                        doctor: "",
                        department: "",
                        purpose: "",
                        notes: "",
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

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">예정된 진료가 없습니다</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">새로운 진료 일정을 추가해보세요.</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />첫 일정 추가하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{appointment.department}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {new Date(appointment.date).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{appointment.hospital}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{appointment.doctor} 의사</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">진료 목적: </span>
                            <span className="text-gray-900 dark:text-white">{appointment.purpose}</span>
                          </div>
                          {appointment.notes && (
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">메모: </span>
                              <span className="text-gray-600 dark:text-gray-400">{appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(appointment)}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                        <Bell className="h-4 w-4" />
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
