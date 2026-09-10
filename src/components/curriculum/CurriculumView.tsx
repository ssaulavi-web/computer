import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Printer,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Play,
  HelpCircle,
  Coffee,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { CurriculumWeek, SimulatorModule } from '../../types';
import { speakText } from '../../utils/speech';

interface CurriculumViewProps {
  curriculum: CurriculumWeek[];
  selectedWeekId: string;
  onSelectWeek: (id: string) => void;
  onOpenGenerator: () => void;
  onStartSimulator: (module: SimulatorModule) => void;
  fontSizeClass: string;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  curriculum,
  selectedWeekId,
  onSelectWeek,
  onOpenGenerator,
  onStartSimulator,
  fontSizeClass,
}) => {
  const [viewMode, setViewMode] = useState<'plan' | 'handout'>('plan');
  const [copied, setCopied] = useState(false);

  const selectedWeek = curriculum.find(w => w.id === selectedWeekId) || curriculum[0];
  const { lessonPlan } = selectedWeek;

  const handleCopyHandout = () => {
    if (!lessonPlan.handoutText) return;
    navigator.clipboard.writeText(lessonPlan.handoutText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 ${fontSizeClass}`}>
      {/* Top Banner & Quick AI Action */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-100">
            <span>⏱️ 1회 수업 100분 표준 구성 (1교시 50분 + 휴식 10분 + 2교시 50분)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">
            컴퓨터 초보자·어르신 2교시 체계적 커리큘럼
          </h2>
          <p className="text-amber-100 text-sm md:text-base leading-relaxed">
            강사님은 시간대별 지도안과 대본을 보며 수업하고, 어르신들은 큰 글씨 유인물과 화면 실습기로 부담 없이 배우실 수 있습니다.
          </p>
        </div>
        <button
          onClick={onOpenGenerator}
          className="px-6 py-3.5 bg-white text-amber-900 hover:bg-amber-50 font-extrabold rounded-2xl shadow-md transition flex items-center gap-2 text-base shrink-0"
        >
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>AI 맞춤 교안 새로 만들기</span>
        </button>
      </div>

      {/* Main Grid: Left Syllabus List + Right Active Lesson Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-extrabold text-stone-900 text-base">주차별 교육과정</h3>
            <span className="text-xs text-stone-500 font-semibold">{curriculum.length}개 코스</span>
          </div>

          <div className="space-y-2.5">
            {curriculum.map((week) => {
              const isSelected = week.id === selectedWeek.id;
              return (
                <button
                  key={week.id}
                  onClick={() => {
                    onSelectWeek(week.id);
                    speakText(`${week.weekNumber}주차: ${week.title}`);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-101'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-amber-50/30'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {week.weekNumber}주
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-base truncate">{week.title}</h4>
                    <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-stone-500'}`}>
                      {week.summary}
                    </p>
                  </div>

                  <ChevronRight className={`w-5 h-5 shrink-0 self-center ${isSelected ? 'text-white' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Lesson Detail */}
        <div className="lg:col-span-8 space-y-5">
          {/* Week Header Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  제 {selectedWeek.weekNumber}주차 표준 강의안
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-2">{selectedWeek.title}</h3>
                <p className="text-stone-600 text-sm mt-1">{selectedWeek.lessonPlan.overview}</p>
              </div>

              {/* Quick Jump to Simulator */}
              {selectedWeek.lessonPlan.relatedSimulatorModule && (
                <button
                  onClick={() => onStartSimulator(selectedWeek.lessonPlan.relatedSimulatorModule!)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-sm transition flex items-center gap-2 text-sm shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>이 주차 바로 실습하기</span>
                </button>
              )}
            </div>

            {/* View Mode Toggle: [강사용 교안] vs [수강생용 큰 글씨 유인물] */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center bg-stone-100 p-1.5 rounded-2xl">
                <button
                  onClick={() => setViewMode('plan')}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 transition ${
                    viewMode === 'plan' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>강사용 상세 지도안 (1·2교시)</span>
                </button>
                <button
                  onClick={() => setViewMode('handout')}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 transition ${
                    viewMode === 'handout' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>수강생 큰 글씨 유인물 (A4 인쇄)</span>
                </button>
              </div>

              {viewMode === 'handout' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyHandout}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '복사됨' : '유인물 복사'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>A4 인쇄하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mode 1: 강사용 상세 지도안 (1교시 50m + 휴식 10m + 2교시 50m) */}
          {viewMode === 'plan' && (
            <div className="space-y-6">
              {/* Period 1 (50 min) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-sm">
                      1교시
                    </div>
                    <h4 className="font-extrabold text-stone-900 text-lg">
                      {lessonPlan.period1.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    50분 수업
                  </span>
                </div>

                {/* Timetable */}
                <div className="space-y-2">
                  {lessonPlan.period1.timeTable.map((slot, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <span className="text-xs font-extrabold text-amber-800 w-32 shrink-0 bg-amber-100/60 px-2 py-1 rounded-md text-center">
                        {slot.time}
                      </span>
                      <span className="text-sm text-stone-700 leading-relaxed font-medium">
                        {slot.content}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Key Points */}
                {lessonPlan.period1.keyPoints && lessonPlan.period1.keyPoints.length > 0 && (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                    <h5 className="font-bold text-amber-950 text-xs uppercase tracking-wider">
                      🎯 강사 핵심 지도 포인트
                    </h5>
                    <ul className="space-y-1 text-sm text-amber-900 list-disc list-inside">
                      {lessonPlan.period1.keyPoints.map((kp, idx) => (
                        <li key={idx}>{kp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructor Script */}
                {lessonPlan.period1.instructorScript && (
                  <div className="p-4 bg-stone-100/80 rounded-2xl border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                      <span>🗣️ 추천 강사 시범 대본</span>
                      <button
                        onClick={() => speakText(lessonPlan.period1.instructorScript!)}
                        className="flex items-center gap-1 text-amber-700 hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        대본 듣기
                      </button>
                    </div>
                    <p className="text-sm text-stone-800 italic leading-relaxed pt-1">
                      {lessonPlan.period1.instructorScript}
                    </p>
                  </div>
                )}
              </div>

              {/* Break Time (10 min) */}
              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-200 flex items-center justify-center text-xl shrink-0">
                    ☕
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sky-950 text-sm">
                      중간 휴식 시간: 10분 (어르신 건강 스트레칭)
                    </h5>
                    <p className="text-xs text-sky-800 mt-0.5">{lessonPlan.breakTime.tips}</p>
                  </div>
                </div>
                <button
                  onClick={() => speakText(`10분간 쉬는 시간입니다. ${lessonPlan.breakTime.tips}`)}
                  className="px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-bold text-sky-900 hover:bg-sky-100 shrink-0"
                >
                  음성 안내
                </button>
              </div>

              {/* Period 2 (50 min) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
                      2교시
                    </div>
                    <h4 className="font-extrabold text-stone-900 text-lg">
                      {lessonPlan.period2.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    50분 실습
                  </span>
                </div>

                {/* Timetable */}
                <div className="space-y-2">
                  {lessonPlan.period2.timeTable.map((slot, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <span className="text-xs font-extrabold text-emerald-800 w-32 shrink-0 bg-emerald-100/60 px-2 py-1 rounded-md text-center">
                        {slot.time}
                      </span>
                      <span className="text-sm text-stone-700 leading-relaxed font-medium">
                        {slot.content}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Hands-on Missions */}
                {lessonPlan.period2.missions && lessonPlan.period2.missions.length > 0 && (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                    <h5 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      오늘의 2교시 개별 실습 과제
                    </h5>
                    <div className="space-y-1.5">
                      {lessonPlan.period2.missions.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-stone-800 font-medium">
                          <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Troubleshooting FAQ */}
                {lessonPlan.period2.troubleshootingFAQ && lessonPlan.period2.troubleshootingFAQ.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h5 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      자주 발생하는 돌발상황 및 어르신 질문 대처법
                    </h5>
                    <div className="grid grid-cols-1 gap-3">
                      {lessonPlan.period2.troubleshootingFAQ.map((faq, idx) => (
                        <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                          <p className="font-bold text-rose-700">Q. {faq.q}</p>
                          <p className="text-stone-700 leading-relaxed">A. {faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: 수강생 배포용 큰 글씨 유인물 (A4 인쇄 최적화) */}
          {viewMode === 'handout' && (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200 print:shadow-none print:border-none print:p-0 space-y-6">
              <div className="border-b-2 border-stone-900 pb-4 flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    행복한 컴퓨터 교실 수강생 배포용 학습지
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-stone-900 mt-1">
                    {selectedWeek.title}
                  </h2>
                </div>
                <div className="text-right text-xs text-stone-500 font-medium">
                  <span>제 {selectedWeek.weekNumber} 차시 | 성명: ____________</span>
                </div>
              </div>

              <div className="prose prose-stone max-w-none text-stone-800 text-base leading-relaxed space-y-4">
                <pre className="font-sans whitespace-pre-wrap leading-relaxed text-stone-800 bg-stone-50/50 p-6 rounded-2xl border border-stone-200 text-base font-normal">
                  {lessonPlan.handoutText}
                </pre>
              </div>

              <div className="border-t border-dashed border-stone-300 pt-6 text-center space-y-2">
                <span className="text-3xl">💮</span>
                <p className="font-bold text-stone-700 text-sm">
                  오늘도 새로운 도전을 멋지게 해내셨습니다! 참 잘하셨습니다!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
