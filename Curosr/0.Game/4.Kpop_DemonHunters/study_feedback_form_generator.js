function createStudyFeedbackForm() {
  // 새로운 Google Form 생성
  const form = FormApp.create('자소서 AI 스터디 후기 설문조사');

  // 폼 설명 추가
  form.setDescription('자소서 AI 스터디에 참여해주셔서 감사합니다. 스터디 개선을 위해 솔직한 후기를 남겨주세요.');

  // 1. 기본 정보
  form.addTextItem()
    .setTitle('이름 (닉네임 가능)')
    .setRequired(true);

  // 2. 전체적인 만족도
  form.addScaleItem()
    .setTitle('스터디 전체 만족도를 평가해주세요')
    .setBounds(1, 5)
    .setLabels('매우 불만족', '매우 만족')
    .setRequired(true);

  // 3. AI 도구 활용도
  form.addMultipleChoiceItem()
    .setTitle('스터디에서 주로 사용한 AI 도구는 무엇인가요? (복수 선택 가능)')
    .setChoiceValues([
      'ChatGPT',
      'Claude',
      'Gemini',
      'Copilot',
      '기타'
    ])
    .showOtherOption(true);

  // 4. 자소서 작성 개선 정도
  form.addScaleItem()
    .setTitle('AI를 활용한 후 자소서 작성 실력이 얼마나 향상되었다고 생각하시나요?')
    .setBounds(1, 5)
    .setLabels('전혀 향상되지 않음', '매우 많이 향상됨')
    .setRequired(true);

  // 5. 가장 도움이 된 부분
  form.addCheckboxItem()
    .setTitle('스터디에서 가장 도움이 된 부분은 무엇인가요? (복수 선택 가능)')
    .setChoices([
      form.createChoice('AI 프롬프트 작성법'),
      form.createChoice('자소서 구조 설계'),
      form.createChoice('키워드 발굴 및 정리'),
      form.createChoice('문장 다듬기 및 표현력 향상'),
      form.createChoice('경험 스토리 구성법'),
      form.createChoice('AI 도구별 특징 및 활용법'),
      form.createChoice('기타', true) // 기타 옵션 추가
    ]);

  // 6. 난이도 평가
  form.addMultipleChoiceItem()
    .setTitle('스터디 난이도는 어떠셨나요?')
    .setChoiceValues([
      '너무 쉬웠다',
      '적당했다',
      '조금 어려웠다',
      '매우 어려웠다'
    ])
    .setRequired(true);

  // 7. 시간 구성
  form.addMultipleChoiceItem()
    .setTitle('스터디 시간 구성은 어떠셨나요?')
    .setChoiceValues([
      '너무 짧았다',
      '적당했다',
      '조금 길었다',
      '너무 길었다'
    ]);

  // 8. 추천 의향
  form.addScaleItem()
    .setTitle('이 스터디를 다른 사람에게 추천하고 싶으신가요?')
    .setBounds(1, 5)
    .setLabels('전혀 추천하지 않음', '적극 추천함')
    .setRequired(true);

  // 9. 개선 사항
  form.addParagraphTextItem()
    .setTitle('스터디에서 개선되었으면 하는 부분이 있다면 자유롭게 작성해주세요')
    .setRequired(false);

  // 10. 추가 스터디 참여 의향
  form.addMultipleChoiceItem()
    .setTitle('향후 비슷한 스터디가 있다면 참여하고 싶으신가요?')
    .setChoiceValues([
      '적극 참여하고 싶다',
      '내용에 따라 참여하고 싶다',
      '잘 모르겠다',
      '참여하지 않을 것 같다'
    ]);

  // 11. 자유 의견
  form.addParagraphTextItem()
    .setTitle('기타 의견이나 후기를 자유롭게 남겨주세요')
    .setRequired(false);

  // 응답 수집 설정
  form.setCollectEmail(false); // 이메일 수집 안함
  form.setLimitOneResponsePerUser(false); // 중복 응답 허용

  // 완료 메시지 설정
  form.setConfirmationMessage('후기 작성해주셔서 감사합니다! 소중한 의견은 다음 스터디 개선에 반영하겠습니다.');

  // 폼 URL 로그 출력
  const formUrl = form.getPublishedUrl();
  console.log('폼이 생성되었습니다!');
  console.log('폼 URL: ' + formUrl);
  console.log('폼 편집 URL: ' + form.getEditUrl());

  return {
    formUrl: formUrl,
    editUrl: form.getEditUrl(),
    formId: form.getId()
  };
}

// 실행 함수
function main() {
  const result = createStudyFeedbackForm();

  // 결과를 시트에 저장하거나 이메일로 전송할 수도 있음
  Logger.log('생성된 폼 정보:');
  Logger.log('공유 URL: ' + result.formUrl);
  Logger.log('편집 URL: ' + result.editUrl);
  Logger.log('폼 ID: ' + result.formId);
}