import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  X,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface WebLabProps {
  fontSizeClass: string;
}

export const WebLab: React.FC<WebLabProps> = ({ fontSizeClass }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [showFakePopup, setShowFakePopup] = useState(false);
  const [popupClosedSafely, setPopupClosedSafely] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'safety'>('search');

  const popularQueries = [
    { text: '오늘 날씨', answer: '☀️ 맑음! 최고 기온 22도, 미세먼지 좋음. 외출하기 참 좋은 화창한 날씨입니다.' },
    { text: '서울역 기차 시간표', answer: '🚄 코레일 KTX: 서울역 → 대전/부산 방면 매시 정각 및 30분 출발 (일반실 예약 가능).' },
    { text: '된장찌개 끓이기', answer: '🍲 멸치 다시마 육수에 된장 2스푼 풀고, 감자, 두부, 애호박을 넣어 보글보글 끓이면 완성!' },
    { text: '주민등록등본 발급', answer: '🏛️ 정부24(인터넷 민원): 공인인증서 또는 간편인증으로 집에서 무료 즉시 출력 가능합니다.' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const found = popularQueries.find(q => q.text.includes(query) || query.includes(q.text));
    if (found) {
      setSearchResult(found.answer);
      speakText(`검색 결과입니다. ${found.answer}`);
    } else {
      const fallback = `🔍 "${query}"에 대한 정보를 인터넷 백과사전에서 찾아 안전하게 표시했습니다.`;
      setSearchResult(fallback);
      speakText(fallback);
    }
  };

  const triggerFakePopup = () => {
    setShowFakePopup(true);
    setPopupClosedSafely(false);
    speakText('화면에 무서운 가짜 경고창이 나타났습니다! 전화번호로 전화하지 마시고, 오른쪽 맨 위 X 단추를 눌러 닫으세요!');
  };

  return (
    <div className={`space-y-6 ${fontSizeClass}`}>
      {/* Sub-tab Switcher */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 min-w-[170px] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'search' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>🔍 인터넷 검색창 실습</span>
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`flex-1 min-w-[170px] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'safety' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>🛡️ 가짜 사기 팝업창 닫기 훈련</span>
            {popupClosedSafely && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">안전 마스터</span>}
          </button>
        </div>
      </div>

      {/* Main Browser Window Simulator */}
      <div className="bg-white rounded-2xl shadow-md border-2 border-stone-300 overflow-hidden relative">
        {/* Browser Top Navigation Bar */}
        <div className="bg-stone-100 p-3 border-b border-stone-200 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-stone-500">
            <button
              onClick={() => {
                setSearchResult(null);
                setSearchQuery('');
                speakText('이전 화면으로 돌아갔습니다.');
              }}
              className="p-1.5 hover:bg-stone-200 rounded-lg transition"
              title="뒤로가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-stone-200 rounded-lg opacity-40" disabled>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => speakText('인터넷 창을 새로고침했습니다.')}
              className="p-1.5 hover:bg-stone-200 rounded-lg transition"
              title="새로고침"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Fake Address Bar */}
          <div className="flex-1 min-w-[200px] bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-500 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate font-mono">https://www.안전한-인터넷-배움터.kr</span>
            <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold shrink-0">
              보안 인증됨
            </span>
          </div>
        </div>

        {/* Browser Content Stage */}
        <div className="p-6 md:p-8 min-h-[420px] bg-stone-50">
          {activeTab === 'search' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-extrabold text-amber-600 flex items-center justify-center gap-2">
                  <span>안심 검색</span>
                  <Search className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-stone-600 text-sm">
                  궁금한 단어를 쓰고 키보드의 <strong>[Enter]</strong> 키를 누르거나 <strong>[검색]</strong>을 누르세요.
                </p>
              </div>

              {/* Search Bar Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    handleSearch(searchQuery.trim());
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="예: 오늘 날씨, 기차 시간표, 된장찌개..."
                  className="w-full text-lg md:text-xl py-4 pl-12 pr-28 rounded-2xl border-3 border-amber-400 focus:border-amber-600 bg-white shadow-sm focus:outline-none text-stone-900"
                />
                <Search className="w-6 h-6 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm transition"
                >
                  검색
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500">자주 찾는 질문 (눌러서 바로 검색해보세요):</span>
                <div className="flex flex-wrap gap-2">
                  {popularQueries.map(q => (
                    <button
                      key={q.text}
                      type="button"
                      onClick={() => handleSearch(q.text)}
                      className="px-3.5 py-2 bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl text-sm font-semibold text-stone-700 transition shadow-2xs"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Result Display */}
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-amber-700">검색 결과 안내</span>
                    <button
                      onClick={() => speakText(searchResult)}
                      className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 font-bold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      소리로 듣기
                    </button>
                  </div>
                  <p className="text-lg font-bold text-stone-900 leading-relaxed">{searchResult}</p>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-amber-950 text-lg flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                  가짜 사기 팝업창에 절대 속지 않는 3대 원칙
                </h4>
                <p className="text-amber-900 text-sm leading-relaxed">
                  1. <strong>"바이러스에 걸렸으니 전화하세요"</strong>는 100% 사기입니다!<br />
                  2. 화면에 적힌 전화번호로 <strong>절대 전화하지 마세요.</strong><br />
                  3. 당황하지 마시고 창 오른쪽 맨 위의 <strong>[ X ] 단추</strong>를 톡 눌러 닫아버리세요!
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-bold text-stone-800 text-lg">가짜 사기 팝업창 대처 훈련 시작하기</h4>
                <p className="text-stone-600 text-sm">
                  아래 버튼을 누르면 갑자기 화면에 시끄러운 가짜 경고창이 뜹니다.<br />
                  침착하게 X 단추를 찾아 눌러보세요!
                </p>
                <button
                  onClick={triggerFakePopup}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-md transition flex items-center gap-2 mx-auto text-base"
                >
                  <AlertTriangle className="w-5 h-5" />
                  가짜 경고 팝업창 띄워보기 (모의 훈련)
                </button>
              </div>

              {popupClosedSafely && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-400 p-6 rounded-2xl text-emerald-950 space-y-2"
                >
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-lg">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>훈련 성공! 사기 팝업을 침착하게 막아내셨습니다!</span>
                  </div>
                  <p className="text-emerald-800 text-sm">
                    실제 컴퓨터를 쓰시다가도 무서운 창이 뜨면 놀라지 마시고, 방금처럼 X 단추를 눌러 닫으시면 아무 문제 없습니다.
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Fake Dangerous Popup Modal */}
        <AnimatePresence>
          {showFakePopup && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl border-4 border-rose-500 max-w-lg w-full overflow-hidden"
              >
                {/* Modal Title with Real Close Button */}
                <div className="bg-rose-600 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-300" />
                    <span>[가짜 경고창 모의 훈련]</span>
                  </div>
                  {/* The Target Close Button */}
                  <button
                    onClick={() => {
                      setShowFakePopup(false);
                      setPopupClosedSafely(true);
                      speakText('정답입니다! 침착하게 X 단추를 눌러 사기 창을 닫으셨습니다.');
                    }}
                    className="w-8 h-8 rounded-lg bg-black/30 hover:bg-black/50 text-white flex items-center justify-center font-extrabold text-lg transition"
                    title="이 창 닫기"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 text-stone-900">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
                    <span className="text-4xl">🚨</span>
                    <div>
                      <h4 className="font-extrabold text-rose-800 text-base">
                        경고: 컴퓨터가 바이러스에 감염되었습니다!
                      </h4>
                      <p className="text-xs text-rose-700 mt-0.5">
                        지금 즉시 02-1234-5678 로 전화하여 치료를 받으세요!
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 bg-stone-100 p-3 rounded-lg border border-stone-200">
                    <p className="font-bold text-stone-700">💡 강사님의 팁:</p>
                    <p className="mt-1">
                      이런 창은 전형적인 <strong>보이스피싱/사기 광고</strong>입니다. 아래의 이상한 버튼을 절대 누르지 마시고, <strong>오른쪽 위의 [ X ] 단추</strong>만 톡 누르시면 해결됩니다!
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        alert('속으셨습니다! 이 버튼을 누르면 위험한 프로그램이 설치될 수 있습니다. 오른쪽 위의 [X] 닫기 단추를 누르세요!');
                      }}
                      className="flex-1 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl"
                    >
                      지금 치료하기 (위험한 버튼)
                    </button>
                    <button
                      onClick={() => {
                        setShowFakePopup(false);
                        setPopupClosedSafely(true);
                        speakText('참 잘하셨어요! 닫기를 누르셨습니다.');
                      }}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl"
                    >
                      안전하게 닫기
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
