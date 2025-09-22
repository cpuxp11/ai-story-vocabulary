
import { GoogleGenAI, Type } from "@google/genai";
import type { StoryResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const storyPromptTemplate = (words: string[]): string => `
다음 영어 단어 3개(${words.join(', ')})를 자연스럽게 포함하여 유병재 스타일 한국어 코미디를 써주세요.

조건:
- 한국어로 직접 작성 (영어 단어는 한국인이 실제로 쓰는 방식으로 자연스럽게 섞어 넣기)
- 길이: 한국어 2-3문장, 60-100자 정도
- 톤: 자조적, 담담하고 씁쓸한 일상 유머 (유병재 특유의 건조한 톤)
- 상황: 20-30대 한국인의 혼자 있는 일상 장면
- 소품: 구체적인 한국 문화 소품 반드시 포함 (치킨박스, 배달앱, 편의점 도시락, 알람시계 등)
- 구조: 첫 문장에서 상황 설명, 두 번째 문장에서 현실적 반전
- 반전: 기대 vs 현실, 계획 vs 좌절의 아이러니
- 일상 소재: 다이어트, 알바, 연애, 돈, 배달음식, 야근 등 공감 가능한 상황

작성 가이드:
- "진짜", "완전", "대박", "ㄹㅇ" 같은 자연스러운 한국어 강조 표현 활용
- 영어 단어는 감정(stress, depressed), 기술(app, WiFi), 강조(literally, exactly) 등에서 자연스럽게 사용
- 한국어 문법 구조 유지하면서 영어 단어 자연스럽게 삽입
- 20-30대가 카톡이나 인스타에 실제로 쓸 법한 표현

출력은 반드시 JSON 형식이어야 한다.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    koreanStory: {
      type: Type.STRING,
      description: "유병재 스타일로 작성된 한국어 코미디 스토리, 영어 단어가 자연스럽게 섞인 2-3문장"
    },
    englishTranslation: {
      type: Type.STRING,
      description: "한국어 스토리의 영어 번역, 2-3 sentences long"
    },
    imagePrompt: {
      type: Type.STRING,
      description: "이미지 생성을 위한 간단하고 명확한 한 장면 묘사"
    }
  },
  required: ["koreanStory", "englishTranslation", "imagePrompt"],
};


export const generateStory = async (words: string[]): Promise<StoryResult> => {
  try {
    const prompt = storyPromptTemplate(words);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.0,
      }
    });

    const jsonText = response.text.trim();
    // Sometimes the response might be wrapped in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const parsedResult = JSON.parse(cleanedJsonText);

    if (
      !parsedResult.koreanStory ||
      !parsedResult.englishTranslation ||
      !parsedResult.imagePrompt
    ) {
      throw new Error("Invalid story format received from API.");
    }
    
    return parsedResult as StoryResult;

  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story from Gemini API.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, cartoonish, simple illustration, funny, sad`,
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
