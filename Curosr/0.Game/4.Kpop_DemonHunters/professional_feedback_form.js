function createProfessionalStudyEvaluation() {
  const form = FormApp.create('자소서 AI 활용 역량 강화 프로그램 - 교육 효과성 평가');

  form.setDescription(`
    본 설문은 자소서 AI 활용 교육의 학습 성과와 실무 적용도를 정량적으로 측정하기 위한 전문 평가도구입니다.
    귀하의 솔직하고 구체적인 응답은 교육 품질 개선과 커리큘럼 최적화에 중요한 자료로 활용됩니다.
  `);

  // === 1. 기본 정보 및 배경 ===
  form.addSectionHeaderItem()
    .setTitle('Part 1. 참여자 프로필 및 사전 역량 수준');

  form.addTextItem()
    .setTitle('참여자 식별 코드 (이니셜 + 생년월일 4자리)')
    .setHelpText('예: KHD1995 - 익명성 보장을 위한 추적 코드')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('현재 구직 단계')
    .setChoiceValues([
      '대학교 3학년 (인턴십 준비)',
      '대학교 4학년 (신입 공채 준비)',
      '석사과정 (대학원 + 취업 병행)',
      '경력직 이직 준비 (1-3년차)',
      '경력직 이직 준비 (4년차 이상)',
      '기타'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('스터디 참여 전 AI 도구 사용 경험 (복수선택)')
    .setChoices([
      form.createChoice('ChatGPT (업무/학습용)'),
      form.createChoice('Claude (문서 작성용)'),
      form.createChoice('Gemini (정보 검색용)'),
      form.createChoice('Copilot (코딩 보조)'),
      form.createChoice('Notion AI (노트 정리)'),
      form.createChoice('Grammarly (영문 교정)'),
      form.createChoice('AI 도구 사용 경험 없음'),
      form.createChoice('기타', true)
    ])
    .setRequired(true);

  // === 2. 학습 목표 달성도 평가 ===
  form.addSectionHeaderItem()
    .setTitle('Part 2. 학습 목표 달성도 (사전-사후 비교)');

  const skillItems = [
    '효과적인 AI 프롬프트 설계 및 최적화',
    '자소서 핵심 키워드 발굴 및 배치 전략',
    '경험 기반 스토리텔링 구조화',
    '기업별 맞춤형 자소서 변형 능력',
    'AI 생성 텍스트의 개인화 및 차별화',
    '자소서 품질 자가진단 및 개선 능력'
  ];

  skillItems.forEach(skill => {
    form.addGridItem()
      .setTitle(`「${skill}」 역량 수준`)
      .setRows(['스터디 참여 전', '스터디 참여 후'])
      .setColumns(['1점(초급)', '2점(초중급)', '3점(중급)', '4점(중고급)', '5점(고급)'])
      .setRequired(true);
  });

  // === 3. AI 도구별 숙련도 평가 ===
  form.addSectionHeaderItem()
    .setTitle('Part 3. AI 도구별 활용 숙련도 심화 분석');

  form.addGridItem()
    .setTitle('스터디에서 집중적으로 다룬 AI 도구별 숙련도 향상 정도')
    .setRows(['ChatGPT', 'Claude', 'Gemini', 'Copilot', '기타 도구'])
    .setColumns(['사용하지 않음', '1점(기초)', '2점(활용)', '3점(응용)', '4점(최적화)', '5점(전문가)'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('스터디 후 새롭게 습득한 고급 기법 (복수선택)')
    .setChoices([
      form.createChoice('체인 오브 생각(Chain of Thought) 프롬프팅'),
      form.createChoice('역할 기반(Role-based) 프롬프트 설계'),
      form.createChoice('퓨샷(Few-shot) 학습 기법 활용'),
      form.createChoice('프롬프트 체이닝 및 워크플로우 구축'),
      form.createChoice('AI 출력물 품질 평가 및 반복 개선'),
      form.createChoice('다중 AI 도구 조합 활용'),
      form.createChoice('컨텍스트 윈도우 최적화'),
      form.createChoice('해당사항 없음')
    ]);

  // === 4. 실무 적용도 및 성과 측정 ===
  form.addSectionHeaderItem()
    .setTitle('Part 4. 실무 적용도 및 정량적 성과 지표');

  form.addMultipleChoiceItem()
    .setTitle('스터디 참여 후 실제 자소서 작성 시간 단축 정도')
    .setChoiceValues([
      '시간 단축 효과 없음 (0%)',
      '10-20% 단축',
      '21-40% 단축',
      '41-60% 단축',
      '61-80% 단축',
      '80% 이상 단축',
      '아직 적용해보지 않음'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('AI 도구 활용으로 작성한 자소서의 품질 개선 정도 (자가평가)')
    .setChoiceValues([
      '개선 효과 없음',
      '소폭 개선 (기존 대비 10-20%)',
      '중간 개선 (기존 대비 21-40%)',
      '상당한 개선 (기존 대비 41-60%)',
      '대폭 개선 (기존 대비 61% 이상)',
      '객관적 판단 어려움'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('학습한 내용을 동료나 후배에게 전수할 수 있는 자신감 수준')
    .setBounds(1, 10)
    .setLabels('전혀 자신 없음', '매우 자신 있음')
    .setRequired(true);

  // === 5. 교육 방법론 및 커리큘럼 평가 ===
  form.addSectionHeaderItem()
    .setTitle('Part 5. 교육 설계 및 운영 방식 전문 평가');

  form.addGridItem()
    .setTitle('교육 구성 요소별 효과성 평가')
    .setRows([
      '이론 강의 (AI 원리 및 활용법)',
      '실습 세션 (핸즈온 워크샵)',
      '피어 리뷰 (동료 피드백)',
      '멘토링/코칭 세션',
      '과제 및 프로젝트',
      '사례 연구 및 분석'
    ])
    .setColumns(['1점(비효과적)', '2점', '3점(보통)', '4점', '5점(매우 효과적)'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('가장 효과적이었던 학습 방식')
    .setChoiceValues([
      '강사 주도형 시연 및 설명',
      '참여형 실습 및 즉시 피드백',
      '소그룹 토론 및 협업',
      '개별 코칭 및 1:1 멘토링',
      '자율 학습 및 자기주도적 탐구',
      '경쟁적 과제 수행',
      '사례 기반 문제 해결'
    ])
    .setRequired(true);

  // === 6. 투자 대비 효과 (ROI) 측정 ===
  form.addSectionHeaderItem()
    .setTitle('Part 6. 투자 대비 효과 및 만족도 종합 평가');

  form.addScaleItem()
    .setTitle('투입한 시간과 노력 대비 학습 성과 만족도')
    .setBounds(1, 10)
    .setLabels('전혀 만족하지 않음', '매우 만족함')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('유사한 교육 프로그램 참여 의향')
    .setChoiceValues([
      '적극 참여 희망 (1순위)',
      '조건부 참여 (내용에 따라)',
      '소극적 참여 (시간이 허락한다면)',
      '참여하지 않을 것',
      '판단 보류'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('동료/지인 추천 의향도')
    .setChoiceValues([
      '적극 추천 (Net Promoter Score: 9-10점)',
      '추천 (NPS: 7-8점)',
      '보통 (NPS: 5-6점)',
      '비추천 (NPS: 3-4점)',
      '강력 비추천 (NPS: 0-2점)'
    ])
    .setRequired(true);

  // === 7. 개선 방안 및 발전 제안 ===
  form.addSectionHeaderItem()
    .setTitle('Part 7. 전문가 관점 개선 제안');

  form.addCheckboxItem()
    .setTitle('향후 추가되었으면 하는 고급 모듈 (복수선택)')
    .setChoices([
      form.createChoice('AI 윤리 및 바이어스 대응 방법'),
      form.createChoice('산업별 특화 자소서 전략'),
      form.createChoice('영문 자소서 AI 활용법'),
      form.createChoice('포트폴리오와 연동한 스토리텔링'),
      form.createChoice('면접 대비 AI 활용 전략'),
      form.createChoice('개인 브랜딩 및 SNS 연계'),
      form.createChoice('AI 도구 최신 트렌드 업데이트'),
      form.createChoice('기타', true)
    ]);

  form.addParagraphTextItem()
    .setTitle('교육 효과 극대화를 위한 구체적 개선 제안')
    .setHelpText('커리큘럼, 교수법, 실습 방식, 평가 방법 등 전문가 관점에서의 구체적 제안사항을 기술해주세요.')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('AI 활용 자소서 교육의 미래 발전 방향에 대한 의견')
    .setHelpText('업계 트렌드, 기술 발전, 채용 시장 변화를 고려한 장기적 관점의 제안을 작성해주세요.')
    .setRequired(false);

  // === 8. 정량적 성과 지표 ===
  form.addSectionHeaderItem()
    .setTitle('Part 8. 객관적 성과 측정 (선택사항)');

  form.addMultipleChoiceItem()
    .setTitle('스터디 후 서류 통과율 변화 (실제 지원 경험이 있는 경우)')
    .setChoiceValues([
      '아직 지원하지 않음',
      '통과율 하락',
      '변화 없음',
      '10-30% 향상',
      '31-50% 향상',
      '50% 이상 향상',
      '객관적 비교 어려움'
    ]);

  form.addTextItem()
    .setTitle('스터디 참여 후 가장 인상적인 성과나 변화 (구체적 사례)')
    .setHelpText('예: 특정 기업 서류 통과, 자소서 작성 시간 단축, 새로운 인사이트 발견 등');

  // 폼 설정
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setConfirmationMessage('전문 평가에 참여해주셔서 감사합니다. 귀하의 소중한 피드백은 교육 품질 향상에 중요한 자료로 활용됩니다.');

  // URL 생성 및 반환
  const formUrl = form.getPublishedUrl();
  console.log('전문가급 평가 폼이 생성되었습니다!');
  console.log('폼 URL: ' + formUrl);
  console.log('폼 편집 URL: ' + form.getEditUrl());

  return {
    formUrl: formUrl,
    editUrl: form.getEditUrl(),
    formId: form.getId()
  };
}

// 실행 함수
function runProfessionalEvaluation() {
  const result = createProfessionalStudyEvaluation();
  Logger.log('=== 전문가급 교육 평가 폼 생성 완료 ===');
  Logger.log('공유용 URL: ' + result.formUrl);
  Logger.log('편집용 URL: ' + result.editUrl);
  Logger.log('폼 ID: ' + result.formId);
}