"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MedicalRecordsPage() {
  const [formData, setFormData] = useState({
    department: "",
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Records</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="department">진료과</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="진료과를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
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
    </div>
  )
}
