# 루미–진우 러브라인 게임 시나리오 분기 구조

본 문서는 원작(World Bible)을 기반으로 제작된 인터랙티브 게임용 branching narrative 설계 문서입니다.  
대상 독자: 내러티브 디자이너, 게임 개발자

---

## 1. 주요 변수 정의 (State / Flag)

- 신뢰도 (JinwooTrust): 수치형 (0~100)
- 문양 단계 (CurseMark): 정수형 (0~10)
- 멤버 신뢰도 (TeamTrust): 수치형 (0~100)
- 팬덤 지표 (Fandom): 정수형 (상대 지표)
- 플래그 (Flags):  
  - JinwooMeet = TRUE/FALSE  
  - Betrayal = TRUE/FALSE  
  - SoloRoute = TRUE/FALSE  

---

## 2. 시나리오 구조 (Acts & Branches)

### Act 1: 첫 만남
- 선택지:  
  - “과거를 듣는다” → JinwooTrust +20, CurseMark -1  
  - “거절한다” → JinwooTrust -20, CurseMark +1  
- 조건: JinwooTrust ≤ 0 → **조기 탈락 엔딩**

### Act 2: 공연 무대
- 선택지:  
  - Golden → Fandom +, TeamTrust +  
  - Takedown → Fandom 폭발, 루미 멘탈 ↓  
- 조건: Golden 고집 + TeamTrust < 40 → **솔로 엔딩**

### Act 3: 협력의 갈림길
- 조건: JinwooTrust ≥ 60 → 협력 수락 (Free 듀엣)  
- 조건: JinwooTrust < 60 → 배신 플래그 발동  
- 조건: JinwooTrust ↑ + CurseMark ≥ 5 → **배신 로맨스 엔딩**

### Act 4: 스타디움 결전 (Funnel)
- 모든 루트 합류  
- 엔딩 분기:  
  - 진우 희생 + 루미 자기수용 → **트루 엔딩**  
  - 진우 배신 지속 → **배드 엔딩**  
  - 루미 단독 각성 → **오픈 엔딩**

---

## 3. 엔딩 매트릭스

| 엔딩명             | 조건                             | 결과 |
|-------------------|--------------------------------|------|
| 조기 탈락 엔딩    | Act1 신뢰도 ≤ 0                | 루미 목소리 상실, 활동 중단 |
| 솔로 엔딩         | Golden 고집 + 팀 신뢰 < 40     | 헌트릭스 붕괴, 루미 단독 활동 |
| 배신 로맨스 엔딩  | 진우 신뢰 ≥ 60 + 문양 ≥ 5       | 루미, 진우와 함께 악령 진영 합류 |
| 트루 엔딩         | 진우 희생 + 루미 자기수용       | 무지개 혼문 완성 |
| 배드 엔딩         | 진우 배신 지속                  | 귀마 소환, 인류 멸망 |
| 오픈 엔딩         | 루미 단독 각성                  | 불완전한 혼문, 헌트릭스 재결합 |

