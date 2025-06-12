"use client"
import { useState } from "react"
import type React from "react"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Pill,
  Plus,
  CalendarIcon,
  Download,
  AlertTriangle,
  CheckCircle,
  Bell,
  Edit,
  Trash2,
  Activity,
  Clock,
  Check,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  frequencyCount: number // 1일 몇 회
  startDate: Date
  endDate?: Date
  isActive: boolean
  notes?: string
  reminderEnabled: boolean
  reminderTimes: string[]
  category: string
  sideEffects?: string[]
}

interface TodaySchedule {
  id: number
  medicationId: number
  medicationName: string
  dosage: string
  scheduledTime: string
  isCompleted: boolean
  completedAt?: Date
  scheduleIndex: number // 하루 중 몇 번째 복용인지 (0: 첫번째, 1: 두번째...)
}

interface MedicationLog {
  id: number
  medicationId: number
  medicationName: string
  takenAt: Date
  dosage: string
  notes?: string
  skipped: boolean
  scheduleIndex: number
}

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState("current")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)

  // 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    frequencyCount: 1,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    category: "",
    notes: "",
    reminderEnabled: false,
    reminderTimes: ["08:00"],
    sideEffects: "",
  })

  // 목업 데이터
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "암로디핀",
      dosage: "5mg",
      frequency: "1일 1회",
      frequencyCount: 1,
      startDate: new Date("2024-11-01"),
      isActive: true,
      notes: "고혈압 치료제, 아침 식후 복용",
      reminderEnabled: true,
      reminderTimes: ["08:00"],
      category: "고혈압",
      sideEffects: ["어지러움", "부종"],
    },
    {
      id: 2,
      name: "메트포르민",
      dosage: "500mg",
      frequency: "1일 2회",
      frequencyCount: 2,
      startDate: new Date("2024-10-15"),
      isActive: true,
      notes: "당뇨병 치료제, 식후 복용",
      reminderEnabled: true,
      reminderTimes: ["08:00", "20:00"],
      category: "당뇨병",
      sideEffects: ["소화불량", "설사"],
    },
    {
      id: 3,
      name: "오메가3",
      dosage: "1000mg",
      frequency: "1일 3회",
      frequencyCount: 3,
      startDate: new Date("2024-11-01"),
      isActive: true,
      notes: "식후 복용",
      reminderEnabled: true,
      reminderTimes: ["08:00", "13:00", "19:00"],
      category: "영양제",
      sideEffects: [],
    },
  ])

  // 오늘의 복용 일정 - 약물별로 여러 개 생성
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([
    // 암로디핀 (1일 1회)
    {
      id: 1,
      medicationId: 1,
      medicationName: "암로디핀",
      dosage: "5mg",
      scheduledTime: "08:00",
      isCompleted: true,
      completedAt: new Date("2024-12-12 08:15"),
      scheduleIndex: 0,
    },
    // 메트포르민 (1일 2회)
    {
      id: 2,
      medicationId: 2,
      medicationName: "메트포르민",
      dosage: "500mg",
      scheduledTime: "08:00",
      isCompleted: true,
      completedAt: new Date("2024-12-12 08:20"),
      scheduleIndex: 0,
    },
    {
      id: 3,
      medicationId: 2,
      medicationName: "메트포르민",
      dosage: "500mg",
      scheduledTime: "20:00",
      isCompleted: false,
      scheduleIndex: 1,
    },
    // 오메가3 (1일 3회)
    {
      id: 4,
      medicationId: 3,
      medicationName: "오메가3",
      dosage: "1000mg",
      scheduledTime: "08:00",
      isCompleted: true,
      completedAt: new Date("2024-12-12 08:25"),
      scheduleIndex: 0,
    },
    {
      id: 5,
      medicationId: 3,
      medicationName: "오메가3",
      dosage: "1000mg",
      scheduledTime: "13:00",
      isCompleted: false,
      scheduleIndex: 1,
    },
    {
      id: 6,
      medicationId: 3,
      medicationName: "오메가3",
      dosage: "1000mg",
      scheduledTime: "19:00",
      isCompleted: false,
      scheduleIndex: 2,
    },
  ])

  const [medicationLogs] = useState<MedicationLog[]>([
    {
      id: 1,
      medicationId: 1,
      medicationName: "암로디핀",
      takenAt: new Date("2024-12-11 08:00"),
      dosage: "5mg",
      skipped: false,
      scheduleIndex: 0,
    },
    {
      id: 2,
      medicationId: 2,
      medicationName: "메트포르민",
      takenAt: new Date("2024-12-11 08:00"),
      dosage: "500mg",
      skipped: false,
      scheduleIndex: 0,
    },
    {
      id: 3,
      medicationId: 2,
      medicationName: "메트포르민",
      takenAt: new Date("2024-12-11 20:00"),
      dosage: "500mg",
      skipped: true,
      notes: "깜빡함",
      scheduleIndex: 1,
    },
  ])

  const handleInputChange = (field: string, value: string | Date | boolean | string[] | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 복용 빈도에 따른 권장 시간 자동 설정
  const handleFrequencyChange = (frequency: string) => {
    const count = Number.parseInt(frequency.split(" ")[1].replace("회", ""))
    let recommendedTimes: string[] = []

    switch (count) {
      case 1:
        recommendedTimes = ["08:00"]
        break
      case 2:
        recommendedTimes = ["08:00", "20:00"]
        break
      case 3:
        recommendedTimes = ["08:00", "13:00", "19:00"]
        break
      case 4:
        recommendedTimes = ["08:00", "12:00", "17:00", "21:00"]
        break
      default:
        recommendedTimes = ["08:00"]
    }

    setFormData((prev) => ({
      ...prev,
      frequency,
      frequencyCount: count,
      reminderTimes: recommendedTimes,
    }))
  }

  // 알림 시간 추가
  const addReminderTime = () => {
    setFormData((prev) => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, "12:00"],
    }))
  }

  // 알림 시간 삭제
  const removeReminderTime = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((_, i) => i !== index),
    }))
  }

  // 알림 시간 수정
  const updateReminderTime = (index: number, time: string) => {
    setFormData((prev) => ({
      ...prev,
      reminderTimes: prev.reminderTimes.map((t, i) => (i === index ? time : t)),
    }))
  }

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication)
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      frequencyCount: medication.frequencyCount,
      startDate: medication.startDate,
      endDate: medication.endDate,
      category: medication.category,
      notes: medication.notes || "",
      reminderEnabled: medication.reminderEnabled,
      reminderTimes: medication.reminderTimes,
      sideEffects: medication.sideEffects ? medication.sideEffects.join(", ") : "",
    })
    setActiveTab("add")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMedication) {
      // 수정 모드
      const updatedMedication: Medication = {
        ...editingMedication,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        frequencyCount: formData.frequencyCount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        reminderEnabled: formData.reminderEnabled,
        reminderTimes: formData.reminderTimes,
        category: formData.category,
        sideEffects: formData.sideEffects ? formData.sideEffects.split(",").map((s) => s.trim()) : [],
      }

      setMedications((prev) => prev.map((med) => (med.id === editingMedication.id ? updatedMedication : med)))
      setEditingMedication(null)
    } else {
      // 새 약물 추가 모드 (기존 코드 유지)
      const newMedication: Medication = {
        id: medications.length + 1,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        frequencyCount: formData.frequencyCount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: true,
        notes: formData.notes,
        reminderEnabled: formData.reminderEnabled,
        reminderTimes: formData.reminderTimes,
        category: formData.category,
        sideEffects: formData.sideEffects ? formData.sideEffects.split(",").map((s) => s.trim()) : [],
      }

      setMedications((prev) => [newMedication, ...prev])
    }

    // 폼 초기화
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      frequencyCount: 1,
      startDate: new Date(),
      endDate: undefined,
      category: "",
      notes: "",
      reminderEnabled: false,
      reminderTimes: ["08:00"],
      sideEffects: "",
    })

    // 현재 복용 중 탭으로 이동
    setActiveTab("current")
  }

  const handleCancelEdit = () => {
    setEditingMedication(null)
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      frequencyCount: 1,
      startDate: new Date(),
      endDate: undefined,
      category: "",
      notes: "",
      reminderEnabled: false,
      reminderTimes: ["08:00"],
      sideEffects: "",
    })
    setActiveTab("current")
  }

  const handleDeleteClick = (medication: Medication) => {
    setMedicationToDelete(medication)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (medicationToDelete) {
      setMedications((prev) => prev.filter((med) => med.id !== medicationToDelete.id))
      setMedicationToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  const toggleMedicationStatus = (medicationId: number) => {
    setMedications((prev) => prev.map((med) => (med.id === medicationId ? { ...med, isActive: !med.isActive } : med)))
  }

  const handleCompleteSchedule = (scheduleId: number) => {
    setTodaySchedule((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              isCompleted: !schedule.isCompleted,
              completedAt: !schedule.isCompleted ? new Date() : undefined,
            }
          : schedule,
      ),
    )
  }

  const handleExportData = () => {
    const csvContent = [
      "약품명,복용량,복용빈도,시작일,종료일,상태,카테고리,메모",
      ...medications.map((med) =>
        [
          med.name,
          med.dosage,
          med.frequency,
          format(med.startDate, "yyyy-MM-dd"),
          med.endDate ? format(med.endDate, "yyyy-MM-dd") : "",
          med.isActive ? "복용중" : "중단",
          med.category,
          med.notes || "",
        ].join(","),
      ),
    ].join("\n")

    const element = document.createElement("a")
    const file = new Blob([csvContent], { type: "text/csv" })
    element.href = URL.createObjectURL(file)
    element.download = "복용약물목록.csv"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const activeMedications = medications.filter((med) => med.isActive)
  const completedToday = todaySchedule.filter((schedule) => schedule.isCompleted).length
  const totalToday = todaySchedule.length
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  // 시간별로 정렬된 오늘의 일정
  const sortedTodaySchedule = [...todaySchedule].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))

  return (
    <MainLayout>
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">투약 관리</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">복용 중인 약물을 체계적으로 관리하고 추적하세요.</p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="border-gray-200 dark:border-gray-700 h-12 px-6 text-base"
            disabled={medications.length === 0}
          >
            <Download className="mr-2 h-5 w-5" />
            데이터 내보내기
          </Button>
        </div>

        {/* 오늘의 복용 일정 */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span>오늘의 복용 일정</span>
              </CardTitle>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{completionRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {completedToday}/{totalToday} 완료
                  </div>
                </div>
                <div className="w-20 h-20 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-orange-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${completionRate}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedTodaySchedule.length > 0 ? (
              <div className="grid gap-4">
                {sortedTodaySchedule.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                      schedule.isCompleted
                        ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 shadow-md"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
                    }`}
                    onClick={() => handleCompleteSchedule(schedule.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                            schedule.isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {schedule.isCompleted ? <Check className="h-7 w-7" /> : <Pill className="h-7 w-7" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {schedule.medicationName}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                              ({schedule.scheduleIndex + 1}회차)
                            </span>
                          </h3>
                          <div className="flex items-center space-x-4 text-base text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{schedule.dosage}</span>
                            <span>•</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">
                              {schedule.scheduledTime}
                            </span>
                            {schedule.completedAt && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {format(schedule.completedAt, "HH:mm")} 복용완료
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {schedule.isCompleted ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 px-4 py-2 text-sm font-medium">
                            복용완료
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-orange-200 text-orange-600 dark:border-orange-700 dark:text-orange-400 px-4 py-2 text-sm font-medium"
                          >
                            복용대기
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  오늘 복용할 약물이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">새로운 약물을 추가해보세요.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 h-14">
            <TabsTrigger
              value="current"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              복용 중인 약물
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              {editingMedication ? "약물 수정" : "새 약물 추가"}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              복용 히스토리
            </TabsTrigger>
          </TabsList>

          {/* 복용 중인 약물 */}
          <TabsContent value="current" className="space-y-6">
            {activeMedications.map((medication) => (
              <Card
                key={medication.id}
                className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shadow-lg">
                        <Pill className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{medication.name}</h3>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 px-3 py-1 text-sm font-medium">
                            복용중
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-200 dark:border-gray-700 px-3 py-1 text-sm font-medium"
                          >
                            {medication.category}
                          </Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 mb-6">
                          <div className="flex items-center space-x-3">
                            <span className="text-base text-gray-600 dark:text-gray-400">복용량:</span>
                            <span className="font-bold text-gray-900 dark:text-white text-lg">{medication.dosage}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-base text-gray-600 dark:text-gray-400">빈도:</span>
                            <span className="font-bold text-gray-900 dark:text-white text-lg">
                              {medication.frequency}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-base text-gray-600 dark:text-gray-400">시작일:</span>
                            <span className="font-bold text-gray-900 dark:text-white text-lg">
                              {format(medication.startDate, "yyyy.MM.dd", { locale: ko })}
                            </span>
                          </div>
                        </div>
                        {medication.notes && (
                          <p className="text-base text-gray-600 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {medication.notes}
                          </p>
                        )}
                        {medication.sideEffects && medication.sideEffects.length > 0 && (
                          <div className="flex items-center space-x-3 mb-4">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <span className="text-base text-gray-600 dark:text-gray-400">부작용 주의:</span>
                            <div className="flex space-x-2">
                              {medication.sideEffects.map((effect, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400 px-3 py-1"
                                >
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {medication.reminderEnabled && (
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-green-500" />
                            <span className="text-base text-gray-600 dark:text-gray-400">알림 시간:</span>
                            <div className="flex space-x-2">
                              {medication.reminderTimes.map((time, index) => (
                                <Badge
                                  key={index}
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 px-3 py-1 font-medium"
                                >
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        size="lg"
                        variant="ghost"
                        className="h-12 w-12 p-0"
                        onClick={() => handleEdit(medication)}
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => toggleMedicationStatus(medication.id)}
                        className="h-12 w-12 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/10"
                      >
                        <Activity className="h-5 w-5" />
                      </Button>
                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => handleDeleteClick(medication)}
                        className="h-12 w-12 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeMedications.length === 0 && (
              <Card className="bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Pill className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    복용 중인 약물이 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    새로운 약물을 추가하여 체계적으로 관리해보세요.
                  </p>
                  <Button
                    onClick={() => setActiveTab("add")}
                    className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 text-base"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    약물 추가하기
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 새 약물 추가 */}
          <TabsContent value="add">
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    {editingMedication ? (
                      <Edit className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Plus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>
                  <span>{editingMedication ? "약물 정보 수정" : "새 약물 정보 입력"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          약품명
                        </Label>
                        <Input
                          id="name"
                          placeholder="예: 암로디핀"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="dosage" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          복용량
                        </Label>
                        <Input
                          id="dosage"
                          placeholder="예: 5mg"
                          value={formData.dosage}
                          onChange={(e) => handleInputChange("dosage", e.target.value)}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="frequency" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          복용 빈도
                        </Label>
                        <Select value={formData.frequency} onValueChange={handleFrequencyChange}>
                          <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                            <SelectValue placeholder="복용 빈도 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1일 1회">1일 1회</SelectItem>
                            <SelectItem value="1일 2회">1일 2회</SelectItem>
                            <SelectItem value="1일 3회">1일 3회</SelectItem>
                            <SelectItem value="1일 4회">1일 4회</SelectItem>
                            <SelectItem value="필요시">필요시</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          카테고리
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                            <SelectValue placeholder="약물 카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="고혈압">고혈압</SelectItem>
                            <SelectItem value="당뇨병">당뇨병</SelectItem>
                            <SelectItem value="진통제">진통제</SelectItem>
                            <SelectItem value="항생제">항생제</SelectItem>
                            <SelectItem value="비타민">비타민</SelectItem>
                            <SelectItem value="영양제">영양제</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="startDate" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          복용 시작일
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-200 dark:border-gray-700 h-12 text-base",
                                !formData.startDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-5 w-5" />
                              {formData.startDate
                                ? format(formData.startDate, "yyyy년 MM월 dd일", { locale: ko })
                                : "시작일 선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) => date && handleInputChange("startDate", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="endDate" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          복용 종료일 (선택사항)
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-200 dark:border-gray-700 h-12 text-base",
                                !formData.endDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-5 w-5" />
                              {formData.endDate
                                ? format(formData.endDate, "yyyy년 MM월 dd일", { locale: ko })
                                : "종료일 선택 (선택사항)"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.endDate}
                              onSelect={(date) => handleInputChange("endDate", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sideEffects" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          부작용 (선택사항)
                        </Label>
                        <Input
                          id="sideEffects"
                          placeholder="예: 어지러움, 소화불량 (쉼표로 구분)"
                          value={formData.sideEffects}
                          onChange={(e) => handleInputChange("sideEffects", e.target.value)}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Switch
                          id="reminder"
                          checked={formData.reminderEnabled}
                          onCheckedChange={(checked) => handleInputChange("reminderEnabled", checked)}
                        />
                        <Label htmlFor="reminder" className="text-base font-medium text-gray-700 dark:text-gray-300">
                          복용 알림 설정
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* 알림 시간 설정 */}
                  {formData.reminderEnabled && (
                    <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-medium text-blue-800 dark:text-blue-200">
                          복용 알림 시간 설정
                        </Label>
                        <Button
                          type="button"
                          onClick={addReminderTime}
                          className="bg-blue-500 hover:bg-blue-600 text-white h-10 px-4"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          시간 추가
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {formData.reminderTimes.map((time, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Input
                              type="time"
                              value={time}
                              onChange={(e) => updateReminderTime(index, e.target.value)}
                              className="border-blue-200 dark:border-blue-700 h-12 text-base"
                            />
                            {formData.reminderTimes.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeReminderTime(index)}
                                className="h-12 w-12 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        💡 복용 빈도에 따라 권장 시간이 자동으로 설정됩니다. 필요에 따라 수정하거나 추가할 수 있습니다.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-base font-medium text-gray-700 dark:text-gray-300">
                      복용 메모 (선택사항)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="복용 방법, 주의사항 등"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={4}
                      className="border-gray-200 dark:border-gray-700 text-base"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg">
                      {editingMedication ? <Edit className="mr-2 h-6 w-6" /> : <Plus className="mr-2 h-6 w-6" />}
                      {editingMedication ? "약물 정보 수정" : "복약 정보 저장"}
                    </Button>
                    {editingMedication && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="border-gray-200 dark:border-gray-700 h-14 px-8 text-lg"
                      >
                        취소
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 복용 히스토리 */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-6">
              {medicationLogs.map((log) => (
                <Card
                  key={log.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                            log.skipped ? "bg-red-100 dark:bg-red-900/20" : "bg-green-100 dark:bg-green-900/20"
                          }`}
                        >
                          {log.skipped ? (
                            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                          ) : (
                            <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {log.medicationName}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                              ({log.scheduleIndex + 1}회차)
                            </span>
                          </h3>
                          <p className="text-base text-gray-600 dark:text-gray-400">
                            {format(log.takenAt, "yyyy년 MM월 dd일 HH:mm", { locale: ko })} • {log.dosage}
                          </p>
                          {log.notes && <p className="text-base text-gray-500 dark:text-gray-400">{log.notes}</p>}
                        </div>
                      </div>
                      <Badge
                        className={
                          log.skipped
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 px-4 py-2 text-base"
                            : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 px-4 py-2 text-base"
                        }
                      >
                        {log.skipped ? "미복용" : "복용완료"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 사용 가이드 */}
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl text-orange-800 dark:text-orange-200">
              <Pill className="h-6 w-6" />
              <span>안전한 복약 관리 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">💊 복약 관리 팁</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 정해진 시간에 규칙적으로 복용하세요</li>
                  <li>• 약물 상호작용을 주의하세요</li>
                  <li>• 부작용 발생 시 즉시 의사와 상담하세요</li>
                  <li>• 임의로 복용을 중단하지 마세요</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">⚠️ 주의사항</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 유효기간을 확인하세요</li>
                  <li>• 적절한 보관 조건을 유지하세요</li>
                  <li>• 다른 사람과 약물을 공유하지 마세요</li>
                  <li>• 정기적으로 의사와 복약 상태를 점검하세요</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-3 text-xl">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span>약물 정보 삭제</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              <strong>"{medicationToDelete?.name}"</strong> 약물 정보를 정말 삭제하시겠습니까?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">삭제된 정보는 복구할 수 없습니다.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 px-6 text-base">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 text-base"
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
