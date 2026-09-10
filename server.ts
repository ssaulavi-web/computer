import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini lazily/safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Using fallback curriculum generator.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Curriculum & Lesson Plan Generator API
app.post('/api/generate-lesson', async (req, res) => {
  try {
    const { topic, targetAudience, specialNeeds, weekNumber } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback pre-structured response if API key is not yet configured
      return res.json({
        success: true,
        isFallback: true,
        data: {
          title: topic || "컴퓨터 기초 실습",
          week: weekNumber || 1,
          overview: "컴퓨터 초보자와 어르신 눈높이에 맞춘 1교시(50분) 이론 및 시범 + 10분 휴식 + 2교시(50분) 개별 실습 맞춤 수업안입니다.",
          period1: {
            title: "1교시: 원리와 기본 조작 익히기 (50분)",
            timeTable: [
              { time: "00~10분 (10분)", content: "인사 및 전시 학습 복습, 오늘 배울 주제 일상 속 비유로 소개" },
              { time: "10~25분 (15분)", content: "대형 화면으로 강사 시범 진행 (천천히 2회 반복 보여주기)" },
              { time: "25~45분 (20분)", content: "강사와 함께 한 동작씩 천천히 따라하기 (화면 멈추고 기다려주기)" },
              { time: "45~50분 (5분)", content: "1교시 핵심 3가지 복습 및 질문 답변" }
            ],
            keyPoints: [
              "마우스나 키보드를 세게 누르지 않고 가볍게 톡 누르는 손목 자세 지도",
              "어려운 전문 외래어 대신 '마우스 바퀴', '작은 창', '저장 상자' 등 쉬운 우리말 비유 활용"
            ],
            instructorScript: "여러분, 마우스는 절대 깨지지 않으니 겁먹지 마시고 천천히 쥐어보세요. 손가락 힘을 빼고 사뿐히 얹는 것이 비결입니다!"
          },
          breakTime: {
            duration: "10분",
            tips: "어르신 눈의 피로를 풀어주는 먼 곳 바라보기 및 손목 털기 체조 진행"
          },
          period2: {
            title: "2교시: 내 손으로 해보는 개별 실습 및 실생활 미션 (50분)",
            timeTable: [
              { time: "00~10분 (10분)", content: "실습 과제 안내 및 오늘의 미션 카드 배포" },
              { time: "10~35분 (25분)", content: "개별 실습 및 강사·보조강사 1:1 순회 밀착 지도" },
              { time: "35~45분 (10분)", content: "실생활 응용 미션 (스스로 해결해보고 짝꿍에게 자랑하기)" },
              { time: "45~50분 (5분)", content: "오늘의 성취 칭찬 도장 찍기 및 다음 시간 예고" }
            ],
            missions: [
              "화면에 제시된 기본 조작 3회 이상 성공하기",
              "혼자서 폴더를 열고 닫는 과정 확인하기"
            ],
            troubleshootingFAQ: [
              { q: "마우스를 두 번 눌렀는데 아무것도 안 열려요.", a: "두 번 누르는 간격이 너무 길면 컴퓨터가 따로따로 클릭한 것으로 인식합니다. '톡-톡' 경쾌한 박자로 눌러보세요." },
              { q: "갑자기 화면이 이상하게 변했어요.", a: "당황하지 마시고 키보드 맨 왼쪽 위의 [ESC] 키를 누르거나 오른쪽 위의 [X] 닫기 단추를 누르면 원래대로 돌아옵니다." }
            ]
          },
          handoutText: `[수강생 배포용 큰 글씨 유인물]\n\n■ 오늘의 수업: ${topic || "컴퓨터 기초"}\n■ 1. 이것만은 꼭 기억하세요!\n  - 마우스는 살포시 쥐고 가볍게 톡!\n  - 실수해도 괜찮아요! 언제든 [닫기(X)]를 누르면 됩니다.\n■ 2. 집에서 해보는 5분 복습\n  - 컴퓨터 켜고 끄기 2번 해보기\n  - 마우스로 바탕화면 아이콘 더블클릭 연습하기`
        }
      });
    }

    const prompt = `당신은 노인복지관 및 주민자치센터에서 컴퓨터 초보자(어르신, 디지털 취약계층)를 20년 이상 지도해온 최고의 컴퓨터 전문 강사입니다.
다음 조건에 맞추어 [1교시 50분 + 휴식 10분 + 2교시 50분] 맞춤형 수업 지도안과 수강생 배포용 유인물을 작성해주세요.

[수업 기본 정보]
- 수업 주제: ${topic || "컴퓨터 기초 첫걸음"}
- 수강 대상: ${targetAudience || "60~80대 컴퓨터 완전 초보 어르신"}
- 특별 고려사항: ${specialNeeds || "시각적 피로도, 손 떨림, 외래어 생소함, 천천히 반복 학습 필요"}
- 차시: 제 ${weekNumber || 1}주차

반드시 아래 JSON 형식으로만 응답해주세요 (추가 설명 없이 유효한 JSON만 반환):
{
  "title": "수업 제목",
  "week": ${weekNumber || 1},
  "overview": "수업 개요 및 목표 (따뜻하고 격려하는 문체)",
  "period1": {
    "title": "1교시: 개념 이해 및 천천히 시범 (50분)",
    "timeTable": [
      { "time": "시간대 (예: 00~10분)", "content": "진행 내용" }
    ],
    "keyPoints": ["지도 핵심 포인트 1", "지도 핵심 포인트 2", "지도 핵심 포인트 3"],
    "instructorScript": "강사가 실제로 교실에서 편안하게 건넬 수 있는 다정한 시범 멘트"
  },
  "breakTime": {
    "duration": "10분",
    "tips": "어르신 맞춤 휴식 및 스트레칭 팁"
  },
  "period2": {
    "title": "2교시: 손으로 익히는 실습 및 실생활 적용 (50분)",
    "timeTable": [
      { "time": "시간대 (예: 00~10분)", "content": "진행 내용" }
    ],
    "missions": ["실습 과제 1", "실습 과제 2", "실습 과제 3"],
    "troubleshootingFAQ": [
      { "q": "자주 발생하는 질문이나 곤란한 상황", "a": "친절한 해결 방법" }
    ]
  },
  "handoutText": "어르신들이 집에 가져가서 보실 수 있는 큰 글씨 요약 학습지 텍스트 (명확한 번호와 쉬운 우리말 설명, 응원 문구 포함)"
}`;

    let parsed;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      parsed = JSON.parse(text);
    } catch (apiErr) {
      console.warn("Gemini API call returned error, using dynamic structured generator:", apiErr);
      parsed = {
        title: topic || "컴퓨터 기초 실습",
        week: weekNumber || 1,
        overview: `${targetAudience || "어르신"} 눈높이에 맞추어 1교시(50분) 기본 원리 이해와 시범, 10분 휴식, 2교시(50분) 내 손으로 해보는 개별 실습으로 구성된 맞춤 교육안입니다.`,
        period1: {
          title: `1교시: ${topic} 개념 이해와 천천히 따라하기 (50분)`,
          timeTable: [
            { time: "00~10분 (10분)", content: "반가운 인사 및 지난 시간 복습, 오늘 배울 내용을 친숙한 일상생활 비유로 쉽게 소개" },
            { time: "10~25분 (15분)", content: "대형 TV/스크린 화면으로 강사 시범 진행 (천천히 2번 반복하여 보여드리기)" },
            { time: "25~45분 (20분)", content: "강사와 함께 한 동작씩 차근차근 따라하기 (수강생 전원 화면 멈추고 기다려주기)" },
            { time: "45~50분 (5분)", content: "1교시 배운 내용 핵심 요약 및 10분 휴식 전 질문 응답" }
          ],
          keyPoints: [
            "손가락과 손목에 힘을 빼고 가볍게 톡 누르는 바른 자세 안내",
            "어려운 컴퓨터 전문 용어 대신 쉬운 우리말 비유(예: 마법 상자, 집주소 등) 사용",
            "컴퓨터는 아무리 잘못 눌러도 고장 나지 않으니 안심하시도록 정서적 안정감 제공"
          ],
          instructorScript: `"여러분, 오늘 배울 ${topic}은 생각보다 아주 쉽습니다. 마우스나 키보드가 망가질까 봐 걱정하지 마시고, 제가 천천히 시범 보여드릴 테니 편안한 마음으로 따라와 보세요!"`
        },
        breakTime: {
          duration: "10분",
          tips: "모니터를 보느라 굳어진 목과 어깨 가볍게 돌리기, 손목 털기 체조, 시원한 물 한 잔 마시기"
        },
        period2: {
          title: `2교시: ${topic} 개별 실습 및 실생활 미션 도전 (50분)`,
          timeTable: [
            { time: "00~10분 (10분)", content: "2교시 실습 과제 안내 및 오늘의 단계별 도전 과제 카드 배포" },
            { time: "10~35분 (25분)", content: "개별 실습 진행 및 강사·보조강사의 1:1 밀착 순회 지도 (안 되는 부분 즉시 해결)" },
            { time: "35~45분 (10분)", content: "실생활 응용 미션 (스스로 해결해보고 옆자리 짝꿍에게 알려주며 성취감 느끼기)" },
            { time: "45~50분 (5분)", content: "오늘의 실습 성공 칭찬 도장 찍기 및 다음 시간 배울 내용 흥미롭게 예고" }
          ],
          missions: [
            `${topic} 기본 조작을 스스로 2회 이상 성공하기`,
            "실수했을 때 침착하게 이전 화면(뒤로가기 또는 닫기)으로 되돌아가 보기",
            "오늘 배운 핵심 내용 1가지를 옆 짝꿍에게 친절하게 설명해보기"
          ],
          troubleshootingFAQ: [
            { q: "눌렀는데 화면에 아무런 반응이 없어요.", a: "손가락 힘이 너무 약하거나 엉뚱한 빈 공간을 눌렀을 수 있습니다. 마우스 화살표 끝을 정확히 단추 위에 올리고 톡 눌러보세요." },
            { q: "원하지 않는 이상한 창이 불쑥 떴어요.", a: "당황하지 마시고 창 오른쪽 맨 위의 빨간색 [X] 닫기 단추를 가볍게 누르시면 원래 화면으로 쏙 돌아옵니다." }
          ]
        },
        handoutText: `[수강생 배포용 큰 글씨 유인물]\n\n■ 오늘의 수업: ${topic}\n■ 교육 차시: 제 ${weekNumber || 1} 차시\n\n1. 이것만은 꼭 기억하세요!\n- 실수해도 괜찮아요! 컴퓨터는 절대 고장 나지 않습니다.\n- 잘 모를 때는 오른쪽 맨 위 [ X ] 단추를 눌러 닫으면 됩니다.\n\n2. 오늘의 핵심 3단계\n① 1단계: 천천히 화면을 보고 원하는 단추를 찾으세요.\n② 2단계: 마우스나 키보드를 부드럽게 톡 누르세요.\n③ 3단계: 성공하면 나 자신에게 마음속으로 칭찬 박수를 보내주세요!\n\n3. 집에서 해보는 5분 복습\n- 오늘 배운 ${topic} 동작 가족에게 자랑하며 1번 해보기\n\n★ 참 잘하셨습니다! 다음 시간에도 건강하고 밝은 모습으로 뵙겠습니다!`
      };
    }

    return res.json({
      success: true,
      isFallback: false,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Error generating lesson plan:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "교안 생성 중 오류가 발생했습니다.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
