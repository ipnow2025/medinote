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
import {
  Heart,
  Activity,
  Thermometer,
  Scale,
  Droplets,
  Plus,
  CalendarIcon,
  Download,
  Target,
  Clock,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface VitalRecord {
  id: number
  date: Date
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  bloodSugar: number
  temperature: number
  weight: number
  heartRate: number
  notes?: string
}

interface VitalTarget {
  bloodPressure: {
    systolic: { min: number; max: number }
    diastolic: { min: number; max: number }
  }
  bloodSugar: { min: number; max: number }
  temperature: { min: number; max: number }
  weight: { min: number; max: number }
  heartRate: { min: number; max: number }
}

export default function VitalCheckPage() {
  const [activeTab, setActiveTab] = useState("record")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // 폼 상태
  const [formData, setFormData] = useState({
    date: new Date(),
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    temperature: "",
    weight: "",
    heartRate: "",
    notes: "",
  })

  // 목표값 설정
  const [targets] = useState<VitalTarget>({
    bloodPressure: {
      systolic: { min: 90, max: 120 },
      diastolic: { min: 60, max: 80 },
    },
    bloodSugar: { min: 70, max: 140 },
    temperature: { min: 36.0, max: 37.5 },
    weight: { min: 60, max: 70 },
    heartRate: { min: 60, max: 100 },
  })

  // 목업 데이터
  const [records, setRecords] = useState<VitalRecord[]>([
    {
      id: 1,
      date: new Date("2024-12-12"),
      bloodPressure: { systolic: 125, diastolic: 82 },
      bloodSugar: 95,
      temperature: 36.5,
      weight: 68.5,
      heartRate: 72,
      notes: "아침 측정",
    },
    {
      id: 2,
      date: new Date("2024-12-11"),
      bloodPressure: { systolic: 130, diastolic: 85 },
      bloodSugar: 110,
      temperature: 36.8,
      weight: 68.3,
      heartRate: 75,
      notes: "저녁 식후",
    },
    {
      id: 3,
      date: new Date("2024-12-10"),
      bloodPressure: { systolic: 118, diastolic: 78 },
      bloodSugar: 88,
      temperature: 36.4,
      weight: 68.0,
      heartRate: 68,
    },
    {
      id: 4,
      date: new Date("2024-12-09"),
      bloodPressure: { systolic: 122, diastolic: 80 },
      bloodSugar: 102,
      temperature: 36.6,
      weight: 67.8,
      heartRate: 70,
    },
    {
      id: 5,
      date: new Date("2024-12-08"),
      bloodPressure: { systolic: 128, diastolic: 83 },
      bloodSugar: 115,
      temperature: 36.7,
      weight: 67.5,
      heartRate: 73,
    },
  ])

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRecord: VitalRecord = {
      id: records.length + 1,
      date: formData.date,
      bloodPressure: {
        systolic: Number.parseInt(formData.systolic) || 0,
        diastolic: Number.parseInt(formData.diastolic) || 0,
      },
      bloodSugar: Number.parseInt(formData.bloodSugar) || 0,
      temperature: Number.parseFloat(formData.temperature) || 0,
      weight: Number.parseFloat(formData.weight) || 0,
      heartRate: Number.parseInt(formData.heartRate) || 0,
      notes: formData.notes,
    }

    setRecords((prev) => [newRecord, ...prev])

    // 폼 초기화
    setFormData({
      date: new Date(),
      systolic: "",
      diastolic: "",
      bloodSugar: "",
      temperature: "",
      weight: "",
      heartRate: "",
      notes: "",
    })

    // 히스토리 탭으로 이동
    setActiveTab("history")
  }

  const getStatusColor = (value: number, target: { min: number; max: number }) => {
    if (value >= target.min && value <= target.max) {
      return "text-green-600 dark:text-green-400"
    } else if (value < target.min) {
      return "text-blue-600 dark:text-blue-400"
    } else {
      return "text-red-600 dark:text-red-400"
    }
  }

  const getStatusBadge = (value: number, target: { min: number; max: number }) => {
    if (value >= target.min && value <= target.max) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">정상</Badge>
    } else if (value < target.min) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">낮음</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">높음</Badge>
    }
  }

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (
      systolic >= targets.bloodPressure.systolic.min &&
      systolic <= targets.bloodPressure.systolic.max &&
      diastolic >= targets.bloodPressure.diastolic.min &&
      diastolic <= targets.bloodPressure.diastolic.max
    ) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">정상</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">주의</Badge>
    }
  }

  const handleExportData = () => {
    const csvContent = [
      "날짜,수축기혈압,이완기혈압,혈당,체온,체중,심박수,메모",
      ...records.map((record) =>
        [
          format(record.date, "yyyy-MM-dd"),
          record.bloodPressure.systolic,
          record.bloodPressure.diastolic,
          record.bloodSugar,
          record.temperature,
          record.weight,
          record.heartRate,
          record.notes || "",
        ].join(","),
      ),
    ].join("\n")

    const element = document.createElement("a")
    const file = new Blob([csvContent], { type: "text/csv" })
    element.href = URL.createObjectURL(file)
    element.download = "건강상태기록.csv"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // 최근 기록 계산
  const latestRecord = records[0]
  const averages = {
    systolic: Math.round(records.reduce((sum, r) => sum + r.bloodPressure.systolic, 0) / records.length),
    diastolic: Math.round(records.reduce((sum, r) => sum + r.bloodPressure.diastolic, 0) / records.length),
    bloodSugar: Math.round(records.reduce((sum, r) => sum + r.bloodSugar, 0) / records.length),
    temperature: (records.reduce((sum, r) => sum + r.temperature, 0) / records.length).toFixed(1),
    weight: (records.reduce((sum, r) => sum + r.weight, 0) / records.length).toFixed(1),
    heartRate: Math.round(records.reduce((sum, r) => sum + r.heartRate, 0) / records.length),
  }

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">건강 상태 기록</h1>
            <p className="text-gray-600 dark:text-gray-400">혈압, 혈당 등 건강 지표를 체계적으로 관리하세요.</p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="border-gray-200 dark:border-gray-700"
            disabled={records.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            데이터 내보내기
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">혈압</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {latestRecord ? `${latestRecord.bloodPressure.systolic}/${latestRecord.bloodPressure.diastolic}` : "-"}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {latestRecord &&
                  getBloodPressureStatus(latestRecord.bloodPressure.systolic, latestRecord.bloodPressure.diastolic)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">혈당</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Droplets className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {latestRecord ? `${latestRecord.bloodSugar}` : "-"}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">mg/dL</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {latestRecord && getStatusBadge(latestRecord.bloodSugar, targets.bloodSugar)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">체온</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Thermometer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {latestRecord ? `${latestRecord.temperature}` : "-"}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">℃</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {latestRecord && getStatusBadge(latestRecord.temperature, targets.temperature)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">체중</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Scale className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {latestRecord ? `${latestRecord.weight}` : "-"}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">kg</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {latestRecord && getStatusBadge(latestRecord.weight, targets.weight)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">심박수</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {latestRecord ? `${latestRecord.heartRate}` : "-"}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">bpm</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {latestRecord && getStatusBadge(latestRecord.heartRate, targets.heartRate)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="record" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              새 기록 입력
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              기록 히스토리
            </TabsTrigger>
            <TabsTrigger value="targets" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              목표 설정
            </TabsTrigger>
          </TabsList>

          {/* 새 기록 입력 */}
          <TabsContent value="record">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>건강 상태 기록</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      측정 날짜
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-200 dark:border-gray-700",
                            !formData.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "yyyy년 MM월 dd일", { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && handleInputChange("date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">혈압 (mmHg)</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="수축기 (예: 120)"
                            value={formData.systolic}
                            onChange={(e) => handleInputChange("systolic", e.target.value)}
                            className="border-gray-200 dark:border-gray-700"
                            type="number"
                          />
                          <div className="flex items-center px-2 text-gray-500 dark:text-gray-400">/</div>
                          <Input
                            placeholder="이완기 (예: 80)"
                            value={formData.diastolic}
                            onChange={(e) => handleInputChange("diastolic", e.target.value)}
                            className="border-gray-200 dark:border-gray-700"
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">혈당 (mg/dL)</Label>
                        <Input
                          placeholder="예: 95"
                          value={formData.bloodSugar}
                          onChange={(e) => handleInputChange("bloodSugar", e.target.value)}
                          className="border-gray-200 dark:border-gray-700"
                          type="number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">체온 (℃)</Label>
                        <Input
                          placeholder="예: 36.5"
                          value={formData.temperature}
                          onChange={(e) => handleInputChange("temperature", e.target.value)}
                          className="border-gray-200 dark:border-gray-700"
                          type="number"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">체중 (kg)</Label>
                        <Input
                          placeholder="예: 68.5"
                          value={formData.weight}
                          onChange={(e) => handleInputChange("weight", e.target.value)}
                          className="border-gray-200 dark:border-gray-700"
                          type="number"
                          step="0.1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">심박수 (bpm)</Label>
                        <Input
                          placeholder="예: 72"
                          value={formData.heartRate}
                          onChange={(e) => handleInputChange("heartRate", e.target.value)}
                          className="border-gray-200 dark:border-gray-700"
                          type="number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">메모 (선택사항)</Label>
                        <Input
                          placeholder="측정 상황이나 특이사항"
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          className="border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    기록 저장
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 기록 히스토리 */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4">
              {records.map((record) => (
                <Card
                  key={record.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {format(record.date, "yyyy년 MM월 dd일", { locale: ko })}
                          </h3>
                          {record.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{record.notes}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-5">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Heart className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">혈압</span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                        </div>
                        {getBloodPressureStatus(record.bloodPressure.systolic, record.bloodPressure.diastolic)}
                      </div>

                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Droplets className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">혈당</span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">{record.bloodSugar}</div>
                        {getStatusBadge(record.bloodSugar, targets.bloodSugar)}
                      </div>

                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Thermometer className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">체온</span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">{record.temperature}℃</div>
                        {getStatusBadge(record.temperature, targets.temperature)}
                      </div>

                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Scale className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">체중</span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">{record.weight}kg</div>
                        {getStatusBadge(record.weight, targets.weight)}
                      </div>

                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Activity className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">심박수</span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">{record.heartRate}bpm</div>
                        {getStatusBadge(record.heartRate, targets.heartRate)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 목표 설정 */}
          <TabsContent value="targets">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>건강 목표 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">혈압 목표</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">수축기:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {targets.bloodPressure.systolic.min} - {targets.bloodPressure.systolic.max} mmHg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">이완기:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {targets.bloodPressure.diastolic.min} - {targets.bloodPressure.diastolic.max} mmHg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">평균:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {averages.systolic}/{averages.diastolic} mmHg
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">혈당 목표</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">목표 범위:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {targets.bloodSugar.min} - {targets.bloodSugar.max} mg/dL
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">평균:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{averages.bloodSugar} mg/dL</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">체온 목표</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">목표 범위:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {targets.temperature.min} - {targets.temperature.max} ℃
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">평균:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{averages.temperature} ℃</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">체중 목표</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">목표 범위:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {targets.weight.min} - {targets.weight.max} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">평균:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{averages.weight} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">심박수 목표</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">목표 범위:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {targets.heartRate.min} - {targets.heartRate.max} bpm
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">평균:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{averages.heartRate} bpm</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/30">
                      <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">💡 건강 관리 팁</h3>
                      <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                        <li>• 매일 같은 시간에 측정하세요</li>
                        <li>• 측정 전 5분간 안정을 취하세요</li>
                        <li>• 식사 후 2시간 뒤 혈당을 측정하세요</li>
                        <li>• 이상 수치가 지속되면 의사와 상담하세요</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
