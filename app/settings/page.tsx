"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Shield,
  Moon,
  User,
  Lock,
  Smartphone,
  Globe,
  Database,
  LogOut,
  Camera,
  Mail,
  Phone,
  Calendar,
  Heart,
  Pill,
  Activity,
} from "lucide-react"

export default function Settings() {
  const [settings, setSettings] = useState({
    privacyEnhanced: true,
    darkMode: false,
    notifications: true,
    medicationReminders: true,
    appointmentAlerts: true,
    healthDataSharing: false,
    biometricLogin: false,
    autoBackup: true,
    dataSync: true,
  })

  const [profile, setProfile] = useState({
    name: "김건강",
    email: "kim.health@example.com",
    phone: "010-1234-5678",
    birthDate: "1985-03-15",
    emergencyContact: "010-9876-5432",
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const settingsContent = (
    <div className="space-y-6">
      {/* 프로필 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            프로필 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback>김건</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              사진 변경
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" value={profile.name} onChange={(e) => handleProfileChange("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input id="phone" value={profile.phone} onChange={(e) => handleProfileChange("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일</Label>
              <Input
                id="birthDate"
                type="date"
                value={profile.birthDate}
                onChange={(e) => handleProfileChange("birthDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">비상연락처</Label>
              <Input
                id="emergency"
                value={profile.emergencyContact}
                onChange={(e) => handleProfileChange("emergencyContact", e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full md:w-auto">프로필 저장</Button>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">전체 알림</span>
                <p className="text-sm text-muted-foreground">모든 알림을 받습니다</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
            />
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Pill className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">복약 알림</span>
                <p className="text-sm text-muted-foreground">약 복용 시간을 알려드립니다</p>
              </div>
            </div>
            <Switch
              checked={settings.medicationReminders}
              onCheckedChange={(checked) => handleSettingChange("medicationReminders", checked)}
              disabled={!settings.notifications}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">진료 예약 알림</span>
                <p className="text-sm text-muted-foreground">예약된 진료 일정을 알려드립니다</p>
              </div>
            </div>
            <Switch
              checked={settings.appointmentAlerts}
              onCheckedChange={(checked) => handleSettingChange("appointmentAlerts", checked)}
              disabled={!settings.notifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* 개인정보 및 보안 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            개인정보 및 보안
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">개인정보 보호 강화</span>
                <p className="text-sm text-muted-foreground">데이터 암호화 및 보안 강화</p>
              </div>
            </div>
            <Switch
              checked={settings.privacyEnhanced}
              onCheckedChange={(checked) => handleSettingChange("privacyEnhanced", checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">생체 인증 로그인</span>
                <p className="text-sm text-muted-foreground">지문 또는 얼굴 인식으로 로그인</p>
              </div>
            </div>
            <Switch
              checked={settings.biometricLogin}
              onCheckedChange={(checked) => handleSettingChange("biometricLogin", checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">건강 데이터 공유</span>
                <p className="text-sm text-muted-foreground">의료진과 건강 데이터 공유</p>
              </div>
            </div>
            <Switch
              checked={settings.healthDataSharing}
              onCheckedChange={(checked) => handleSettingChange("healthDataSharing", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              비밀번호 변경
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              2단계 인증 설정
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 앱 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />앱 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">다크 모드</span>
                <p className="text-sm text-muted-foreground">어두운 테마 사용</p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>언어 설정</Label>
            <Select defaultValue="ko">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>시간대</Label>
            <Select defaultValue="asia-seoul">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-seoul">서울 (GMT+9)</SelectItem>
                <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                <SelectItem value="america-new-york">뉴욕 (GMT-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">자동 백업</span>
                <p className="text-sm text-muted-foreground">클라우드에 데이터 자동 백업</p>
              </div>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">데이터 동기화</span>
                <p className="text-sm text-muted-foreground">여러 기기 간 데이터 동기화</p>
              </div>
            </div>
            <Switch
              checked={settings.dataSync}
              onCheckedChange={(checked) => handleSettingChange("dataSync", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              데이터 내보내기
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              데이터 가져오기
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">저장 공간 사용량</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>진료 기록</span>
                <span>2.3 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>약물 정보</span>
                <span>1.1 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>건강 지표</span>
                <span>0.8 MB</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>총 사용량</span>
                <span>4.2 MB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 계정 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            계정 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">프리미엄 계정</Badge>
            <Badge variant="outline">인증됨</Badge>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              이메일 변경
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              전화번호 변경
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="destructive" className="w-full">
              계정 삭제
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              계정 삭제 시 모든 데이터가 영구적으로 삭제됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 앱 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>앱 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>버전</span>
            <span className="text-muted-foreground">1.2.3</span>
          </div>
          <div className="flex justify-between">
            <span>빌드</span>
            <span className="text-muted-foreground">2024.12.06</span>
          </div>
          <div className="flex justify-between">
            <span>개발자</span>
            <span className="text-muted-foreground">메디노트 팀</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="link" className="w-full justify-start p-0 h-auto">
              이용약관
            </Button>
            <Button variant="link" className="w-full justify-start p-0 h-auto">
              개인정보처리방침
            </Button>
            <Button variant="link" className="w-full justify-start p-0 h-auto">
              고객지원
            </Button>
            <Button variant="link" className="w-full justify-start p-0 h-auto">
              앱 평가하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return <MainLayout>{settingsContent}</MainLayout>
}
