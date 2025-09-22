# 제품 요구사항 문서 (PRD)

## 1. 제품 개요
- 제품명: 유병재식 영단어 암기
- 목표: 무작위 3개 영어 단어로 유병재 스타일의 짧은 스토리와 이미지를 생성해 단어 암기 효율을 높임
- 핵심 가치: 재미(블랙코미디) + 시각화(이미지) + 반복(새 스토리 생성)

## 2. 대상 사용자
- 초·중급 영어 학습자(단어 암기 동기 부족, 시각화/맥락화 필요)
- 짧은 시간에 가볍게 학습하고 싶은 사용자

## 3. 사용자 시나리오
1) 사용자는 페이지 접속
2) 자동으로 스토리/이미지 1세트 생성
3) 단어 칩, 영문/한글 스토리, 이미지를 확인
4) "새 스토리 생성" 버튼으로 재생성 반복

## 4. 핵심 기능 요구사항 (Functional)
- 무작위 단어 선택: `WORD_POOL`에서 3개 단어를 랜덤 선택
- 스토리 생성: 선택 단어 포함, 유병재 스타일, 2~3문장, JSON 응답(영문/한글/이미지 프롬프트) 강제
- 이미지 생성: `imagePrompt` 기반 단순/코믹 일러스트(정사각형) 1장 생성
- UI 표시:
  - 단어 칩(단어/뜻)
  - 정사각형 이미지(생성 중 상태 표시)
  - 영문 스토리(인용 형태)
  - 한글 번역(괄호 속 원문 단어 하이라이트)
- 재생성 버튼: 로딩 중 비활성화, 완료 후 활성화
- 에러 처리: API 키, 형식 오류, 이미지 실패 시 메시지 노출

## 5. 비기능 요구사항 (Non-Functional)
- 성능: 최초 진입 자동 생성 3~6초 내 완료 목표(네트워크/모델 지연 가변)
- 신뢰성: 모델 응답 검증(JSON/필수 필드)과 예외 처리
- 보안: 브라우저에서 API 호출 시 키 노출 위험 → 프록시 권장
- 접근성/반응형: 모바일 우선, 가독성 확보
- 국제화: 한글 UI 고정(추후 다국어 확장 고려)

## 6. 시스템 구성/외부 연동
- 프론트엔드: React + Vite
- 모델/이미지 백엔드(택1 운영):
  - OpenAI (`services/openaiService.ts`)
    - Story: `gpt-4o-mini`, `response_format: json_object`
    - Image: `dall-e-3` → URL 반환
    - 환경 변수: `VITE_OPENAI_API_KEY` (브라우저 노출 위험)
  - Gemini (`services/geminiService.ts`)
    - Story: `gemini-2.5-flash`, `responseSchema`로 JSON 강제
    - Image: `imagen-4.0-generate-001` → base64(`imageBytes`) 반환
    - 환경 변수: `API_KEY` (Node 런타임 가정)
- 현재 앱 구성: `App.tsx`는 `geminiService` 사용, 이미지 base64를 `data:image/png;base64,`로 감싸 렌더링

## 7. 데이터 모델/상태
- `Word`: `{ word: string; meaning: string }`
- `StoryResult`: `{ englishStory: string; koreanTranslation: string; imagePrompt: string }`
- 상태: `selectedWords`, `storyResult`, `generatedImage`, `isLoading`, `error`

## 8. 주요 플로우 (현재 구현)
- 초기 진입: 자동 생성 → 로딩 스피너 → 성공 시 `StoryDisplay` 출력
- 실패 시: 에러 메시지 표시
- 재생성: 버튼 클릭 → 같은 플로우 반복

## 9. 에러 및 엣지 케이스
- API 키 누락: 즉시 예외 throw → 사용자 안내
- 모델 응답 비정상(JSON 파싱 실패/필수 필드 누락): 메시지 표출
- 이미지 생성 실패: 메시지 표출, 버튼으로 재시도 가능
- 네트워크 지연: 로딩 스피너/버튼 비활성화 피드백

## 10. 설정/배포 가이드
- 로컬 실행: `npm install` → `.env.local`에 키 설정 → `npm run dev`
  - OpenAI: `VITE_OPENAI_API_KEY`
  - Gemini: `API_KEY` (브라우저/서버 일치성 주의)
- 운영 권장: 키 보호 위해 백엔드 프록시 도입, 모델은 한 가지로 통일(OpenAI 또는 Gemini)

## 11. KPI
- 세션당 "새 스토리 생성" 클릭 수
- 스토리 생성 성공률(에러율)
- 평균 생성 소요 시간

## 12. 향후 확장(낮은 우선순위)
- 즐겨찾기/공유(링크/이미지 저장)
- 난이도/주제/톤 선택 옵션
- 이미지 스타일 프리셋
- 복습 히스토리

## 13. 공개 쟁점(Open Questions)
- 최종 모델 라인(OpenAI vs Gemini) 단일화
- 브라우저 직접 호출 vs 서버 프록시
- 이미지 라이선스/표시 가이드 필요 여부
- 데이터/로그 저장 범위와 개인정보 처리 방침

## 14. 릴리스 범위 (현재 버전)
- 포함: 무작위 단어 3개, 스토리+이미지 자동 생성, 재생성 버튼, 로딩/에러 UI
- 제외: 사용자 설정, 저장/공유, 프록시 백엔드, 분석 수집

## 15. 승인 기준 (AC)
- 접속 시 단어 3개로 스토리+이미지 1회 이상 자동 생성 성공
- "새 스토리 생성" 클릭 시 동일 플로우 재생성 가능
- 스토리 JSON 스키마 충족(2~3문장, 단어 포함, 톤)
- 오류 시 사용자 안내 표시

## 16. 운영 판단 로직(권장)
- 운영 환경에서 모델을 단일화한다.
  - OpenAI 선택 시: 이미지 URL 기반 렌더링 → `<img src={url}>`
  - Gemini 선택 시: base64 기반 렌더링 → `<img src={"data:image/png;base64," + imageBytes}>`
- 빌드 타임 플래그로 서비스 선택:
  - `VITE_MODEL_PROVIDER=openai | gemini`
  - 앱 내부 분기: 프로바이더에 따라 `services/*Service.ts` 선택
- 브라우저 키 노출 방지: 프록시 API 도입 후 클라이언트는 프록시만 호출

---

문서 버전: v1.0 (초안)
작성일: 자동 생성
