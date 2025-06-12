import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();
    // x-www-form-urlencoded로 body 변환
    const params = new URLSearchParams({
      id,
      password,
      device_platform: 'ios',
      device_id: 'mobileapi',
    });
    const res = await fetch("https://api.biznavi.co.kr/api/v1/member/m_access", {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Chrome",
        "x-token": "",
        "gwtoken": "",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      return NextResponse.json({ error: res.statusText }, { status: 401 });
    }
    const data = await res.json();
    console.log(data);
    const member = {
      memberId: id,
      memberIdx: data.result.idx,
      memberName: data.result.name,
      companyName: data.result.company_name,
      companyIdx: data.result.company_idx,
      biznaviToken: data.result.token,
      biznaviGwtoken: data.result.gwtoken
    };
    if (data.code !== '00' || !data.result) {
      return NextResponse.json({ error: '로그인 실패' }, { status: 401 });
    }
    return NextResponse.json({ ok: true, result: member }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: '서버 오류1' }, { status: 500 });
  }
}
