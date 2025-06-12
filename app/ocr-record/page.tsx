"use client"
import { useState, useRef } from "react"
import type React from "react"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ScanText,
  Upload,
  Camera,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  Save,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Clock,
  FileText,
  Pill,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
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

interface UploadedFile {
  id: string
  file: File
  preview: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
}

interface OCRResult {
  id: string
  fileName: string
  uploadDate: Date
  type: "prescription" | "receipt" | "medical_record"
  status: "processing" | "completed" | "error"
  extractedData: {
    hospitalName?: string
    doctorName?: string
    department?: string
    visitDate?: string
    diagnosis?: string
    medications?: Array<{
      name: string
      dosage: string
      frequency: string
      days: string
    }>
    totalAmount?: string
    notes?: string
  }
  originalImage: string
}

export default function OCRAutoRecordPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [ocrResults, setOCRResults] = useState<OCRResult[]>([
    // 목업 데이터
    {
      id: "1",
      fileName: "처방전_20241212.jpg",
      uploadDate: new Date("2024-12-12"),
      type: "prescription",
      status: "completed",
      extractedData: {
        hospitalName: "서울대학교병원",
        doctorName: "김철수",
        department: "내과",
        visitDate: "2024-12-12",
        diagnosis: "고혈압",
        medications: [
          {
            name: "암로디핀",
            dosage: "5mg",
            frequency: "1일 1회",
            days: "30일분",
          },
          {
            name: "메트포르민",
            dosage: "500mg",
            frequency: "1일 2회",
            days: "30일분",
          },
        ],
        notes: "식후 복용",
      },
      originalImage: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "2",
      fileName: "영수증_20241211.jpg",
      uploadDate: new Date("2024-12-11"),
      type: "receipt",
      status: "completed",
      extractedData: {
        hospitalName: "연세세브란스병원",
        visitDate: "2024-12-11",
        totalAmount: "15,000원",
        notes: "진료비 및 약값",
      },
      originalImage: "/placeholder.svg?height=400&width=300",
    },
  ])
  const [selectedResult, setSelectedResult] = useState<OCRResult | null>(null)
  const [editingResult, setEditingResult] = useState<OCRResult | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [resultToDelete, setResultToDelete] = useState<OCRResult | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // 파일 업로드 처리
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)

        const newFile: UploadedFile = {
          id,
          file,
          preview,
          status: "uploading",
          progress: 0,
        }

        setUploadedFiles((prev) => [...prev, newFile])

        // 업로드 시뮬레이션
        simulateUpload(id)
      }
    })
  }

  // 업로드 및 OCR 처리 시뮬레이션
  const simulateUpload = (fileId: string) => {
    // 업로드 진행률 시뮬레이션
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += 10
      setUploadedFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)))

      if (progress >= 100) {
        clearInterval(uploadInterval)
        setUploadedFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, status: "processing" } : file)))

        // OCR 처리 시뮬레이션
        setTimeout(() => {
          const file = uploadedFiles.find((f) => f.id === fileId)
          if (file) {
            const newResult: OCRResult = {
              id: fileId,
              fileName: file.file.name,
              uploadDate: new Date(),
              type: "prescription",
              status: "completed",
              extractedData: {
                hospitalName: "자동 인식된 병원명",
                doctorName: "자동 인식된 의사명",
                department: "내과",
                visitDate: format(new Date(), "yyyy-MM-dd"),
                diagnosis: "자동 인식된 진단명",
                medications: [
                  {
                    name: "자동 인식된 약물명",
                    dosage: "5mg",
                    frequency: "1일 1회",
                    days: "30일분",
                  },
                ],
                notes: "자동 인식된 메모",
              },
              originalImage: file.preview,
            }

            setOCRResults((prev) => [newResult, ...prev])
            setUploadedFiles((prev) =>
              prev.map((file) => (file.id === fileId ? { ...file, status: "completed" } : file)),
            )
          }
        }, 3000)
      }
    }, 200)
  }

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  // 결과 수정
  const handleEditResult = (result: OCRResult) => {
    setEditingResult(result)
    setActiveTab("edit")
  }

  // 결과 저장
  const handleSaveResult = (resultId: string, saveType: "medical_record" | "medication") => {
    // 실제로는 API 호출하여 진료기록 또는 약물정보로 저장
    console.log(`Saving result ${resultId} as ${saveType}`)
    // 성공 메시지 표시 등
  }

  // 결과 삭제
  const handleDeleteResult = (result: OCRResult) => {
    setResultToDelete(result)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (resultToDelete) {
      setOCRResults((prev) => prev.filter((result) => result.id !== resultToDelete.id))
      setUploadedFiles((prev) => prev.filter((file) => file.id !== resultToDelete.id))
      setResultToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  // 재처리
  const handleReprocess = (resultId: string) => {
    setOCRResults((prev) =>
      prev.map((result) => (result.id === resultId ? { ...result, status: "processing" } : result)),
    )

    setTimeout(() => {
      setOCRResults((prev) =>
        prev.map((result) => (result.id === resultId ? { ...result, status: "completed" } : result)),
      )
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료"
      case "processing":
        return "처리중"
      case "error":
        return "오류"
      default:
        return "대기"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prescription":
        return <Pill className="h-5 w-5" />
      case "receipt":
        return <FileText className="h-5 w-5" />
      case "medical_record":
        return <FileText className="h-5 w-5" />
      default:
        return <FileImage className="h-5 w-5" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "prescription":
        return "처방전"
      case "receipt":
        return "영수증"
      case "medical_record":
        return "진료기록"
      default:
        return "기타"
    }
  }

  return (
    <MainLayout>
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">OCR 자동 기록</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              처방전, 영수증 사진을 업로드하면 자동으로 정보를 인식하여 기록합니다.
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 처리 건수</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <ScanText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{ocrResults.length}건</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">전체 처리</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">처방전</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Pill className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {ocrResults.filter((r) => r.type === "prescription").length}건
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">약물 정보</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">영수증</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {ocrResults.filter((r) => r.type === "receipt").length}건
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">진료비 기록</p>
            </CardContent>
          </Card>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 h-14">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              파일 업로드
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              처리 결과
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
              disabled={!editingResult}
            >
              결과 수정
            </TabsTrigger>
          </TabsList>

          {/* 파일 업로드 */}
          <TabsContent value="upload" className="space-y-8">
            {/* 업로드 영역 */}
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <Upload className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>이미지 업로드</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-orange-400 bg-orange-50 dark:bg-orange-900/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        처방전 또는 영수증 사진을 업로드하세요
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        파일을 드래그하여 놓거나 클릭하여 선택하세요
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 text-base"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        파일 선택
                      </Button>
                      <Button variant="outline" className="border-gray-200 dark:border-gray-700 h-12 px-8 text-base">
                        <Camera className="mr-2 h-5 w-5" />
                        카메라로 촬영
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">지원 형식: JPG, PNG, HEIC (최대 10MB)</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </CardContent>
            </Card>

            {/* 업로드 진행 상황 */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>처리 진행 상황</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{file.file.name}</h4>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{file.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.status === "processing" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                        {file.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {file.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        <Badge className={getStatusColor(file.status)}>{getStatusText(file.status)}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 처리 결과 */}
          <TabsContent value="results" className="space-y-6">
            {ocrResults.map((result) => (
              <Card
                key={result.id}
                className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={result.originalImage || "/placeholder.svg"}
                        alt={result.fileName}
                        className="w-24 h-32 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{result.fileName}</h3>
                          <Badge className={getStatusColor(result.status)}>{getStatusText(result.status)}</Badge>
                          <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(result.type)}
                              <span>{getTypeText(result.type)}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="space-y-2 text-base text-gray-600 dark:text-gray-400">
                          <p>업로드: {format(result.uploadDate, "yyyy년 MM월 dd일 HH:mm", { locale: ko })}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedResult(result)}
                        className="h-10 w-10 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditResult(result)}
                        className="h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReprocess(result.id)}
                        className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/10"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteResult(result)}
                        className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {result.status === "completed" && (
                    <div className="space-y-6">
                      {/* 인식된 정보 */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">기본 정보</h4>
                          <div className="space-y-3">
                            {result.extractedData.hospitalName && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">병원명:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {result.extractedData.hospitalName}
                                </span>
                              </div>
                            )}
                            {result.extractedData.doctorName && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">담당의:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {result.extractedData.doctorName}
                                </span>
                              </div>
                            )}
                            {result.extractedData.department && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">진료과:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {result.extractedData.department}
                                </span>
                              </div>
                            )}
                            {result.extractedData.visitDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">진료일:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {result.extractedData.visitDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">진료 정보</h4>
                          <div className="space-y-3">
                            {result.extractedData.diagnosis && (
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">진단명:</span>
                                <p className="font-medium text-gray-900 dark:text-white mt-1">
                                  {result.extractedData.diagnosis}
                                </p>
                              </div>
                            )}
                            {result.extractedData.totalAmount && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">진료비:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {result.extractedData.totalAmount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 처방 약물 */}
                      {result.extractedData.medications && result.extractedData.medications.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">처방 약물</h4>
                          <div className="grid gap-4">
                            {result.extractedData.medications.map((med, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                              >
                                <div className="grid gap-3 md:grid-cols-4">
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">약물명</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{med.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">용량</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{med.dosage}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">복용법</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{med.frequency}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">처방일수</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{med.days}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 메모 */}
                      {result.extractedData.notes && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">메모</h4>
                          <p className="text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {result.extractedData.notes}
                          </p>
                        </div>
                      )}

                      {/* 저장 옵션 */}
                      <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          onClick={() => handleSaveResult(result.id, "medical_record")}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          진료기록으로 저장
                        </Button>
                        {result.extractedData.medications && result.extractedData.medications.length > 0 && (
                          <Button
                            onClick={() => handleSaveResult(result.id, "medication")}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Pill className="mr-2 h-4 w-4" />
                            약물정보로 저장
                          </Button>
                        )}
                        <Button variant="outline" className="border-gray-200 dark:border-gray-700">
                          <Download className="mr-2 h-4 w-4" />
                          결과 다운로드
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {ocrResults.length === 0 && (
              <Card className="bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ScanText className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">처리된 결과가 없습니다</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    처방전이나 영수증 사진을 업로드하여 자동 인식을 시작해보세요.
                  </p>
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 text-base"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    파일 업로드하기
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 결과 수정 */}
          <TabsContent value="edit">
            {editingResult && (
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                      <Edit className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>인식 결과 수정</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">병원명</Label>
                        <Input
                          defaultValue={editingResult.extractedData.hospitalName}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">담당의</Label>
                        <Input
                          defaultValue={editingResult.extractedData.doctorName}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">진료과</Label>
                        <Select defaultValue={editingResult.extractedData.department}>
                          <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="내과">내과</SelectItem>
                            <SelectItem value="외과">외과</SelectItem>
                            <SelectItem value="정형외과">정형외과</SelectItem>
                            <SelectItem value="신경과">신경과</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">진료일</Label>
                        <Input
                          type="date"
                          defaultValue={editingResult.extractedData.visitDate}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">진단명</Label>
                        <Input
                          defaultValue={editingResult.extractedData.diagnosis}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">진료비</Label>
                        <Input
                          defaultValue={editingResult.extractedData.totalAmount}
                          className="border-gray-200 dark:border-gray-700 h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">메모</Label>
                    <Textarea
                      defaultValue={editingResult.extractedData.notes}
                      rows={4}
                      className="border-gray-200 dark:border-gray-700 text-base"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg">
                      <Save className="mr-2 h-6 w-6" />
                      수정 내용 저장
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingResult(null)
                        setActiveTab("results")
                      }}
                      className="border-gray-200 dark:border-gray-700 h-14 px-8 text-lg"
                    >
                      취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* 사용 가이드 */}
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl text-orange-800 dark:text-orange-200">
              <ScanText className="h-6 w-6" />
              <span>OCR 자동 인식 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">📸 촬영 팁</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 충분한 조명에서 촬영하세요</li>
                  <li>• 문서 전체가 화면에 들어오도록 하세요</li>
                  <li>• 그림자나 반사를 피해주세요</li>
                  <li>• 흔들림 없이 선명하게 촬영하세요</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">🔍 인식 정확도 향상</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 접힌 부분이 없도록 펼쳐서 촬영하세요</li>
                  <li>• 글자가 선명하게 보이는지 확인하세요</li>
                  <li>• 인식 결과를 확인하고 필요시 수정하세요</li>
                  <li>• 정확도가 낮으면 재처리를 시도해보세요</li>
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
              <span>처리 결과 삭제</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              <strong>"{resultToDelete?.fileName}"</strong> 처리 결과를 정말 삭제하시겠습니까?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">삭제된 결과는 복구할 수 없습니다.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 px-6 text-base">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
