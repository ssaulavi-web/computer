/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mouse,
  Keyboard,
  LayoutGrid,
  Globe,
  Sparkles,
  Heart,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { MainTab, SimulatorModule, FontSize, CurriculumWeek } from './types';
import { DEFAULT_CURRICULUM } from './data/defaultCurriculum';
import { Header } from './components/Header';
import { MouseLab } from './components/practice/MouseLab';
import { KeyboardLab } from './components/practice/KeyboardLab';
import { WindowLab } from './components/practice/WindowLab';
import { WebLab } from './components/practice/WebLab';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { AIGeneratorModal } from './components/curriculum/AIGeneratorModal';
import { setAudioEnabled, getAudioEnabled, speakText } from './utils/speech';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('simulator');
  const [simulatorModule, setSimulatorModule] = useState<SimulatorModule>('mouse');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [audioEnabled, setAudioState] = useState<boolean>(true);
  const [curriculum, setCurriculum] = useState<CurriculumWeek[]>(DEFAULT_CURRICULUM);
  const [selectedWeekId, setSelectedWeekId] = useState<string>('week-1');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  const fontSizeClass =
    fontSize === 'huge'
      ? 'text-lg font-medium'
      : fontSize === 'large'
      ? 'text-base font-medium'
      : 'text-sm font-normal';

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioState(next);
    setAudioEnabled(next);
    if (next) {
      speakText('음성 안내가 켜졌습니다.');
    }
  };

  const handleAddCurriculum = (newWeek: CurriculumWeek) => {
    setCurriculum((prev) => [newWeek, ...prev]);
    setSelectedWeekId(newWeek.id);
    setMainTab('curriculum');
    speakText(`새로운 ${newWeek.title} 교안이 커리큘럼에 등록되었습니다.`);
  };

  const handleStartSimulatorFromCurriculum = (module: SimulatorModule) => {
    setSimulatorModule(module);
    setMainTab('simulator');
  };

  return (
    <div className={`min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col ${fontSize === 'huge' ? 'scale-100' : ''}`}>
      {/* Universal Top Header */}
      <Header
        currentTab={mainTab}
        onTabChange={setMainTab}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Reassuring Encouragement Banner */}
        <div className="mb-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-xl font-bold shadow-xs">
              ❤️
            </div>
            <div>
              <p className="font-extrabold text-amber-950 text-sm md:text-base">
                "실수해도 괜찮아요! 컴퓨터는 아무리 잘못 눌러도 절대 고장 나지 않습니다."
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                안심하시고 천천히 하나씩 눌러보세요. 언제든 오른쪽 위 X 닫기를 누르거나 새로고침하면 원래대로 돌아옵니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => speakText('실수해도 괜찮아요! 컴퓨터는 아무리 잘못 눌러도 절대 고장 나지 않습니다. 안심하시고 천천히 하나씩 눌러보세요.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-50 shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>응원 듣기</span>
          </button>
        </div>

        {/* View 1: Interactive Hands-On Practice Lab */}
        {mainTab === 'simulator' && (
          <div className="space-y-6">
            {/* Module Category Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  id: 'mouse',
                  title: '1. 마우스 정복하기',
                  desc: '클릭·더블클릭·드래그·휠',
                  icon: <Mouse className="w-6 h-6" />,
                  color: 'amber',
                },
                {
                  id: 'keyboard',
                  title: '2. 키보드 & 타자 기초',
                  desc: '엔터·스페이스·한글 타자',
                  icon: <Keyboard className="w-6 h-6" />,
                  color: 'emerald',
                },
                {
                  id: 'window',
                  title: '3. 윈도우 창 다루기',
                  desc: '최소화·최대화·닫기(X)',
                  icon: <LayoutGrid className="w-6 h-6" />,
                  color: 'blue',
                },
                {
                  id: 'web',
                  title: '4. 인터넷 & 사기 예방',
                  desc: '검색창 실습·가짜 경고 닫기',
                  icon: <Globe className="w-6 h-6" />,
                  color: 'purple',
                },
              ].map((mod) => {
                const isActive = simulatorModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSimulatorModule(mod.id as SimulatorModule);
                      speakText(`${mod.title} 실습실로 이동합니다.`);
                    }}
                    className={`p-4 md:p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition ${
                        isActive ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {mod.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-base">{mod.title}</h3>
                      <p className="text-xs text-stone-500 mt-1">{mod.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Simulator Lab Screen */}
            {simulatorModule === 'mouse' && <MouseLab fontSizeClass={fontSizeClass} />}
            {simulatorModule === 'keyboard' && <KeyboardLab fontSizeClass={fontSizeClass} />}
            {simulatorModule === 'window' && <WindowLab fontSizeClass={fontSizeClass} />}
            {simulatorModule === 'web' && <WebLab fontSizeClass={fontSizeClass} />}
          </div>
        )}

        {/* View 2: 2-Period Curriculum & Lesson Materials */}
        {mainTab === 'curriculum' && (
          <CurriculumView
            curriculum={curriculum}
            selectedWeekId={selectedWeekId}
            onSelectWeek={setSelectedWeekId}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            onStartSimulator={handleStartSimulatorFromCurriculum}
            fontSizeClass={fontSizeClass}
          />
        )}
      </main>

      {/* AI Lesson Plan Generator Modal */}
      <AIGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onAddCurriculum={handleAddCurriculum}
      />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            컴퓨터 초보자와 어르신을 위한 2교시(각 50분) 디지털 배움터 프로그램
          </p>
          <div className="flex items-center gap-4 text-stone-600 font-semibold">
            <span>🖱️ 마우스 실습</span>
            <span>⌨️ 키보드 실습</span>
            <span>🪟 창 다루기</span>
            <span>✨ Gemini AI 교안 생성</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
