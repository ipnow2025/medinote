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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Users, UserPlus, Mail, Shield, Settings, Trash2, Edit, Crown, Heart, Clock, Send, Copy } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FamilyMember {
  id: number
  name: string
  email: string
  relationship: string
  role: "admin" | "caregiver" | "viewer"
  status: "active" | "pending" | "inactive"
  joinedAt: Date
  lastAccess?: Date
  permissions: {
    viewMedicalRecords: boolean
    viewMedications: boolean
    viewVitals: boolean
    receiveAlerts: boolean
    manageAppointments: boolean
    emergencyContact: boolean
  }
  avatar?: string
}

interface InvitationRequest {
  id: number
  email: string
  relationship: string
  role: string
  message?: string
  sentAt: Date
  expiresAt: Date
  status: "pending" | "accepted" | "expired" | "cancelled"
}

interface PermissionTemplate {
  name: string
  description: string
  permissions: {
    viewMedicalRecords: boolean
    viewMedications: boolean
    viewVitals: boolean
    receiveAlerts: boolean
    manageAppointments: boolean
    emergencyContact: boolean
  }
}

export default function FamilyAccountPage() {
  const [activeTab, setActiveTab] = useState("members")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)

  // 초대 폼 상태
  const [inviteForm, setInviteForm] = useState({
    email: "",
    relationship: "",
    role: "viewer",
    message: "",
    permissions: {
      viewMedicalRecords: false,
      viewMedications: false,
      viewVitals: true,
      receiveAlerts: false,
      manageAppointments: false,
      emergencyContact: false,
    },
  })

  // 권한 템플릿
  const permissionTemplates: PermissionTemplate[] = [
    {
      name: "보호자 (전체 권한)",
      description: "모든 건강 정보 열람 및 관리 권한",
      permissions: {
        viewMedicalRecords: true,
        viewMedications: true,
        viewVitals: true,
        receiveAlerts: true,
        manageAppointments: true,
        emergencyContact: true,
      },
    },
    {
      name: "가족 구성원 (기본)",
      description: "기본적인 건강 상태 확인 권한",
      permissions: {
        viewMedicalRecords: false,
        viewMedications: true,
        viewVitals: true,
        receiveAlerts: true,
        manageAppointments: false,
        emergencyContact: false,
      },
    },
    {
      name: "응급 연락처",
      description: "응급 상황 시에만 알림 받기",
      permissions: {
        viewMedicalRecords: false,
        viewMedications: false,
        viewVitals: false,
        receiveAlerts: false,
        manageAppointments: false,
        emergencyContact: true,
      },
    },
  ]

  // 목업 데이터
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: "김영희",
      email: "younghee@example.com",
      relationship: "배우자",
      role: "admin",
      status: "active",
      joinedAt: new Date("2024-11-01"),
      lastAccess: new Date("2024-12-12 09:30"),
      permissions: {
        viewMedicalRecords: true,
        viewMedications: true,
        viewVitals: true,
        receiveAlerts: true,
        manageAppointments: true,
        emergencyContact: true,
      },
    },
    {
      id: 2,
      name: "김민수",
      email: "minsu@example.com",
      relationship: "자녀",
      role: "caregiver",
      status: "active",
      joinedAt: new Date("2024-11-15"),
      lastAccess: new Date("2024-12-11 18:45"),
      permissions: {
        viewMedicalRecords: false,
        viewMedications: true,
        viewVitals: true,
        receiveAlerts: true,
        manageAppointments: false,
        emergencyContact: true,
      },
    },
    {
      id: 3,
      name: "김지은",
      email: "jieun@example.com",
      relationship: "자녀",
      role: "viewer",
      status: "pending",
      joinedAt: new Date("2024-12-10"),
      permissions: {
        viewMedicalRecords: false,
        viewMedications: false,
        viewVitals: true,
        receiveAlerts: false,
        manageAppointments: false,
        emergencyContact: false,
      },
    },
  ])

  const [invitations, setInvitations] = useState<InvitationRequest[]>([
    {
      id: 1,
      email: "jieun@example.com",
      relationship: "자녀",
      role: "viewer",
      message: "건강 상태를 함께 관리해요.",
      sentAt: new Date("2024-12-10"),
      expiresAt: new Date("2024-12-17"),
      status: "pending",
    },
    {
      id: 2,
      email: "doctor@hospital.com",
      relationship: "담당의",
      role: "caregiver",
      sentAt: new Date("2024-12-08"),
      expiresAt: new Date("2024-12-15"),
      status: "expired",
    },
  ])

  const handleInviteFormChange = (field: string, value: any) => {
    if (field.startsWith("permissions.")) {
      const permissionKey = field.split(".")[1]
      setInviteForm((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: value,
        },
      }))
    } else {
      setInviteForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const applyPermissionTemplate = (template: PermissionTemplate) => {
    setInviteForm((prev) => ({
      ...prev,
      permissions: template.permissions,
    }))
  }

  const handleSendInvitation = () => {
    const newInvitation: InvitationRequest = {
      id: invitations.length + 1,
      email: inviteForm.email,
      relationship: inviteForm.relationship,
      role: inviteForm.role,
      message: inviteForm.message,
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      status: "pending",
    }

    setInvitations((prev) => [newInvitation, ...prev])

    // 폼 초기화
    setInviteForm({
      email: "",
      relationship: "",
      role: "viewer",
      message: "",
      permissions: {
        viewMedicalRecords: false,
        viewMedications: false,
        viewVitals: true,
        receiveAlerts: false,
        manageAppointments: false,
        emergencyContact: false,
      },
    })

    setShowInviteDialog(false)
  }

  const handleDeleteMember = (member: FamilyMember) => {
    setMemberToDelete(member)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (memberToDelete) {
      setFamilyMembers((prev) => prev.filter((member) => member.id !== memberToDelete.id))
      setMemberToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
  }

  const handleSaveEdit = (memberId: number, updatedData: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, ...updatedData } : member)))
    setEditingMember(null)
  }

  const handleUpdateMemberPermissions = (memberId: number, permissions: any) => {
    setFamilyMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, permissions } : member)))
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      case "caregiver":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
      case "viewer":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "관리자"
      case "caregiver":
        return "보호자"
      case "viewer":
        return "열람자"
      default:
        return "기타"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활성"
      case "pending":
        return "대기중"
      case "inactive":
        return "비활성"
      default:
        return "알 수 없음"
    }
  }

  const generateInviteLink = () => {
    return `https://medinote.app/invite/${Math.random().toString(36).substr(2, 9)}`
  }

  const copyInviteLink = () => {
    const link = generateInviteLink()
    navigator.clipboard.writeText(link)
    // 복사 완료 알림 표시
  }

  return (
    <MainLayout>
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">패밀리 계정 관리</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              가족 구성원과 건강 정보를 안전하게 공유하고 관리하세요.
            </p>
          </div>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-6 text-base">
                <UserPlus className="mr-2 h-5 w-5" />
                가족 초대하기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-xl">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>가족 구성원 초대</span>
                </DialogTitle>
                <DialogDescription>
                  가족 구성원을 초대하여 건강 정보를 공유하고 함께 관리할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">이메일 주소</Label>
                    <Input
                      placeholder="example@email.com"
                      value={inviteForm.email}
                      onChange={(e) => handleInviteFormChange("email", e.target.value)}
                      className="border-gray-200 dark:border-gray-700 h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">관계</Label>
                    <Select
                      value={inviteForm.relationship}
                      onValueChange={(value) => handleInviteFormChange("relationship", value)}
                    >
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                        <SelectValue placeholder="관계 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="배우자">배우자</SelectItem>
                        <SelectItem value="자녀">자녀</SelectItem>
                        <SelectItem value="부모">부모</SelectItem>
                        <SelectItem value="형제자매">형제자매</SelectItem>
                        <SelectItem value="친척">친척</SelectItem>
                        <SelectItem value="담당의">담당의</SelectItem>
                        <SelectItem value="간병인">간병인</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">역할</Label>
                  <Select value={inviteForm.role} onValueChange={(value) => handleInviteFormChange("role", value)}>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">관리자 (모든 권한)</SelectItem>
                      <SelectItem value="caregiver">보호자 (관리 권한)</SelectItem>
                      <SelectItem value="viewer">열람자 (보기 권한)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 권한 템플릿 */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">권한 템플릿</Label>
                  <div className="grid gap-3">
                    {permissionTemplates.map((template, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        onClick={() => applyPermissionTemplate(template)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            적용
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 세부 권한 설정 */}
                <div className="space-y-4">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">세부 권한 설정</Label>
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">진료 기록 열람</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">진료 기록 및 진단 정보 확인</p>
                      </div>
                      <Switch
                        checked={inviteForm.permissions.viewMedicalRecords}
                        onCheckedChange={(checked) => handleInviteFormChange("permissions.viewMedicalRecords", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">복용 약물 확인</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">현재 복용 중인 약물 정보</p>
                      </div>
                      <Switch
                        checked={inviteForm.permissions.viewMedications}
                        onCheckedChange={(checked) => handleInviteFormChange("permissions.viewMedications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">건강 지표 확인</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">혈압, 혈당 등 건강 상태</p>
                      </div>
                      <Switch
                        checked={inviteForm.permissions.viewVitals}
                        onCheckedChange={(checked) => handleInviteFormChange("permissions.viewVitals", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">알림 받기</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">복용 알림 및 건강 상태 알림</p>
                      </div>
                      <Switch
                        checked={inviteForm.permissions.receiveAlerts}
                        onCheckedChange={(checked) => handleInviteFormChange("permissions.receiveAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">진료 일정 관리</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">진료 예약 및 일정 변경</p>
                      </div>
                      <Switch
                        checked={inviteForm.permissions.manageAppointments}
                        onCheckedChange={(checked) => handleInviteFormChange("permissions.manageAppointments", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">응급 연락처</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">응급 상황 시 즉시 알림</p>
                      </div>
                      <Switch
                        checked={inviteForm.permissions.emergencyContact}
                        onCheckedChange={(checked) => handleInviteFormChange("permissions.emergencyContact", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                    초대 메시지 (선택사항)
                  </Label>
                  <Textarea
                    placeholder="가족 구성원에게 전달할 메시지를 입력하세요."
                    value={inviteForm.message}
                    onChange={(e) => handleInviteFormChange("message", e.target.value)}
                    rows={3}
                    className="border-gray-200 dark:border-gray-700 text-base"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSendInvitation}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12 text-base"
                    disabled={!inviteForm.email || !inviteForm.relationship}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    초대장 보내기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={copyInviteLink}
                    className="border-gray-200 dark:border-gray-700 h-12 px-6 text-base"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    링크 복사
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 통계 카드 */}

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 h-14">
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              가족 구성원
            </TabsTrigger>
            <TabsTrigger
              value="invitations"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              초대 관리
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-base font-medium"
            >
              공유 설정
            </TabsTrigger>
          </TabsList>

          {/* 가족 구성원 목록 */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid gap-6">
              {familyMembers.map((member) => (
                <Card
                  key={member.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-6">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shadow-lg">
                          {member.role === "admin" ? (
                            <Crown className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                          ) : (
                            <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                            <Badge className={getRoleColor(member.role)}>{getRoleText(member.role)}</Badge>
                            <Badge className={getStatusColor(member.status)}>{getStatusText(member.status)}</Badge>
                            {member.permissions.emergencyContact && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                                응급연락처
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2 text-base text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4" />
                              <span>{member.relationship}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                가입: {format(member.joinedAt, "yyyy년 MM월 dd일", { locale: ko })}
                                {member.lastAccess && (
                                  <span className="ml-2">
                                    • 최근 접속: {format(member.lastAccess, "MM월 dd일 HH:mm", { locale: ko })}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>

                          {editingMember && editingMember.id === member.id ? (
                            // 편집 모드 UI
                            <div className="space-y-4">
                              <h4 className="font-semibold text-lg text-gray-900 dark:text-white">권한 수정</h4>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                  <Label
                                    htmlFor={`viewMedicalRecords-${member.id}`}
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    진료 기록 열람
                                  </Label>
                                  <Switch
                                    id={`viewMedicalRecords-${member.id}`}
                                    checked={editingMember.permissions.viewMedicalRecords}
                                    onCheckedChange={(checked) =>
                                      setEditingMember({
                                        ...editingMember,
                                        permissions: { ...editingMember.permissions, viewMedicalRecords: checked },
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Label
                                    htmlFor={`viewMedications-${member.id}`}
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    복용 약물 확인
                                  </Label>
                                  <Switch
                                    id={`viewMedications-${member.id}`}
                                    checked={editingMember.permissions.viewMedications}
                                    onCheckedChange={(checked) =>
                                      setEditingMember({
                                        ...editingMember,
                                        permissions: { ...editingMember.permissions, viewMedications: checked },
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Label
                                    htmlFor={`viewVitals-${member.id}`}
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    건강 지표 확인
                                  </Label>
                                  <Switch
                                    id={`viewVitals-${member.id}`}
                                    checked={editingMember.permissions.viewVitals}
                                    onCheckedChange={(checked) =>
                                      setEditingMember({
                                        ...editingMember,
                                        permissions: { ...editingMember.permissions, viewVitals: checked },
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Label
                                    htmlFor={`receiveAlerts-${member.id}`}
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    알림 받기
                                  </Label>
                                  <Switch
                                    id={`receiveAlerts-${member.id}`}
                                    checked={editingMember.permissions.receiveAlerts}
                                    onCheckedChange={(checked) =>
                                      setEditingMember({
                                        ...editingMember,
                                        permissions: { ...editingMember.permissions, receiveAlerts: checked },
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Label
                                    htmlFor={`manageAppointments-${member.id}`}
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    진료 일정 관리
                                  </Label>
                                  <Switch
                                    id={`manageAppointments-${member.id}`}
                                    checked={editingMember.permissions.manageAppointments}
                                    onCheckedChange={(checked) =>
                                      setEditingMember({
                                        ...editingMember,
                                        permissions: { ...editingMember.permissions, manageAppointments: checked },
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Label
                                    htmlFor={`emergencyContact-${member.id}`}
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    응급 연락처
                                  </Label>
                                  <Switch
                                    id={`emergencyContact-${member.id}`}
                                    checked={editingMember.permissions.emergencyContact}
                                    onCheckedChange={(checked) =>
                                      setEditingMember({
                                        ...editingMember,
                                        permissions: { ...editingMember.permissions, emergencyContact: checked },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button onClick={() => handleSaveEdit(member.id, editingMember)}>저장</Button>
                                <Button variant="outline" onClick={() => setEditingMember(null)}>
                                  취소
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // 기존 권한 표시 UI
                            <div className="space-y-3">
                              <h4 className="font-semibold text-lg text-gray-900 dark:text-white">권한</h4>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      member.permissions.viewMedicalRecords ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">진료 기록 열람</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      member.permissions.viewMedications ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">복용 약물 확인</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      member.permissions.viewVitals ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">건강 지표 확인</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      member.permissions.receiveAlerts ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">알림 받기</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      member.permissions.manageAppointments ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">진료 일정 관리</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      member.permissions.emergencyContact ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">응급 연락처</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMember(member)}
                          className="h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {member.role !== "admin" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteMember(member)}
                            className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 초대 관리 */}
          <TabsContent value="invitations" className="space-y-6">
            <div className="grid gap-6">
              {invitations.map((invitation) => (
                <Card
                  key={invitation.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shadow-lg">
                          <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{invitation.email}</h3>
                          <div className="flex items-center space-x-4 text-base text-gray-600 dark:text-gray-400 mt-1">
                            <span>{invitation.relationship}</span>
                            <span>•</span>
                            <span>{getRoleText(invitation.role)}</span>
                            <span>•</span>
                            <span>
                              {invitation.status === "pending"
                                ? `만료: ${format(invitation.expiresAt, "MM월 dd일", { locale: ko })}`
                                : `발송: ${format(invitation.sentAt, "MM월 dd일", { locale: ko })}`}
                            </span>
                          </div>
                          {invitation.message && (
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-2">"{invitation.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={
                            invitation.status === "pending"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
                              : invitation.status === "accepted"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
                          }
                        >
                          {invitation.status === "pending"
                            ? "대기중"
                            : invitation.status === "accepted"
                              ? "수락됨"
                              : "만료됨"}
                        </Badge>
                        {invitation.status === "pending" && (
                          <Button size="sm" variant="outline" className="border-gray-200 dark:border-gray-700">
                            재발송
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {invitations.length === 0 && (
                <Card className="bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      발송된 초대장이 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                      가족 구성원을 초대하여 건강 정보를 함께 관리해보세요.
                    </p>
                    <Button
                      onClick={() => setShowInviteDialog(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 text-base"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      가족 초대하기
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 공유 설정 */}
          <TabsContent value="settings">
            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl text-gray-900 dark:text-white">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>공유 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">자동 알림 설정</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        중요한 건강 이벤트 발생 시 가족 구성원에게 자동으로 알림을 보냅니다.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">응급 상황 알림</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        응급 상황 시 모든 응급 연락처에게 즉시 알림을 보냅니다.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">복용 알림 공유</h4>
                      <p className="text-gray-600 dark:text-gray-400">약물 복용 알림을 가족 구성원과 공유합니다.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">진료 일정 공유</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        진료 예약 및 일정 변경 사항을 가족 구성원과 공유합니다.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">건강 지표 공유</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        혈압, 혈당 등 건강 지표 측정 결과를 가족 구성원과 공유합니다.
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">데이터 보관 기간</h4>
                  <Select defaultValue="1year">
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">6개월</SelectItem>
                      <SelectItem value="1year">1년</SelectItem>
                      <SelectItem value="2years">2년</SelectItem>
                      <SelectItem value="permanent">영구 보관</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    가족 구성원이 접근할 수 있는 건강 데이터의 보관 기간을 설정합니다.
                  </p>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg">
                  <Settings className="mr-2 h-6 w-6" />
                  설정 저장
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 사용 가이드 */}
        <Card className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl text-orange-800 dark:text-orange-200">
              <Shield className="h-6 w-6" />
              <span>패밀리 계정 안전 가이드</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">🔒 개인정보 보호</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 신뢰할 수 있는 가족 구성원만 초대하세요</li>
                  <li>• 각 구성원에게 필요한 최소한의 권한만 부여하세요</li>
                  <li>• 정기적으로 접근 권한을 검토하고 업데이트하세요</li>
                  <li>• 더 이상 필요하지 않은 계정은 즉시 삭제하세요</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200">👨‍👩‍👧‍👦 효과적인 관리</h4>
                <ul className="text-base text-orange-700 dark:text-orange-300 space-y-2">
                  <li>• 응급 연락처를 최소 2명 이상 설정하세요</li>
                  <li>• 중요한 알림은 여러 구성원이 받도록 설정하세요</li>
                  <li>• 정기적으로 가족 구성원과 건강 상태를 공유하세요</li>
                  <li>• 의료진도 필요시 초대하여 전문적인 관리를 받으세요</li>
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
              <span>가족 구성원 삭제</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              <strong>"{memberToDelete?.name}"</strong> 님을 패밀리 계정에서 정말 삭제하시겠습니까?
              <br />
              <span className="text-red-600 dark:text-red-400 font-medium">
                삭제 후에는 모든 건강 정보 접근 권한이 즉시 차단됩니다.
              </span>
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
