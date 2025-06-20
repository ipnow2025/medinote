"use client"
import {
  LayoutDashboard,
  FileText,
  Brain,
  Heart,
  Pill,
  ScanText,
  Dumbbell,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { logout } from "@/lib/func"
import { useRouter, usePathname } from "next/navigation"

// 메뉴 아이템 정의
const menuItems = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "전체 건강 현황 보기",
    iconColor: "text-blue-500", // 파란색
  },
  {
    title: "진료 기록 관리",
    url: "/medical-records",
    icon: FileText,
    description: "진료 기록 입력 및 관리",
    iconColor: "text-green-500", // 초록색
  },
  {
    title: "AI 추천 질문",
    url: "/ai-questions",
    icon: Brain,
    description: "AI가 추천하는 진료 질문",
    iconColor: "text-purple-500", // 보라색
  },
  {
    title: "건강 상태 기록",
    url: "/vital-check",
    icon: Heart,
    description: "혈압, 혈당 등 건강 지표 기록",
    iconColor: "text-red-500", // 빨간색
  },
  {
    title: "투약 관리",
    url: "/medications",
    icon: Pill,
    description: "복용 약물 관리",
    iconColor: "text-yellow-500", // 노란색
  },
  {
    title: "OCR 자동 기록",
    url: "/ocr-record",
    icon: ScanText,
    description: "처방전 자동 인식 및 기록",
    iconColor: "text-indigo-500", // 인디고색
  },
  {
    title: "AI 맞춤 운동 추천",
    url: "/exercise",
    icon: Dumbbell,
    description: "개인 맞춤 운동 프로그램",
    iconColor: "text-orange-500", // 주황색
  },
  {
    title: "패밀리 계정 관리",
    url: "/family",
    icon: Users,
    description: "가족 구성원 건강 관리",
    iconColor: "text-pink-500", // 핑크색
  },
  {
    title: "커뮤니티",
    url: "/community",
    icon: MessageCircle,
    description: "환자 커뮤니티 및 정보 공유",
    iconColor: "text-teal-500", // 틸색
  },
  {
    title: "설정",
    url: "/settings",
    icon: Settings,
    description: "앱 설정 및 개인정보 관리",
    iconColor: "text-gray-500", // 회색
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar variant="inset" className="border-r border-gray-200 dark:border-gray-800">
      <SidebarHeader className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-lg text-gray-900 dark:text-white">메디노트</span>
            <span className="truncate text-xs text-gray-500 dark:text-gray-400">건강 관리 도우미</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-gray-900">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(0, 4).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.description}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      ${
                        pathname === item.url
                          ? "bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 border-r-2 border-orange-500"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      <span className="font-bold text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(4, 7).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.description}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      ${
                        pathname === item.url
                          ? "bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 border-r-2 border-orange-500"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      <span className="font-bold text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(7).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.description}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      ${
                        pathname === item.url
                          ? "bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 border-r-2 border-orange-500"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      <span className="font-bold text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span className="font-medium">내 계정</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
