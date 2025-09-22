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

const storySystemPrompt = `주어진 3개 영어 단어로 한국 남성의 자조적 실패담을 만들어라.

필수 조건:
* 주인공: 반드시 남성 (he/him 사용 필수)
* 분량: 영어 2문장, 80-120자 이내
* 구조: 1) 남성이 무언가 시도 → 2) 예측 가능한 실패 + 체념적 결말

스토리 패턴 (반드시 따를 것):
- 문장 1: "He tried to [동사] + [상황설정]" (첫 번째 단어 포함)
- 문장 2: "The only [두 번째 단어] was [실패상황], [세 번째 단어] + [구체적 물건]"

체념적 톤 필수:
- "역시 그럴 줄 알았다" "당연히" "결국" 같은 포기/체념 어조
- 한국 남성의 일상 실패 상황 (다이어트, 운동, 자기계발, 연애, 돈관리)
- 구체적 물건과 함께 현실적 패배감 표현

출력 형식 (JSON):
{
  "englishStory": "정확히 2문장의 영어 스토리",
  "koreanTranslation": "체념적 톤의 한국어 번역 (단어 옆 영어 원형 표기)",
  "imagePrompt": "한 장면 묘사 (영어)"
}

완벽한 예시:
예시 ① (abandon, guarantee, failure)
{
  "englishStory": "He tried to abandon junk food and bought a gym pass. The only guarantee was muscle pain, and the familiar failure came with late-night pizza.",
  "koreanTranslation": "그는 패스트푸드를 버리고(abandon) 헬스장 등록을 했다. 하지만 보장된(guarantee) 건 근육통뿐, 결국 돌아온 건 새벽 피자 앞에서의 실패(failure) 였다.",
  "imagePrompt": "A man eating pizza while looking at unused gym membership card on table"
}

예시 ② (ignore, deadline, success)
{
  "englishStory": "He tried to ignore the deadline by brewing coffee at midnight. The only success was spilling it all over his report, now ruined like him.",
  "koreanTranslation": "그는 새벽에 커피를 내리며 마감일(deadline)을 무시(ignore) 했다. 그의 유일한 성공(success)은 보고서에 커피를 쏟아, 일과 인생을 동시에 태워버린 거였다.",
  "imagePrompt": "A student with spilled coffee on papers, looking defeated at his desk late at night"
}

반드시 이 패턴과 톤을 정확히 따라 남성 주인공의 체념적 실패담을 만들어라.`;


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