"use client"

import type React from "react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

// 경로별 브레드크럼 매핑
const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  "/dashboard": { title: "대시보드" },
  "/medical-records": { title: "진료 기록 관리" },
  "/ai-questions": { title: "AI 추천 질문" },
  "/vital-check": { title: "건강 상태 기록" },
  "/medications": { title: "투약 관리" },
  "/ocr-record": { title: "OCR 자동 기록" },
  "/exercise": { title: "AI 맞춤 운동 추천" },
  "/family": { title: "패밀리 계정 관리" },
  "/community": { title: "커뮤니티" },
  "/settings": { title: "설정" },
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const currentPage = breadcrumbMap[pathname]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">메디노트</BreadcrumbLink>
                </BreadcrumbItem>
                {currentPage && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
