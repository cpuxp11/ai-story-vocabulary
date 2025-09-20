function createSimpleFeedbackForm() {
  const form = FormApp.create('자소서 챌린지 1기 후기');

  form.setDescription('자소서 챌린지 1기에 참여해주셔서 감사합니다! 간단한 후기를 남겨주세요 😊');

  // 1. 기본 정보
  form.addTextItem()
    .setTitle('닉네임')
    .setRequired(true);

  // 2. 전체 만족도
  form.addScaleItem()
    .setTitle('전체적으로 만족하시나요?')
    .setBounds(1, 5)
    .setLabels('별로예요', '정말 좋아요!')
    .setRequired(true);

  // 3. 가장 도움된 부분
  const helpfulItems = form.addCheckboxItem()
    .setTitle('어떤 부분이 가장 도움이 되었나요? (복수선택 가능)')
    .setRequired(true);

  helpfulItems.setChoices([
    helpfulItems.createChoice('AI 프롬프트 작성법 배우기'),
    helpfulItems.createChoice('자소서 구조 잡는 법'),
    helpfulItems.createChoice('경험을 글로 풀어내는 방법'),
    helpfulItems.createChoice('키워드 찾기 및 활용'),
    helpfulItems.createChoice('다른 사람들과 팁 공유'),
    helpfulItems.createChoice('노션에서 자료 정리하기'),
    helpfulItems.createChoice('AI 도구 활용법')
  ]);
  helpfulItems.showOtherOption(true);

  // 4. AI 도구 사용 변화
  form.addMultipleChoiceItem()
    .setTitle('챌린지 후 AI 도구 사용이 어떻게 달라졌나요?')
    .setChoiceValues([
      '이전보다 훨씬 잘 활용하게 되었다',
      '조금 더 잘 쓰게 되었다',
      '큰 변화는 없다',
      'AI 도구를 처음 써봤다',
      '아직 잘 모르겠다'
    ])
    .setRequired(true);

  // 5. 자소서 작성 자신감
  form.addScaleItem()
    .setTitle('자소서 쓰는 자신감이 늘었나요?')
    .setBounds(1, 5)
    .setLabels('전혀 안늘었어요', '많이 늘었어요!')
    .setRequired(true);

  // 6. 추천 의향
  form.addMultipleChoiceItem()
    .setTitle('친구들에게 추천하고 싶나요?')
    .setChoiceValues([
      '적극 추천하고 싶다!',
      '추천할 것 같다',
      '글쎄.. 잘 모르겠다',
      '별로 추천하지 않을 것 같다'
    ])
    .setRequired(true);

  // 7. 아쉬웠던 점
  form.addParagraphTextItem()
    .setTitle('아쉬웠던 점이나 개선했으면 하는 부분이 있다면?')
    .setRequired(false);

  // 8. 가장 기억에 남는 것
  form.addParagraphTextItem()
    .setTitle('챌린지에서 가장 기억에 남는 것은?')
    .setRequired(false);

  // 9. 다음 챌린지 참여 의향
  form.addMultipleChoiceItem()
    .setTitle('다음에 비슷한 챌린지가 있다면 참여하실건가요?')
    .setChoiceValues([
      '무조건 참여!',
      '내용 보고 결정',
      '시간 되면 참여',
      '참여 안할 것 같아요'
    ]);

  // 10. 자유 한마디
  form.addParagraphTextItem()
    .setTitle('마지막으로 하고 싶은 말이 있다면 자유롭게 써주세요!')
    .setRequired(false);

  // 폼 설정
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setConfirmationMessage('후기 남겨주셔서 정말 감사합니다! 다음 챌린지도 기대해주세요 🎉');

  // URL 반환
  const formUrl = form.getPublishedUrl();
  console.log('자소서 챌린지 후기 폼 완성!');
  console.log('공유 URL: ' + formUrl);
  console.log('편집 URL: ' + form.getEditUrl());

  return {
    formUrl: formUrl,
    editUrl: form.getEditUrl(),
    formId: form.getId()
  };
}

// 실행 함수
function createForm() {
  const result = createSimpleFeedbackForm();
  Logger.log('🎯 자소서 챌린지 후기 폼 생성 완료!');
  Logger.log('📝 공유용 URL: ' + result.formUrl);
  Logger.log('✏️ 편집용 URL: ' + result.editUrl);
}