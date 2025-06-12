"use client"
import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Sparkles,
  RefreshCw,
  Download,
  BookOpen,
  Clock,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react"

interface MedicalRecord {
  id: number
  date: Date
  hospital: string
  doctor: string
  department: string
  diagnosis: string
  symptoms: string
  prescription: string
}

interface AIQuestion {
  id: number
  question: string
  category: string
  priority: "high" | "medium" | "low"
  basedOn: string // 어떤 진료 기록을 기반으로 생성되었는지
  isEdited: boolean
}

export default function AIQuestionsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestion[]>([
    {
      id: 1,
      question: "최근 혈압약 복용 후에도 두통과 어지러움이 지속되는데, 약물 조정이나 추가 검사가 필요한가요?",
      category: "혈압 관리",
      priority: "high",
      basedOn: "고혈압 진료 기록 (12월 10일)",
      isEdited: false,
    },
    {
      id: 2,
      question: "당뇨병과 고혈압을 동시에 관리하고 있는데, 두 질환이 서로 영향을 미치는지 궁금합니다.",
      category: "복합 질환",
      priority: "high",
      basedOn: "고혈압, 당뇨병 진료 기록",
      isEdited: false,
    },
    {
      id: 3,
      question: "메트포르민 복용 중인데 최근 피로감이 심해졌습니다. 약물과 관련이 있을까요?",
      category: "약물 부작용",
      priority: "medium",
      basedOn: "당뇨병 관리 기록 (11월 25일)",
      isEdited: false,
    },
    {
      id: 4,
      question: "무릎 관절염으로 인한 활동량 감소가 혈당 조절에 영향을 미칠 수 있나요?",
      category: "운동 관리",
      priority: "medium",
      basedOn: "관절염, 당뇨병 기록 분석",
      isEdited: false,
    },
    {
      id: 5,
      question: "현재 복용 중인 암로디핀, 메트포르민, 이부프로펜 간의 상호작용이 있는지 확인해주세요.",
      category: "약물 상호작용",
      priority: "high",
      basedOn: "전체 처방 기록 분석",
      isEdited: false,
    },
    {
      id: 6,
      question: "체중 감소 증상이 당뇨병 악화의 신호일 수 있나요? 추가 검사가 필요한가요?",
      category: "증상 분석",
      priority: "medium",
      basedOn: "당뇨병 증상 기록",
      isEdited: false,
    },
  ])
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  // 목업 진료 기록 데이터 (실제로는 API에서 가져옴)
  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: 1,
      date: new Date("2024-12-10"),
      hospital: "서울대병원",
      doctor: "김철수",
      department: "내과",
      diagnosis: "고혈압",
      symptoms: "두통, 어지러움, 목 뒤 뻣뻣함",
      prescription: "암로디핀 5mg, 1일 1회",
    },
    {
      id: 2,
      date: new Date("2024-11-25"),
      hospital: "연세병원",
      doctor: "이영희",
      department: "내분비내과",
      diagnosis: "당뇨병 관리",
      symptoms: "갈증, 피로감, 체중 감소",
      prescription: "메트포르민 500mg, 1일 2회",
    },
    {
      id: 3,
      date: new Date("2024-11-10"),
      hospital: "삼성서울병원",
      doctor: "박민수",
      department: "정형외과",
      diagnosis: "무릎 관절염",
      symptoms: "무릎 통증, 계단 오르내리기 어려움",
      prescription: "이부프로fen 200mg, 1일 3회",
    },
  ])

  // AI 질문 생성 함수
  const generateAIQuestions = async () => {
    setIsGenerating(true)

    // 실제로는 AI API 호출
    setTimeout(() => {
      const newQuestions: AIQuestion[] = [
        {
          id: 1,
          question: "최근 혈압약 복용 후에도 두통과 어지러움이 지속되는데, 약물 조정이나 추가 검사가 필요한가요?",
          category: "혈압 관리",
          priority: "high",
          basedOn: "고혈압 진료 기록 (12월 10일)",
          isEdited: false,
        },
        {
          id: 2,
          question: "당뇨병과 고혈압을 동시에 관리하고 있는데, 두 질환이 서로 영향을 미치는지 궁금합니다.",
          category: "복합 질환",
          priority: "high",
          basedOn: "고혈압, 당뇨병 진료 기록",
          isEdited: false,
        },
        {
          id: 3,
          question: "메트포르민 복용 중인데 최근 피로감이 심해졌습니다. 약물과 관련이 있을까요?",
          category: "약물 부작용",
          priority: "medium",
          basedOn: "당뇨병 관리 기록 (11월 25일)",
          isEdited: false,
        },
        {
          id: 4,
          question: "무릎 관절염으로 인한 활동량 감소가 혈당 조절에 영향을 미칠 수 있나요?",
          category: "운동 관리",
          priority: "medium",
          basedOn: "관절염, 당뇨병 기록 분석",
          isEdited: false,
        },
        {
          id: 5,
          question: "현재 복용 중인 암로디핀, 메트포르민, 이부프로펜 간의 상호작용이 있는지 확인해주세요.",
          category: "약물 상호작용",
          priority: "high",
          basedOn: "전체 처방 기록 분석",
          isEdited: false,
        },
        {
          id: 6,
          question: "체중 감소 증상이 당뇨병 악화의 신호일 수 있나요? 추가 검사가 필요한가요?",
          category: "증상 분석",
          priority: "medium",
          basedOn: "당뇨병 증상 기록",
          isEdited: false,
        },
      ]

      setGeneratedQuestions(newQuestions)
      setIsGenerating(false)
    }, 2000)
  }

  const handleEditQuestion = (questionId: number) => {
    const question = generatedQuestions.find((q) => q.id === questionId)
    if (question) {
      setEditingQuestion(questionId)
      setEditText(question.question)
    }
  }

  const handleSaveEdit = (questionId: number) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, question: editText, isEdited: true } : q)),
    )
    setEditingQuestion(null)
    setEditText("")
  }

  const handleDeleteQuestion = (questionId: number) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  const handleExportQuestions = () => {
    const text = generatedQuestions
      .map((q, index) => `${index + 1}. ${q.question}\n   (기반: ${q.basedOn})`)
      .join("\n\n")

    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "AI_생성_진료_질문.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "중요"
      case "medium":
        return "보통"
      case "low":
        return "참고"
      default:
        return "보통"
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI 추천 질문</h1>
            <p className="text-gray-600 dark:text-gray-400">진료 기록을 분석하여 생성된 맞춤형 질문입니다.</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={generateAIQuestions}
              disabled={isGenerating}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI 질문 생성
                </>
              )}
            </Button>
            {generatedQuestions.length > 0 && (
              <Button
                variant="outline"
                onClick={handleExportQuestions}
                className="border-gray-200 dark:border-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            )}
          </div>
        </div>

        {/* 진료 기록 분석 현황 */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg text-gray-900 dark:text-white">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span>진료 기록 분석 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">분석된 기록</span>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{medicalRecords.length}건</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">최근 3개월</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">주요 진단</span>
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">고혈압, 당뇨</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">지속 관리 필요</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">복용 약물</span>
                  <Brain className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">3종</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">상호작용 검토</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI 생성 질문 목록 */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI 생성 질문 ({generatedQuestions.length}개)
              </h2>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
                진료 기록 기반 맞춤 생성
              </Badge>
            </div>

            <div className="grid gap-4">
              {generatedQuestions.map((question, index) => (
                <Card
                  key={question.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        {editingQuestion === question.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="border-gray-200 dark:border-gray-700"
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(question.id)}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                              >
                                저장
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingQuestion(null)}
                                className="border-gray-200 dark:border-gray-700"
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
                              {question.question}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(question.priority)}>
                                  {getPriorityText(question.priority)}
                                </Badge>
                                <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                                  {question.category}
                                </Badge>
                                {question.isEdited && (
                                  <Badge
                                    variant="outline"
                                    className="border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400"
                                  >
                                    수정됨
                                  </Badge>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditQuestion(question.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1">
                              <span className="font-medium">분석 기반:</span> {question.basedOn}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 사용 가이드 */}
        <Card className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <BookOpen className="h-5 w-5" />
              <span>AI 질문 생성 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">🤖 AI 분석 기능</h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• 진료 기록의 패턴과 연관성 분석</li>
                  <li>• 복용 약물 간 상호작용 검토</li>
                  <li>• 증상 변화 추이 기반 질문 생성</li>
                  <li>• 개인 맞춤형 건강 관리 질문 제안</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">💡 효과적인 활용</h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• 생성된 질문을 검토하고 필요시 수정</li>
                  <li>• 중요도가 높은 질문부터 우선 확인</li>
                  <li>• 진료 전 질문 목록을 미리 출력</li>
                  <li>• 의사의 답변을 기록하여 관리</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
