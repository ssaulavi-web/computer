import React from 'react';
import { Monitor, BookOpen, Volume2, VolumeX, Type, Sparkles } from 'lucide-react';
import { MainTab, FontSize } from '../types';
import { setAudioEnabled, getAudioEnabled, speakText } from '../utils/speech';

interface HeaderProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  fontSize: FontSize;
  onChangeFontSize: (size: FontSize) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  fontSize,
  onChangeFontSize,
  audioEnabled,
  onToggleAudio,
  onOpenGenerator,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-3.5">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm font-black text-xl">
                🖥️
              </div>
              <div>
                <h1 className="text-xl font-black text-stone-900 leading-tight">
                  컴퓨터 초보 교실 <span className="text-amber-600 font-extrabold text-base">& 실습기</span>
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  2교시 맞춤 커리큘럼 · AI 교안 생성 · 실시간 화면 실습
                </p>
              </div>
            </div>

            {/* Mobile Generator Button */}
            <button
              onClick={onOpenGenerator}
              className="md:hidden p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI 교안</span>
            </button>
          </div>

          {/* Center Mode Switcher Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 w-full md:w-auto">
            <button
              onClick={() => {
                onTabChange('simulator');
                speakText('바로 보면서 실습하기 화면으로 이동합니다.');
              }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition ${
                currentTab === 'simulator'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>바로 보면서 실습하기</span>
            </button>
            <button
              onClick={() => {
                onTabChange('curriculum');
                speakText('2교시 커리큘럼 및 수업자료 화면으로 이동합니다.');
              }}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition ${
                currentTab === 'curriculum'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>2교시 커리큘럼 & 교안</span>
            </button>
          </div>

          {/* Accessibility Controls & AI Generator CTA */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Font Size Selector */}
            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 text-xs font-bold text-stone-700">
              <span className="px-2 text-stone-400">글자:</span>
              <button
                onClick={() => onChangeFontSize('normal')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'normal' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : ''}`}
                title="보통 글자"
              >
                보통
              </button>
              <button
                onClick={() => onChangeFontSize('large')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'large' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : ''}`}
                title="큰 글자"
              >
                크게
              </button>
              <button
                onClick={() => onChangeFontSize('huge')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'huge' ? 'bg-white text-stone-900 shadow-2xs font-extrabold' : ''}`}
                title="아주 큰 글자"
              >
                아주크게
              </button>
            </div>

            {/* Audio Speech Guide Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                audioEnabled
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-stone-100 border-stone-200 text-stone-500'
              }`}
              title={audioEnabled ? '음성 안내 끄기' : '음성 안내 켜기'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <span className="hidden sm:inline">{audioEnabled ? '소리 켬' : '소리 끔'}</span>
            </button>

            {/* AI Generator Button on Desktop */}
            <button
              onClick={onOpenGenerator}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI 교안 생성</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
