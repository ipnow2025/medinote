"use client"
import { useState } from "react"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dumbbell,
  Play,
  CheckCircle,
  Target,
  Clock,
  Flame,
  Heart,
  Activity,
  Plus,
  RotateCcw,
  Star,
  Timer,
  Users,
  Zap,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface ExerciseRecommendation {
  id: number
  name: string
  type: "cardio" | "strength" | "flexibility" | "balance"
  duration: number // 분
  difficulty: "beginner" | "intermediate" | "advanced"
  calories: number
  description: string
  instructions: string[]
  videoUrl?: string
  equipment: string[]
  targetMuscles: string[]
  benefits: string[]
  isCompleted: boolean
  completedAt?: Date
}

interface ExerciseLog {
  id: number
  exerciseId: number
  exerciseName: string
  date: Date
  duration: number
  calories: number
  difficulty: string
  notes?: string
  rating: number
}

interface WeeklyGoal {
  totalMinutes: number
  completedMinutes: number
  totalCalories: number
  burnedCalories: number
  exerciseDays: number
  completedDays: number
}

export default function AIExerciseRecommendationPage() {
  const [activeTab, setActiveTab] = useState("today")
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRecommendation | null>(null)

  // 사용자 프로필 (실제로는 API에서 가져옴)
  const [userProfile] = useState({
    age: 45,
    weight: 70,
    height: 170,
    fitnessLevel: "beginner",
    healthConditions: ["고혈압", "당뇨병"],
    goals: ["체중감량", "혈압관리", "근력향상"],
    availableTime: 30, // 분
    preferredExercises: ["걷기", "요가", "수영"],
  })

  // 주간 목표
  const [weeklyGoal] = useState<WeeklyGoal>({
    totalMinutes: 150,
    completedMinutes: 85,
    totalCalories: 800,
    burnedCalories: 520,
    exerciseDays: 5,
    completedDays: 3,
  })

  // 오늘의 추천 운동
  const [todayRecommendations, setTodayRecommendations] = useState<ExerciseRecommendation[]>([
    {
      id: 1,
      name: "가벼운 걷기",
      type: "cardio",
      duration: 20,
      difficulty: "beginner",
      calories: 80,
      description: "혈압 관리에 도움이 되는 저강도 유산소 운동입니다.",
      instructions: [
        "편안한 운동화를 착용하세요",
        "5분간 천천히 워밍업하세요",
        "일정한 속도로 15분간 걸으세요",
        "마지막 5분은 천천히 쿨다운하세요",
      ],
      videoUrl: "https://example.com/walking-video",
      equipment: ["운동화"],
      targetMuscles: ["하체", "심폐지구력"],
      benefits: ["혈압 개선", "심혈관 건강", "체중 관리"],
      isCompleted: false,
    },
    {
      id: 2,
      name: "의자 요가",
      type: "flexibility",
      duration: 15,
      difficulty: "beginner",
      calories: 45,
      description: "관절 유연성을 높이고 스트레스를 완화하는 운동입니다.",
      instructions: [
        "편안한 의자에 앉으세요",
        "목과 어깨를 천천히 돌려주세요",
        "상체를 좌우로 비틀어주세요",
        "다리를 번갈아 들어올려주세요",
      ],
      equipment: ["의자"],
      targetMuscles: ["전신", "코어"],
      benefits: ["유연성 향상", "스트레스 완화", "자세 개선"],
      isCompleted: true,
      completedAt: new Date("2024-12-12 09:30"),
    },
    {
      id: 3,
      name: "벽 팔굽혀펴기",
      type: "strength",
      duration: 10,
      difficulty: "beginner",
      calories: 35,
      description: "상체 근력을 기르는 안전한 근력 운동입니다.",
      instructions: [
        "벽에서 팔 길이만큼 떨어져 서세요",
        "벽에 손바닥을 대고 팔굽혀펴기 자세를 취하세요",
        "천천히 벽을 밀었다 당겼다 반복하세요",
        "10-15회씩 3세트 실시하세요",
      ],
      equipment: ["벽"],
      targetMuscles: ["가슴", "어깨", "팔"],
      benefits: ["상체 근력", "자세 개선", "뼈 건강"],
      isCompleted: false,
    },
  ])

  // 운동 기록
  const [exerciseLogs] = useState<ExerciseLog[]>([
    {
      id: 1,
      exerciseId: 2,
      exerciseName: "의자 요가",
      date: new Date("2024-12-12"),
      duration: 15,
      calories: 45,
      difficulty: "beginner",
      rating: 5,
    },
    {
      id: 2,
      exerciseId: 1,
      exerciseName: "가벼운 걷기",
      date: new Date("2024-12-11"),
      duration: 25,
      calories: 100,
      difficulty: "beginner",
      rating: 4,
      notes: "날씨가 좋아서 5분 더 걸었습니다.",
    },
    {
      id: 3,
      exerciseId: 3,
      exerciseName: "벽 팔굽혀펴기",
      date: new Date("2024-12-10"),
      duration: 12,
      calories: 40,
      difficulty: "beginner",
      rating: 3,
    },
  ])

  // 운동 완료 처리
  const handleCompleteExercise = (exerciseId: number) => {
    setTodayRecommendations((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, isCompleted: !exercise.isCompleted, completedAt: new Date() }
          : exercise,
      ),
    )
  }

  // 새로운 추천 생성
  const generateNewRecommendations = () => {
    // 실제로는 AI API 호출
    console.log("Generating new recommendations based on user profile...")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cardio":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      case "strength":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
      case "flexibility":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      case "balance":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "cardio":
        return "유산소"
      case "strength":
        return "근력"
      case "flexibility":
        return "유연성"
      case "balance":
        return "균형"
      default:
        return "기타"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      case "intermediate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "초급"
      case "intermediate":
        return "중급"
      case "advanced":
        return "고급"
      default:
        return "기타"
    }
  }

  const completionRate = Math.round((weeklyGoal.completedMinutes / weeklyGoal.totalMinutes) * 100)
  const calorieRate = Math.round((weeklyGoal.burnedCalories / weeklyGoal.totalCalories) * 100)

  return (
    <MainLayout>
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">AI 맞춤 운동 추천</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              개인 건강 상태에 맞춘 안전하고 효과적인 운동을 추천받으세요.
            </p>
          </div>
          <Button
            onClick={generateNewRecommendations}
            className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-6 text-base"
          >
            <RotateCcw className="mr-2 h-5 w-5" />새 추천 받기
          </Button>
        </div>

        {/* 주간 목표 진행률 */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span>이번 주 운동 목표</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">운동 시간</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {weeklyGoal.completedMinutes}/{weeklyGoal.totalMinutes}분
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{completionRate}% 달성</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">칼로리 소모</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {weeklyGoal.burnedCalories}/{weeklyGoal.totalCalories}kcal
                  </span>
                </div>
                <Progress value={calorieRate} className="h-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{calorieRate}% 달성</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">운동 일수</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {weeklyGoal.completedDays}/{weeklyGoal.exerciseDays}일
                  </span>
                </div>
                <Progress value={(weeklyGoal.completedDays / weeklyGoal.exerciseDays) * 100} className="h-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round((weeklyGoal.completedDays / weeklyGoal.exerciseDays) * 100)}% 달성
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 h-14">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              오늘의 추천
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              운동 프로필
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              운동 기록
            </TabsTrigger>
            <TabsTrigger
              value="programs"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              운동 프로그램
            </TabsTrigger>
          </TabsList>

          {/* 오늘의 추천 운동 */}
          <TabsContent value="today" className="space-y-6">
            <div className="grid gap-6">
              {todayRecommendations.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={`bg-white dark:bg-gray-800 border-2 shadow-lg transition-all duration-300 ${
                    exercise.isCompleted
                      ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                      : "border-gray-200 dark:border-gray-700 hover:shadow-xl"
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-6">
                        <div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                            exercise.isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {exercise.isCompleted ? (
                            <CheckCircle className="h-8 w-8" />
                          ) : (
                            <Dumbbell className="h-8 w-8" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{exercise.name}</h3>
                            <Badge className={getTypeColor(exercise.type)}>{getTypeText(exercise.type)}</Badge>
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {getDifficultyText(exercise.difficulty)}
                            </Badge>
                            {exercise.isCompleted && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                                완료
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{exercise.description}</p>
                          <div className="grid gap-4 md:grid-cols-3 mb-6">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-5 w-5 text-gray-400" />
                              <span className="text-base font-medium text-gray-900 dark:text-white">
                                {exercise.duration}분
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Flame className="h-5 w-5 text-gray-400" />
                              <span className="text-base font-medium text-gray-900 dark:text-white">
                                {exercise.calories}kcal
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Heart className="h-5 w-5 text-gray-400" />
                              <span className="text-base font-medium text-gray-900 dark:text-white">
                                {exercise.targetMuscles.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 운동 방법 */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">운동 방법</h4>
                      <div className="grid gap-3">
                        {exercise.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <p className="text-base text-gray-700 dark:text-gray-300">{instruction}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 운동 효과 */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">운동 효과</h4>
                      <div className="flex flex-wrap gap-2">
                        {exercise.benefits.map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400 px-3 py-1"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 필요 장비 */}
                    {exercise.equipment.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">필요 장비</h4>
                        <div className="flex flex-wrap gap-2">
                          {exercise.equipment.map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-gray-200 dark:border-gray-700 px-3 py-1"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {exercise.videoUrl && (
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                          <Play className="mr-2 h-4 w-4" />
                          운동 영상 보기
                        </Button>
                      )}
                      <Button
                        onClick={() => handleCompleteExercise(exercise.id)}
                        className={
                          exercise.isCompleted
                            ? "bg-gray-500 hover:bg-gray-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }
                      >
                        {exercise.isCompleted ? (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            완료 취소
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            운동 완료
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedExercise(exercise)}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <Timer className="mr-2 h-4 w-4" />
                        타이머 시작
                      </Button>
                    </div>

                    {exercise.isCompleted && exercise.completedAt && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✅ {format(exercise.completedAt, "HH:mm")}에 완료했습니다!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 운동 프로필 */}
          <TabsContent value="profile">
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>운동 프로필 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">나이</Label>
                      <Input
                        type="number"
                        defaultValue={userProfile.age}
                        className="border-gray-200 dark:border-gray-700 h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">체중 (kg)</Label>
                      <Input
                        type="number"
                        defaultValue={userProfile.weight}
                        className="border-gray-200 dark:border-gray-700 h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">신장 (cm)</Label>
                      <Input
                        type="number"
                        defaultValue={userProfile.height}
                        className="border-gray-200 dark:border-gray-700 h-12 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">운동 수준</Label>
                      <Select defaultValue={userProfile.fitnessLevel}>
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">초급 (운동 경험 없음)</SelectItem>
                          <SelectItem value="intermediate">중급 (가끔 운동)</SelectItem>
                          <SelectItem value="advanced">고급 (정기적 운동)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                        1회 운동 시간 (분)
                      </Label>
                      <Select defaultValue={userProfile.availableTime.toString()}>
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15분</SelectItem>
                          <SelectItem value="30">30분</SelectItem>
                          <SelectItem value="45">45분</SelectItem>
                          <SelectItem value="60">60분</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">건강 상태</Label>
                      <div className="space-y-2">
                        {userProfile.healthConditions.map((condition, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-red-200 text-red-600 dark:border-red-800 dark:text-red-400 px-3 py-1 mr-2"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">운동 목표</Label>
                      <div className="space-y-2">
                        {userProfile.goals.map((goal, index) => (
                          <Badge
                            key={index}
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200 px-3 py-1 mr-2"
                          >
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 dark:text-gray-300">선호 운동</Label>
                      <div className="space-y-2">
                        {userProfile.preferredExercises.map((exercise, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-green-200 text-green-600 dark:border-green-800 dark:text-green-400 px-3 py-1 mr-2"
                          >
                            {exercise}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg">
                  <Plus className="mr-2 h-6 w-6" />
                  프로필 업데이트
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 운동 기록 */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-6">
              {exerciseLogs.map((log) => (
                <Card
                  key={log.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{log.exerciseName}</h3>
                          <div className="flex items-center space-x-4 text-base text-gray-600 dark:text-gray-400 mt-1">
                            <span>{format(log.date, "yyyy년 MM월 dd일", { locale: ko })}</span>
                            <span>•</span>
                            <span>{log.duration}분</span>
                            <span>•</span>
                            <span>{log.calories}kcal</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`h-4 w-4 ${
                                    index < log.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {log.notes && <p className="text-base text-gray-600 dark:text-gray-400 mt-2">{log.notes}</p>}
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(log.difficulty)}>{getDifficultyText(log.difficulty)}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 운동 프로그램 */}
          <TabsContent value="programs">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span>심혈관 건강 프로그램</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    고혈압과 당뇨병 관리를 위한 4주 유산소 운동 프로그램입니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">기간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">4주</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">주당 운동:</span>
                      <span className="font-medium text-gray-900 dark:text-white">5회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">1회 시간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">20-30분</span>
                    </div>
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    프로그램 시작
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>근력 강화 프로그램</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    안전한 근력 운동으로 뼈 건강과 근육량을 증진시키는 프로그램입니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">기간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">6주</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">주당 운동:</span>
                      <span className="font-medium text-gray-900 dark:text-white">3회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">1회 시간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">15-25분</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    프로그램 시작
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>유연성 향상 프로그램</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    관절 가동범위를 늘리고 스트레스를 완화하는 스트레칭 프로그램입니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">기간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">3주</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">주당 운동:</span>
                      <span className="font-medium text-gray-900 dark:text-white">매일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">1회 시간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">10-15분</span>
                    </div>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    프로그램 시작
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>균형감각 프로그램</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    낙상 예방과 안정성 향상을 위한 균형감각 훈련 프로그램입니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">기간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">4주</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">주당 운동:</span>
                      <span className="font-medium text-gray-900 dark:text-white">4회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">1회 시간:</span>
                      <span className="font-medium text-gray-900 dark:text-white">15-20분</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    프로그램 시작
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 사용 가이드 */}
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl text-orange-800 dark:text-orange-200">
              <Dumbbell className="h-6 w-6" />
              <span>안전한 운동 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">🏃‍♂️ 운동 전 준비</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 운동 전 5-10분간 가벼운 워밍업을 하세요</li>
                  <li>• 편안한 운동복과 운동화를 착용하세요</li>
                  <li>• 충분한 수분을 섭취하세요</li>
                  <li>• 몸의 컨디션을 확인하세요</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">⚠️ 주의사항</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 가슴 통증이나 호흡곤란 시 즉시 중단하세요</li>
                  <li>• 어지러움이나 메스꺼움 시 휴식을 취하세요</li>
                  <li>• 무리하지 말고 본인 수준에 맞게 하세요</li>
                  <li>• 운동 후 쿨다운과 스트레칭을 잊지 마세요</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
