import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Loader2, BookOpen, CheckCircle, AlertCircle, Printer, Copy } from 'lucide-react';
import { CurriculumWeek, LessonPlan } from '../../types';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCurriculum: (newWeek: CurriculumWeek) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddCurriculum,
}) => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('60~80대 컴퓨터 완전 초보 어르신');
  const [specialNeeds, setSpecialNeeds] = useState('시각적 피로도 배려, 손목 떨림, 외래어 생소함, 천천히 반복 설명 필요');
  const [weekNumber, setWeekNumber] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const presetTopics = [
    '스마트폰 사진 컴퓨터로 옮겨서 가족 앨범 만들기',
    '카카오톡 PC버전 설치해서 자녀와 큰 화면으로 채팅하기',
    '정부24에서 주민등록등본 무료로 집에서 발급받기',
    '유튜브에서 좋아하는 트로트 노래 모음집 연속 듣기',
    '인터넷으로 코레일 추석/설날 기차표 예매하기',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetAudience,
          specialNeeds,
          weekNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '교안 생성 실패');
      }

      setGeneratedPlan(data.data);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err?.message || '교안을 생성하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToCurriculum = () => {
    if (!generatedPlan) return;

    const newWeekItem: CurriculumWeek = {
      id: `custom-week-${Date.now()}`,
      weekNumber: generatedPlan.week || weekNumber,
      title: generatedPlan.title,
      subtitle: `${generatedPlan.period1?.title || '1교시'} + ${generatedPlan.period2?.title || '2교시'}`,
      summary: generatedPlan.overview,
      iconName: 'Sparkles',
      period1Summary: `1교시 (50분): ${generatedPlan.period1?.title || '개념 및 시범'}`,
      period2Summary: `2교시 (50분): ${generatedPlan.period2?.title || '실습 및 응용'}`,
      lessonPlan: generatedPlan,
    };

    onAddCurriculum(newWeekItem);
    onClose();
  };

  const handleCopyHandout = () => {
    if (!generatedPlan?.handoutText) return;
    navigator.clipboard.writeText(generatedPlan.handoutText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">AI 맞춤 수업 교안 및 유인물 자동 생성기</h3>
              <p className="text-xs text-amber-100 mt-0.5">
                1교시(50분) + 10분 휴식 + 2교시(50분) 표준 강사 지도안 & 큰 글씨 유인물 생성
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {!generatedPlan ? (
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-extrabold text-stone-800 mb-1.5">
                  수업하고 싶은 주제를 입력하세요 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="예: 스마트폰 사진 컴퓨터로 옮기기, 카카오톡 PC버전 설치 등"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 focus:border-amber-600 focus:outline-none text-base font-semibold"
                  required
                />
              </div>

              {/* Preset suggestions */}
              <div>
                <span className="text-xs font-bold text-stone-500 mb-1.5 block">
                  추천 인기 수업 주제 (누르면 바로 입력됩니다):
                </span>
                <div className="flex flex-wrap gap-2">
                  {presetTopics.map((pt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(pt)}
                      className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-xl transition text-left"
                    >
                      + {pt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    수강 대상자 특성
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    회차 번호 (주차)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  특별 지도 고려사항 (선택)
                </label>
                <input
                  type="text"
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>어르신 맞춤 2교시 교안 및 유인물 생성 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>2교시(각 50분) 맞춤 교안 및 유인물 자동 생성하기</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Generated Plan Preview */
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between text-emerald-950">
                <div className="flex items-center gap-2 font-extrabold">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>맞춤형 2교시 교안과 유인물이 성공적으로 생성되었습니다!</span>
                </div>
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="text-xs text-emerald-700 font-bold underline"
                >
                  다른 주제 생성하기
                </button>
              </div>

              <div className="border border-stone-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xl font-extrabold text-stone-900">{generatedPlan.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{generatedPlan.overview}</p>

                {/* Period 1 */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-extrabold text-amber-950">{generatedPlan.period1.title}</h4>
                  <div className="space-y-1 text-sm text-stone-700">
                    {generatedPlan.period1.timeTable.map((slot, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="font-bold text-amber-800 shrink-0 w-28">{slot.time}</span>
                        <span>{slot.content}</span>
                      </div>
                    ))}
                  </div>
                  {generatedPlan.period1.instructorScript && (
                    <div className="mt-2 text-xs bg-white p-3 rounded-lg border border-amber-200 text-stone-700 italic">
                      <strong>🗣️ 강사 추천 시범 멘트:</strong> "{generatedPlan.period1.instructorScript}"
                    </div>
                  )}
                </div>

                {/* Break time */}
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
                  <span className="font-bold">☕ 10분 휴식:</span>
                  <span>{generatedPlan.breakTime.tips}</span>
                </div>

                {/* Period 2 */}
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
                  <h4 className="font-extrabold text-emerald-950">{generatedPlan.period2.title}</h4>
                  <div className="space-y-1 text-sm text-stone-700">
                    {generatedPlan.period2.timeTable.map((slot, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="font-bold text-emerald-800 shrink-0 w-28">{slot.time}</span>
                        <span>{slot.content}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Handout Preview */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600">📄 수강생 배포용 큰 글씨 유인물</span>
                    <button
                      onClick={handleCopyHandout}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-stone-300 rounded-md font-bold text-stone-700 hover:bg-stone-100"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copySuccess ? '복사 완료!' : '유인물 텍스트 복사'}
                    </button>
                  </div>
                  <pre className="text-xs text-stone-700 whitespace-pre-wrap font-sans bg-white p-3 rounded-lg border border-stone-200 max-h-40 overflow-y-auto">
                    {generatedPlan.handoutText}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleApplyToCurriculum}
                  className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>내 커리큘럼에 이 교안 등록하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
