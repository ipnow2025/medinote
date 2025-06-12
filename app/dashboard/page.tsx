"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, Brain, Activity, Plus, TrendingUp } from "lucide-react"
import { getUserId, isLoggedIn, goToInternalUrl } from "@/lib/func"
import { MainLayout } from "@/components/main-layout"
import { useRouter } from "next/navigation"

interface HealthSummary {
  recentRecord: string
  currentMedication: string
  recommendedQuestion: string
}

interface UpcomingAppointment {
  date: string
  hospital: string
  doctor: string
}

interface AIInsight {
  message: string
  category: string
}

interface TodayExercise {
  type: string
  duration: string
}

export default function Dashboard() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [healthSummary, setHealthSummary] = useState<HealthSummary>({
    recentRecord: "고혈압 관리",
    currentMedication: "암로디핀 5mg",
    recommendedQuestion: "혈압 변화에 대해 문의하기",
  })
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointment>({
    date: "2024년 12월 25일",
    hospital: "서울대병원",
    doctor: "김철수 의사",
  })
  const [aiInsight, setAIInsight] = useState<AIInsight>({
    message: "혈압 조절을 위한 식이요법 권장",
    category: "영양관리",
  })
  const [todayExercise, setTodayExercise] = useState<TodayExercise>({
    type: "가벼운 걷기",
    duration: "20분",
  })

  useEffect(() => {
    const uid = getUserId()
    setUserId(uid)
    if (!isLoggedIn()) {
      goToInternalUrl("/login")
    }
  }, [])

  const handleNavigate = (path: string) => {
    router.push(path)
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
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">안녕하세요! 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">오늘도 건강한 하루 되세요. 최근 건강 상태를 확인해보세요.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigate("/appointments")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">이번 달 진료</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">3회</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+1 지난달 대비</p>
            </CardContent>
          </Card>

          <Card
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigate("/medications")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">복용 약물</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">2개</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">정기 복용 중</p>
            </CardContent>
          </Card>

          <Card
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigate("/vital-check")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">평균 혈압</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">125/80</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">정상 범위</p>
            </CardContent>
          </Card>

          <Card
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleNavigate("/exercise-record")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">운동 일수</CardTitle>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12일</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">이번 달</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 오늘의 건강 요약 */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                오늘의 건강 요약
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">최근 기록</span>
                  <span className="font-medium text-gray-900 dark:text-white">{healthSummary.recentRecord}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">복용 중</span>
                  <span className="font-medium text-gray-900 dark:text-white">{healthSummary.currentMedication}</span>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">AI 추천 질문</span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{healthSummary.recommendedQuestion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 다가오는 진료 일정 */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                다가오는 진료 일정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">25일</div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">{upcomingAppointment.hospital}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{upcomingAppointment.doctor}</p>
                </div>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0"
                onClick={() => handleNavigate("/appointments")}
              >
                일정 관리
              </Button>
            </CardContent>
          </Card>

          {/* 최근 AI 인사이트 */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                최근 AI 인사이트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-xs rounded-full font-medium">
                    {aiInsight.category}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">{aiInsight.message}</p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-200 dark:border-gray-700"
                onClick={() => handleNavigate("/ai-questions")}
              >
                더 많은 인사이트 보기
              </Button>
            </CardContent>
          </Card>

          {/* 오늘의 맞춤 운동 */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                오늘의 맞춤 운동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-4xl mb-3">🚶‍♂️</div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{todayExercise.type}</h3>
                <p className="text-gray-600 dark:text-gray-400">권장 시간: {todayExercise.duration}</p>
              </div>
              <Button
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white border-0"
                onClick={() => handleNavigate("/exercise-record")}
              >
                운동 기록하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">빠른 실행</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => handleNavigate("/medical-records")}
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">진료기록 추가</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => handleNavigate("/appointments")}
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">일정 관리</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => handleNavigate("/vital-check")}
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">건강 지표</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => handleNavigate("/ai-questions")}
              >
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI 상담</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
