import OpenAI from 'openai';
import type { StoryResult } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_OPENAI_API_KEY environment variable not set.");
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

const storyPromptTemplate = (words: string[]): string => `
다음 3개의 영어 단어(${words.join(', ')})를 모두 포함하는 짧은 영어 스토리를 작성하라.

조건:
- 톤: 한국 코미디언 유병재 스타일. (자조적, 블랙코미디, 일상 속 과장, 씁쓸한 유머)
- 분량: 영어 2~3문장, 총 80~120자 이내.
- 단어 사용: 주어진 3개의 영어 단어를 반드시 한 번 이상 자연스럽게 사용.
- 장면: 하나의 장면으로 끝낼 것. 인물은 반드시 1명만 등장. (다른 인물은 간접 표현·메모·음식·사물 등으로 처리)
- 오브젝트: 반드시 구체적 오브젝트 포함 (예: 책상, 치킨 박스, 알람시계 등).
- 스토리는 읽는 순간 바로 이미지화될 수 있어야 함.
- 일상 공감 소재를 반드시 넣어라 (예: 다이어트, 알바, 연애, 시험, 돈, 배달 음식).
- 아이러니/반전이 반드시 있어야 한다 (계획 vs 현실, 기대 vs 좌절).

출력은 반드시 JSON 형식이어야 한다.
{
  "englishStory": "The generated story in English, 2-3 sentences long.",
  "koreanTranslation": "The Korean translation in Yoo Byung-jae's style, with original English words in parentheses.",
  "imagePrompt": "A simple, clear prompt describing a single scene for image generation."
}
`;

export const generateStory = async (words: string[]): Promise<StoryResult> => {
  try {
    const prompt = storyPromptTemplate(words);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative writer specializing in Korean comedian Yoo Byung-jae's style of humor. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 1.0,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI API.");
    }

    const parsedResult = JSON.parse(content);

    if (
      !parsedResult.englishStory ||
      !parsedResult.koreanTranslation ||
      !parsedResult.imagePrompt
    ) {
      throw new Error("Invalid story format received from API.");
    }

    return parsedResult as StoryResult;

  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story from OpenAI API.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, cartoonish, simple illustration, funny, sad`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL received from OpenAI API.");
    }

    return imageUrl;

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image from OpenAI API.");
  }
};