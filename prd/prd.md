# Application 구조
-  
# 만성질환자 외래 진료 기록 관련 앱 개발
1. 회원제로 운영되는 웹 서비스 개발
2. 데이터베이스는 mysql 사용
3. prisma 사용
4. 전체적인 디자인은 심플하게 개발
5. 모바일 대응
6. db migration 은 sql 스카마만 작성하고, 프로그램에서 실행하지 않음.
7. 고령층도 쉽게 사용할 수 있는 인터페이스 제공 


# 실행 후 작업
\`\`\`bash
npx prisma generate
\`\`\`

# 유의사항
- lib/utils.ts 는 v0 와 계속 충돌나는 것 같으니, 그냥 원본을 유지하고, 별도의 func.ts 파일을 만들어서 사용할 것.
- package.json 에 type: "module" 을 추가해야 함.
- package.json 파일은 무슨 이유에서인지 계속 원래 파일로 돌아감. 미치겠음.
- 첫 등록 시 파일 목록을 잘 확인할 것.
