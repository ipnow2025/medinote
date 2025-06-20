"use client"
import { useState } from "react"
import type React from "react"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, FileText, CalendarIcon, Hospital, Search, Edit, Trash2, Eye, Filter, Activity } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MedicalRecord {
  id: number
  date: Date
  hospital: string
  doctor: string
  department: string
  diagnosis: string
  symptoms: string
  testResults: string
  prescription: string
  notes: string
  severity: "low" | "medium" | "high"
}

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState("list")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")

  // 폼 상태
  const [formData, setFormData] = useState({
    date: new Date(),
    hospital: "",
    doctor: "",
    department: "",
    diagnosis: "",
    symptoms: "",
    testResults: "",
    prescription: "",
    notes: "",
  })

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null)

  // 목업 데이터
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: 1,
      date: new Date("2024-12-10"),
      hospital: "서울대병원",
      doctor: "김철수",
      department: "내과",
      diagnosis: "고혈압",
      symptoms: "두통, 어지러움, 목 뒤 뻣뻣함",
      testResults: "혈압 140/90, 심전도 정상",
      prescription: "암로디핀 5mg, 1일 1회",
      notes: "식이요법 병행 필요, 2주 후 재검진",
      severity: "medium",
    },
    {
      id: 2,
      date: new Date("2024-11-25"),
      hospital: "연세병원",
      doctor: "이영희",
      department: "내분비내과",
      diagnosis: "당뇨병 관리",
      symptoms: "갈증, 피로감, 체중 감소",
      testResults: "공복혈당 130mg/dL, HbA1c 7.2%",
      prescription: "메트포르민 500mg, 1일 2회",
      notes: "혈당 자가측정 시작, 운동요법 권장",
      severity: "high",
    },
    {
      id: 3,
      date: new Date("2024-11-10"),
      hospital: "삼성서울병원",
      doctor: "박민수",
      department: "정형외과",
      diagnosis: "무릎 관절염",
      symptoms: "무릎 통증, 계단 오르내리기 어려움",
      testResults: "X-ray 상 경미한 관절 간격 감소",
      prescription: "이부프로fen 200mg, 1일 3회",
      notes: "물리치료 병행, 체중 관리 필요",
      severity: "low",
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

    if (editingRecord) {
      // 수정 모드
      const updatedRecord: MedicalRecord = {
        ...editingRecord,
        ...formData,
      }
      setRecords((prev) => prev.map((record) => (record.id === editingRecord.id ? updatedRecord : record)))
      setEditingRecord(null)
    } else {
      // 새 기록 추가
      const newRecord: MedicalRecord = {
        id: records.length + 1,
        ...formData,
        severity: "medium" as const,
      }
      setRecords((prev) => [newRecord, ...prev])
    }

    // 폼 초기화
    setFormData({
      date: new Date(),
      hospital: "",
      doctor: "",
      department: "",
      diagnosis: "",
      symptoms: "",
      testResults: "",
      prescription: "",
      notes: "",
    })

    // 목록 탭으로 이동
    setActiveTab("list")
  }

  const handleViewDetail = (record: MedicalRecord) => {
    setSelectedRecord(record)
    setShowDetailModal(true)
  }

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record)
    setFormData({
      date: record.date,
      hospital: record.hospital,
      doctor: record.doctor,
      department: record.department,
      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      testResults: record.testResults,
      prescription: record.prescription,
      notes: record.notes,
    })
    setActiveTab("add")
  }

  const handleDeleteClick = (record: MedicalRecord) => {
    setRecordToDelete(record)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      setRecords((prev) => prev.filter((record) => record.id !== recordToDelete.id))
      setRecordToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  const handleCancelEdit = () => {
    setEditingRecord(null)
    setFormData({
      date: new Date(),
      hospital: "",
      doctor: "",
      department: "",
      diagnosis: "",
      symptoms: "",
      testResults: "",
      prescription: "",
      notes: "",
    })
    setActiveTab("list")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "중요"
      case "medium":
        return "보통"
      case "low":
        return "경미"
      default:
        return "보통"
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || record.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(records.map((record) => record.department)))

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">진료 기록 관리</h1>
            <p className="text-gray-600 dark:text-gray-400">진료 기록을 체계적으로 관리하고 추적하세요.</p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 진료 기록</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{records.length}건</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">전체 기록</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">이번 달</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">2건</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">12월 진료</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">주요 병원</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Hospital className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">3곳</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">정기 방문</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">중요 진료</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1건</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">추적 필요</p>
            </CardContent>
          </Card>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="list" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              진료 기록 목록
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              새 진료 기록 추가
            </TabsTrigger>
          </TabsList>

          {/* 진료 기록 목록 */}
          <TabsContent value="list" className="space-y-6">
            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="진단명, 병원명, 의사명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 dark:border-gray-700"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-48 border-gray-200 dark:border-gray-700">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="진료과 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 진료과</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 진료 기록 목록 */}
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card
                  key={record.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{record.diagnosis}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {record.hospital} • {record.department} • {record.doctor} 의사
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(record.severity)}>{getSeverityText(record.severity)}</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {format(record.date, "yyyy.MM.dd", { locale: ko })}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">증상</Label>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">{record.symptoms}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">검사 결과</Label>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">{record.testResults}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">처방</Label>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">{record.prescription}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">메모</Label>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">{record.notes}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 dark:border-gray-700"
                        onClick={() => handleViewDetail(record)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        상세보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 dark:border-gray-700"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/10"
                        onClick={() => handleDeleteClick(record)}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        삭제
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 새 진료 기록 추가 */}
          <TabsContent value="add">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>{editingRecord ? "진료 기록 수정" : "진료 기록 입력"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        진료 날짜
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
                    <div className="space-y-2">
                      <Label htmlFor="hospital" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        병원명
                      </Label>
                      <Input
                        id="hospital"
                        placeholder="병원명 입력"
                        value={formData.hospital}
                        onChange={(e) => handleInputChange("hospital", e.target.value)}
                        className="border-gray-200 dark:border-gray-700"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="doctor" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        담당의
                      </Label>
                      <Input
                        id="doctor"
                        placeholder="담당의 이름"
                        value={formData.doctor}
                        onChange={(e) => handleInputChange("doctor", e.target.value)}
                        className="border-gray-200 dark:border-gray-700"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        진료과
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-700">
                          <SelectValue placeholder="진료과 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                          <SelectItem value="가정의학과">가정의학과</SelectItem>
                          <SelectItem value="간담도췌외과">간담도췌외과</SelectItem>
                          <SelectItem value="간이식·간담도외과">간이식·간담도외과</SelectItem>
                          <SelectItem value="감염내과">감염내과</SelectItem>
                          <SelectItem value="건강의학과">건강의학과</SelectItem>
                          <SelectItem value="구강악안면외과">구강악안면외과</SelectItem>
                          <SelectItem value="내과">내과</SelectItem>
                          <SelectItem value="내분비내과">내분비내과</SelectItem>
                          <SelectItem value="내분비외과">내분비외과</SelectItem>
                          <SelectItem value="노년내과">노년내과</SelectItem>
                          <SelectItem value="대장항문외과">대장항문외과</SelectItem>
                          <SelectItem value="류마티스내과">류마티스내과</SelectItem>
                          <SelectItem value="마취통증의학과">마취통증의학과</SelectItem>
                          <SelectItem value="방사선종양학과">방사선종양학과</SelectItem>
                          <SelectItem value="병리과">병리과</SelectItem>
                          <SelectItem value="비뇨의학과">비뇨의학과</SelectItem>
                          <SelectItem value="산부인과">산부인과</SelectItem>
                          <SelectItem value="성형외과">성형외과</SelectItem>
                          <SelectItem value="소화기내과">소화기내과</SelectItem>
                          <SelectItem value="수부외과">수부외과</SelectItem>
                          <SelectItem value="신·췌장이식외과">신·췌장이식외과</SelectItem>
                          <SelectItem value="신경과">신경과</SelectItem>
                          <SelectItem value="신경외과">신경외과</SelectItem>
                          <SelectItem value="신장내과">신장내과</SelectItem>
                          <SelectItem value="심장내과">심장내과</SelectItem>
                          <SelectItem value="심장외과">심장외과</SelectItem>
                          <SelectItem value="심장혈관흉부외과">심장혈관흉부외과</SelectItem>
                          <SelectItem value="안과">안과</SelectItem>
                          <SelectItem value="알레르기내과">알레르기내과</SelectItem>
                          <SelectItem value="영상의학과">영상의학과</SelectItem>
                          <SelectItem value="위장관외과">위장관외과</SelectItem>
                          <SelectItem value="유방외과">유방외과</SelectItem>
                          <SelectItem value="응급의학과">응급의학과</SelectItem>
                          <SelectItem value="이비인후과">이비인후과</SelectItem>
                          <SelectItem value="임상약리학과">임상약리학과</SelectItem>
                          <SelectItem value="재활의학과">재활의학과</SelectItem>
                          <SelectItem value="정신건강의학과">정신건강의학과</SelectItem>
                          <SelectItem value="정형외과">정형외과</SelectItem>
                          <SelectItem value="중환자과">중환자과</SelectItem>
                          <SelectItem value="중환자·외상외과">중환자·외상외과</SelectItem>
                          <SelectItem value="진단검사의학과">진단검사의학과</SelectItem>
                          <SelectItem value="치과">치과</SelectItem>
                          <SelectItem value="치과 교정과">치과 교정과</SelectItem>
                          <SelectItem value="치과 보존과">치과 보존과</SelectItem>
                          <SelectItem value="치과 보철과">치과 보철과</SelectItem>
                          <SelectItem value="치주과">치주과</SelectItem>
                          <SelectItem value="폐식도외과">폐식도외과</SelectItem>
                          <SelectItem value="피부과">피부과</SelectItem>
                          <SelectItem value="핵의학과">핵의학과</SelectItem>
                          <SelectItem value="혈관외과">혈관외과</SelectItem>
                          <SelectItem value="혈액내과">혈액내과</SelectItem>
                          <SelectItem value="호흡기내과">호흡기내과</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      병명/진단명
                    </Label>
                    <Input
                      id="diagnosis"
                      placeholder="병명 입력"
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                      className="border-gray-200 dark:border-gray-700"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      증상
                    </Label>
                    <Textarea
                      id="symptoms"
                      placeholder="증상 상세 입력"
                      value={formData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      rows={3}
                      className="border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testResults" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      검사 결과
                    </Label>
                    <Input
                      id="testResults"
                      placeholder="검사 결과 입력"
                      value={formData.testResults}
                      onChange={(e) => handleInputChange("testResults", e.target.value)}
                      className="border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      처방 약품
                    </Label>
                    <Input
                      id="prescription"
                      placeholder="처방 약품 입력"
                      value={formData.prescription}
                      onChange={(e) => handleInputChange("prescription", e.target.value)}
                      className="border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      진료 메모
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="진료 메모"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={3}
                      className="border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      {editingRecord ? "수정하기" : "저장하기"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={editingRecord ? handleCancelEdit : () => setActiveTab("list")}
                      className="border-gray-200 dark:border-gray-700"
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 상세보기 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span>진료 기록 상세보기</span>
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-3">기본 정보</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-600">진료 날짜:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-900">
                        {format(selectedRecord.date, "yyyy년 MM월 dd일", { locale: ko })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-600">병원:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-900">{selectedRecord.hospital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-600">담당의:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-900">{selectedRecord.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-600">진료과:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-900">{selectedRecord.department}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-3">진단 정보</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-600">진단명:</span>
                      <p className="font-medium text-gray-900 dark:text-gray-900 mt-1">{selectedRecord.diagnosis}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-600">중요도:</span>
                      <div className="mt-1">
                        <Badge className={getSeverityColor(selectedRecord.severity)}>
                          {getSeverityText(selectedRecord.severity)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">증상</h3>
                  <p className="text-gray-800 dark:text-gray-800">{selectedRecord.symptoms}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">검사 결과</h3>
                  <p className="text-gray-800 dark:text-gray-800">{selectedRecord.testResults}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">처방</h3>
                  <p className="text-gray-800 dark:text-gray-800">{selectedRecord.prescription}</p>
                </div>
                {selectedRecord.notes && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-900 mb-2">진료 메모</h3>
                    <p className="text-gray-800 dark:text-gray-800">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-300">
                <Button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEdit(selectedRecord)
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  수정하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false)
                    handleDeleteClick(selectedRecord)
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제하기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span>진료 기록 삭제</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              <strong>"{recordToDelete?.diagnosis}"</strong> 진료 기록을 정말 삭제하시겠습니까?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">삭제된 기록은 복구할 수 없습니다.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
