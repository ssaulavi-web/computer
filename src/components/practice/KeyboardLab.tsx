import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Keyboard,
  CornerDownLeft,
  Delete,
  Space,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface KeyboardLabProps {
  fontSizeClass: string;
}

interface PracticeWord {
  word: string;
  category: string;
  hint: string;
}

const PRACTICE_WORDS: PracticeWord[] = [
  { word: '나무', category: '1단계: 받침 없는 쉬운 단어', hint: '초록 잎이 싱그러운 나무' },
  { word: '바다', category: '1단계: 받침 없는 쉬운 단어', hint: '푸른 파도가 치는 바다' },
  { word: '가족', category: '2단계: 소중한 생활 단어', hint: '언제나 내 편인 사랑하는 가족' },
  { word: '행복', category: '2단계: 소중한 생활 단어', hint: '웃음 가득한 매일의 행복' },
  { word: '대한민국', category: '2단계: 소중한 생활 단어', hint: '자랑스러운 우리나라' },
  { word: '꽃', category: '3단계: 쌍자음 도전 (Shift + ㄱ)', hint: '봄에 활짝 피어나는 꽃' },
  { word: '꿈', category: '3단계: 쌍자음 도전 (Shift + ㄷ)', hint: '내일을 향한 소중한 꿈' },
];

export const KeyboardLab: React.FC<KeyboardLabProps> = ({ fontSizeClass }) => {
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const [activeTab, setActiveTab] = useState<'word' | 'memo' | 'guide'>('word');

  const currentTarget = PRACTICE_WORDS[selectedWordIndex];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'word') {
      speakText(`오늘의 연습 단어는 ${currentTarget.word} 입니다. 아래 입력칸에 천천히 쳐보세요.`);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [selectedWordIndex, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (val === currentTarget.word) {
      // Completed current word
      if (!completedWords.includes(currentTarget.word)) {
        setCompletedWords(prev => [...prev, currentTarget.word]);
      }
      speakText(`딩동댕! ${currentTarget.word} 단어를 정확하게 입력하셨습니다!`);

      setTimeout(() => {
        if (selectedWordIndex < PRACTICE_WORDS.length - 1) {
          setSelectedWordIndex(prev => prev + 1);
          setInputVal('');
        }
      }, 1200);
    }
  };

  const keyGuideItems = [
    {
      name: 'Enter (엔터 키)',
      icon: <CornerDownLeft className="w-5 h-5 text-amber-600" />,
      desc: '줄을 바꾸거나, 글자를 다 쓴 후 "확인/결정"할 때 쿵!',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    {
      name: 'Space Bar (스페이스바)',
      icon: <Space className="w-5 h-5 text-emerald-600" />,
      desc: '가장 길쭉한 단추! 단어와 단어 사이에 빈칸 한 칸 퐁 띄울 때 씁니다.',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    },
    {
      name: 'Backspace (지우기 키)',
      icon: <Delete className="w-5 h-5 text-rose-600" />,
      desc: '글자를 잘못 쳤을 때 왼쪽 글자를 쏙 지워주는 마법 지우개!',
      color: 'bg-rose-50 border-rose-300 text-rose-900',
    },
    {
      name: 'Shift (쉬프트 키)',
      icon: <span className="font-extrabold text-blue-600 text-sm">Shift</span>,
      desc: '누르고 있는 동안 쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)과 위에 적힌 특수기호 입력!',
      color: 'bg-blue-50 border-blue-300 text-blue-900',
    },
    {
      name: '한/영 (한영 전환 키)',
      icon: <span className="font-extrabold text-purple-600 text-sm">한/영</span>,
      desc: '영어가 나올 때 누르면 한글로, 한글에서 누르면 영어로 바뀝니다.',
      color: 'bg-purple-50 border-purple-300 text-purple-900',
    },
  ];

  return (
    <div className={`space-y-6 ${fontSizeClass}`}>
      {/* Tab Switcher */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('word')}
            className={`flex-1 min-w-[170px] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'word' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>✍️ 단계별 단어 타자 연습</span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
              {completedWords.length} / {PRACTICE_WORDS.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 min-w-[170px] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'guide' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>💡 필수 5대 단추 한눈에 보기</span>
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className={`flex-1 min-w-[170px] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'memo' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>📝 자유 메모장 (마음대로 써보기)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        {activeTab === 'word' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {currentTarget.category}
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-2 flex items-center gap-2">
                  <Keyboard className="w-6 h-6 text-amber-600" />
                  단어 따라 치기 연습
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(`목표 단어는 ${currentTarget.word} 입니다. ${currentTarget.hint}`)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-900 font-bold text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  소리로 듣기
                </button>
              </div>
            </div>

            {/* Target Display Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 text-center space-y-4">
              <span className="text-sm font-semibold text-stone-500">따라 치실 단어</span>
              <div className="text-5xl md:text-6xl font-black text-amber-950 tracking-wider">
                {currentTarget.word}
              </div>
              <p className="text-stone-600 font-medium">💡 힌트: {currentTarget.hint}</p>
            </div>

            {/* Typing Input Box */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-stone-700">
                👇 아래 흰 네모칸을 마우스로 누르고, 키보드로 글자를 쳐보세요:
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  placeholder="여기에 단어를 쳐보세요..."
                  className="w-full text-3xl font-extrabold text-stone-900 bg-stone-50 border-3 border-amber-300 focus:border-amber-600 focus:bg-white focus:outline-none rounded-2xl p-5 text-center transition-all shadow-inner tracking-widest"
                />
                {inputVal === currentTarget.word && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center gap-2 font-bold"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="hidden sm:inline">성공!</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Word List Navigation */}
            <div className="pt-4 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-500 mb-2 block">연습 단어 목록 (원하는 단어를 눌러보세요):</span>
              <div className="flex flex-wrap gap-2">
                {PRACTICE_WORDS.map((item, idx) => (
                  <button
                    key={item.word}
                    onClick={() => {
                      setSelectedWordIndex(idx);
                      setInputVal('');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                      selectedWordIndex === idx
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : completedWords.includes(item.word)
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {completedWords.includes(item.word) && '✓ '}
                    {item.word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 필수 5대 단추 한눈에 보기 */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Keyboard className="w-6 h-6 text-amber-600" />
                컴퓨터 할 때 가장 많이 쓰는 5대 필수 단추
              </h3>
              <p className="text-stone-600 mt-1">
                키보드에는 100개가 넘는 많은 단추가 있지만, 아래 5가지만 알면 컴퓨터를 훌륭하게 다룰 수 있습니다!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyGuideItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => speakText(`${item.name}. ${item.desc}`)}
                  className={`p-5 rounded-2xl border-2 transition hover:shadow-md cursor-pointer ${item.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white rounded-lg shadow-xs">
                        {item.icon}
                      </div>
                      <h4 className="font-extrabold text-lg">{item.name}</h4>
                    </div>
                    <button className="text-xs flex items-center gap-1 font-bold opacity-75 hover:opacity-100">
                      <Volume2 className="w-3.5 h-3.5" />
                      설명 듣기
                    </button>
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Visual Mini Keyboard Diagram */}
            <div className="bg-stone-900 text-stone-200 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                키보드에서 위치 확인하기
              </h4>
              <p className="text-sm text-stone-300">
                • <strong>지우개(Backspace)</strong>: 글자판 맨 오른쪽 위<br />
                • <strong>엔터(Enter)</strong>: 지우개 바로 아래 커다란 단추<br />
                • <strong>스페이스바</strong>: 맨 아래 가장 긴 단추<br />
                • <strong>한/영 키</strong>: 스페이스바 바로 오른쪽 단추
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: 자유 메모장 */}
        {activeTab === 'memo' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Keyboard className="w-6 h-6 text-amber-600" />
                  자유 메모장: 마음껏 편하게 글씨를 써보세요!
                </h3>
                <p className="text-stone-600 mt-1">
                  가족에게 보내는 편지, 오늘 먹은 점심, 손주 이름 등 자유롭게 키보드를 두드려보세요.
                </p>
              </div>
              <button
                onClick={() => setFreeText('')}
                className="flex items-center gap-1.5 px-3 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                모두 지우기
              </button>
            </div>

            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="여기에 자유롭게 글을 써보세요. 틀려도 지우기(Backspace) 단추로 얼마든지 고칠 수 있습니다!"
              rows={8}
              className="w-full text-lg leading-relaxed p-5 bg-amber-50/30 border-2 border-stone-300 rounded-2xl focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900 shadow-inner resize-none font-sans"
            />

            <div className="flex items-center justify-between text-sm text-stone-500">
              <span>입력한 글자 수: <strong>{freeText.length}</strong>자</span>
              {freeText.length > 0 && (
                <button
                  onClick={() => speakText(freeText)}
                  className="flex items-center gap-1 text-amber-700 font-bold hover:underline"
                >
                  <Volume2 className="w-4 h-4" />
                  내가 쓴 글 소리로 들어보기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
