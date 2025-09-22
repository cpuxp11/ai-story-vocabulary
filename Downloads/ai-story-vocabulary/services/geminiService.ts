import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { StoryResult } from '../types';

const GEMINI_API_KEY = process.env.API_KEY; // Gemini용 환경변수 주입 (vite.define 통해 빌드 타임 주입)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // OpenAI용 환경변수 주입 (브라우저 노출 주의)

if (!GEMINI_API_KEY) {
  throw new Error("The API_KEY environment variable for Gemini is not set.");
}
if (!OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable for OpenAI is not set.");
}

// Gemini AI for image generation
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// OpenAI for text generation
const openai = new OpenAI({ 
  apiKey: OPENAI_API_KEY!, // 환경변수 존재 보장 후 사용
  dangerouslyAllowBrowser: true,
});

const storySystemPrompt = `당신은 유병재 스타일 영어 마이크로 스토리 작가입니다.

📝 임무: 주어진 3개 영어 단어로 유병재식 2문장 스토리 작성

🎭 유병재 스타일 핵심 공식:
- 문장 1: 평범한 상황 설정 + 1번째 단어
- 문장 2: 기대감 조성 + 2번째 단어
- 문장 3: 현실 반전 + 3번째 단어 + 구체적 사물
- 패턴: "역시 나한테 이런 일이" 에너지

🔧 필수 요소:
✓ 정확히 3문장
✓ 주인공 1명 (자조적 캐릭터)
✓ 구체적 사물 1개 (음식/가구/기기)
✓ 일상 소재 (다이어트, 알바, 연애, 시험, 돈)
✓ 계획 vs 현실의 씁쓸한 반전

📤 출력 형식 (JSON):
{
  "englishStory": "정확히 3문장의 영어 스토리",
  "koreanTranslation": "유병재 톤 번역 (단어 옆에 영어 원형 표기)",
  "imagePrompt": "한 장면 묘사 (영어)"
}

💯 완벽한 예시:

단어: abandon, guarantee, failure
{
  "englishStory": "He tried to abandon junk food and bought a gym membership. The trainer guaranteed visible results in just two weeks. The only failure was him, now eating fried chicken while staring at his unused gym card.",
  "koreanTranslation": "그는 정크푸드를 포기하고(abandon) 헬스장을 끊었다. 트레이너는 2주 안에 눈에 띄는 효과를 보장했다(guarantee). 하지만 실패한(failure) 건 결국 자신이었고, 지금 그는 사용하지 않는 헬스장 카드를 바라보며 치킨을 먹고 있다.",
  "imagePrompt": "A man sitting at a small table eating fried chicken while looking sadly at a gym membership card, late at night"
}

단어: procrastinate, deadline, disaster
{
  "englishStory": "He decided to procrastinate one more day before starting his assignment. The deadline was still three days away, plenty of time he thought. The disaster wasn't the failing grade, but realizing he'd been checking last month's calendar.",
  "koreanTranslation": "그는 과제를 시작하기 전에 하루만 더 미루기로(procrastinate) 했다. 마감일(deadline)까지 아직 3일이나 남았으니 충분하다고 생각했다. 진짜 재앙(disaster)은 낙제점이 아니라, 자신이 지난달 달력을 보고 있었다는 걸 깨달은 순간이었다.",
  "imagePrompt": "A confused student looking at a wall calendar with his finger pointing at the wrong month, papers scattered on desk"
}

이제 주어진 3개 단어로 동일한 패턴의 스토리를 만드세요.`;


export const generateStory = async (words: string[]): Promise<StoryResult> => {
  try {
    const userPrompt = `Generate a story using these three words: ${words.join(', ')}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: storySystemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 1.0,
    });

    const jsonText = completion.choices[0]?.message?.content;
    if (!jsonText) {
      throw new Error("No response content from OpenAI API.");
    }

    const parsedResult = JSON.parse(jsonText);

    if (
      !parsedResult.englishStory || 
      !parsedResult.koreanTranslation || 
      !parsedResult.imagePrompt
    ) {
      throw new Error("Invalid story format received from API.");
    }
    
    return parsedResult as StoryResult;

  } catch (error) {
    console.error("Error generating story with OpenAI:", error);
    if (error instanceof OpenAI.APIError && error.status === 401) {
       throw new Error("Authentication error with OpenAI. Please check your OPENAI_API_KEY.");
    }
    throw new Error("Failed to generate story from OpenAI API.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, in the style of Duolingo, featuring a cute Duolingo character, vector illustration, simple, vibrant colors, funny but slightly sad scene`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image from Imagen API.");
  }
};