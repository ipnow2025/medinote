import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useRouter } from 'next/navigation';

// basePath가 자동으로 붙는 fetch 유틸리티
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export async function apiFetch(input: string, init?: RequestInit) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const url = input.startsWith(basePath) ? input : basePath + input;

  // 토큰 또는 세션 정보 가져오기
  let token = null;
  let member = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    member = localStorage.getItem("member");
  }

  // 헤더 병합
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (member) headers["X-User-Session"] = btoa(unescape(encodeURIComponent(member)));

  return fetch(url, {
    ...init,
    headers,
  });
}

export function goToInternalUrl(path: string, replace = false) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const url = path.startsWith(basePath) ? path : basePath + path;
  if (typeof window !== 'undefined') {
    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }
}

// 1. 로그인 유무 판단 (member 객체 기준)
export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  const member = localStorage.getItem('member');
  return Boolean(member && JSON.parse(member)?.memberId);
}

// 2. 로그인 아이디 추출 (member 객체 기준)
export function getUserId() {
  if (typeof window === 'undefined') return null;
  const member = localStorage.getItem('member');
  if (!member) return null;
  try {
    return JSON.parse(member).memberIdx || null;
  } catch {
    return null;
  }
}

// 3. basePath 자동 적용 router.push

export function useBasePathRouter() {
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  function push(path: string) {
    const url = path.startsWith(basePath) ? path : basePath + path;
    //console.log(url);
    router.push(url);
  }
  function replace(path: string) {
    const url = path.startsWith(basePath) ? path : basePath + path;
    router.replace(url);
  }
  return { ...router, push, replace };
}

// 세션 저장 함수
export function saveSession(member: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('member', JSON.stringify(member));
} 

// 4. env 값을 읽어서 vcontainer or zone 모드인지 확인하는 함수
export function isVcontainer() {
  return process.env.NEXT_PUBLIC_VCONTAINER_MODE === 'true';
}

export function isZone() {
  return process.env.NEXT_PUBLIC_ZONE_MODE === 'true';
}

// 공용 로그아웃 함수
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    goToInternalUrl('/login');
  }
}

// NEXT_PUBLIC_BASE_PATH 값을 반환하는 공용 함수
export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}
