import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mouse,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Volume2,
  Folder,
  FolderOpen,
  Gift,
  Trash2,
  Scroll,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { MouseSubMode } from '../../types';
import { speakText } from '../../utils/speech';

interface MouseLabProps {
  fontSizeClass: string;
}

export const MouseLab: React.FC<MouseLabProps> = ({ fontSizeClass }) => {
  const [mode, setMode] = useState<MouseSubMode>('click');

  // Step 1: Click Lab State
  const [clickCount, setClickCount] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [balloonEmoji, setBalloonEmoji] = useState('🎈');
  const [clickFeedback, setClickFeedback] = useState<string | null>(null);

  // Step 2: Double Click Lab State
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [dcSpeed, setDcSpeed] = useState<number | null>(null);
  const [dcOpened, setDcOpened] = useState<{ [key: string]: boolean }>({});
  const [dcMessage, setDcMessage] = useState<string>('상자나 폴더를 마우스로 빠르게 톡-톡 두 번 눌러보세요!');

  // Step 3: Right Click Lab State
  const [rightMenu, setRightMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [rightClickAction, setRightClickAction] = useState<string | null>(null);

  // Step 4: Drag and Drop State
  const [draggedItems, setDraggedItems] = useState([
    { id: 'item-1', name: '가족 사진', icon: '📸', placed: false },
    { id: 'item-2', name: '일기장', icon: '📖', placed: false },
    { id: 'item-3', name: '음악 파일', icon: '🎵', placed: false },
    { id: 'item-4', name: '휴지 쓰레기', icon: '📄', placed: false },
  ]);
  const [isDragOverBox, setIsDragOverBox] = useState(false);
  const [currentDraggingId, setCurrentDraggingId] = useState<string | null>(null);

  // Step 5: Wheel Scroll State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollCompleted, setScrollCompleted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mode change voice guide
  useEffect(() => {
    switch (mode) {
      case 'click':
        speakText('좌클릭 연습입니다. 화면에 나타난 풍선을 마우스 왼쪽 단추로 가볍게 톡 눌러보세요.');
        break;
      case 'doubleClick':
        speakText('더블클릭 연습입니다. 마우스 왼쪽 단추를 빠르게 톡톡 두 번 누르는 연습입니다.');
        break;
      case 'rightClick':
        speakText('우클릭 연습입니다. 마우스 오른쪽 단추를 눌러 메뉴를 열어보세요.');
        break;
      case 'drag':
        speakText('드래그 앤 드롭 연습입니다. 물건을 마우스로 누른 채 보관함으로 끌고 가보세요.');
        break;
      case 'scroll':
        speakText('휠 스크롤 연습입니다. 마우스 가운데 바퀴를 아래로 살살 굴려보세요.');
        break;
    }
  }, [mode]);

  // Handle single click lab
  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    const emojis = ['🎈', '🍎', '🎁', '⭐', '🍓', '🧁', '🌸'];
    setBalloonEmoji(emojis[newCount % emojis.length]);

    // Randomize position safely within 15% to 85%
    const nextX = Math.floor(Math.random() * 70) + 15;
    const nextY = Math.floor(Math.random() * 65) + 18;
    setTargetPos({ x: nextX, y: nextY });

    if (newCount === 1) {
      setClickFeedback('첫 번째 클릭 성공! 아주 잘하셨어요!');
      speakText('참 잘하셨어요!');
    } else if (newCount === 5) {
      setClickFeedback('벌써 5번 성공! 손가락 감각이 아주 좋으십니다!');
      speakText('훌륭합니다! 5번 성공하셨어요.');
    } else if (newCount >= 10) {
      setClickFeedback('🎉 10번 성공! 좌클릭을 완벽하게 마스터하셨습니다!');
      speakText('축하합니다! 좌클릭 10회 미션을 달성하셨습니다.');
    } else {
      setClickFeedback(`잘하셨어요! (${newCount}/10)`);
    }
  };

  // Handle double click lab
  const handleItemClick = (id: string) => {
    const now = Date.now();
    const diff = now - lastClickTime;
    setLastClickTime(now);

    if (diff < 750) {
      // Successful double click
      setDcSpeed(diff);
      setDcOpened(prev => ({ ...prev, [id]: true }));
      setDcMessage(`🎉 훌륭합니다! 톡-톡 더블클릭 성공! (반응 속도: ${diff}ms)`);
      speakText('더블클릭 성공! 상자가 활짝 열렸습니다.');
    } else {
      // First click or too slow
      setDcSpeed(diff);
      setDcMessage('한 번 누르셨어요! 마우스를 가만히 둔 채 한 번 더 "톡" 눌러보세요!');
    }
  };

  // Handle right click menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRightMenu({ x, y, visible: true });
    setRightClickAction(null);
    speakText('오른쪽 단추 메뉴가 열렸습니다. 원하는 메뉴를 왼쪽 단추로 눌러보세요.');
  };

  // Handle wheel scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const total = target.scrollHeight - target.clientHeight;
    if (total > 0) {
      const progress = Math.min(100, Math.round((target.scrollTop / total) * 100));
      setScrollProgress(progress);
      if (progress >= 95 && !scrollCompleted) {
        setScrollCompleted(true);
        speakText('기사를 끝까지 다 읽으셨습니다! 휠 스크롤 성공!');
      }
    }
  };

  return (
    <div className={`space-y-6 ${fontSizeClass}`}>
      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'click', label: '1. 좌클릭 (톡 누르기)', icon: '☝️', badge: clickCount >= 10 ? '완료' : `${clickCount}/10` },
            { id: 'doubleClick', label: '2. 더블클릭 (톡-톡 두 번)', icon: '✌️', badge: Object.keys(dcOpened).length > 0 ? '완료' : '추천' },
            { id: 'rightClick', label: '3. 우클릭 (마법 메뉴)', icon: '📋', badge: rightClickAction ? '완료' : '도전' },
            { id: 'drag', label: '4. 드래그 앤 드롭 (끌어넣기)', icon: '📦', badge: draggedItems.every(i => i.placed) ? '완료' : '실습' },
            { id: 'scroll', label: '5. 휠 스크롤 (바퀴 굴리기)', icon: '📜', badge: scrollCompleted ? '완료' : `${scrollProgress}%` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as MouseSubMode)}
              className={`flex-1 min-w-[170px] px-4 py-3 rounded-xl font-bold flex items-center justify-between transition-all ${
                mode === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                mode === tab.id ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 min-h-[500px]">
        {/* Mode 1: 좌클릭 연습 */}
        {mode === 'click' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Mouse className="w-6 h-6 text-amber-600" />
                  좌클릭 연습: 움직이는 풍선을 콕! 눌러보세요
                </h3>
                <p className="text-stone-600 mt-1">
                  검지 손가락으로 마우스 왼쪽 단추를 힘주지 않고 가볍게 한 번 톡! 눌러주세요.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-amber-900 font-bold flex items-center gap-2">
                  <span>성공 횟수:</span>
                  <span className="text-2xl text-amber-600 font-extrabold">{clickCount}</span>
                  <span>/ 10</span>
                </div>
                <button
                  onClick={() => {
                    setClickCount(0);
                    setClickFeedback(null);
                    speakText('클릭 연습을 다시 시작합니다.');
                  }}
                  className="p-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition"
                  title="처음부터 다시하기"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Click Stage Area */}
            <div
              className="relative w-full h-[400px] bg-sky-50 rounded-2xl border-2 border-dashed border-sky-200 overflow-hidden cursor-crosshair select-none flex flex-col justify-between p-4"
              onClick={() => {
                setClickFeedback('풍선 위를 정확하게 겨냥하고 콕 눌러보세요!');
              }}
            >
              <div className="flex justify-between items-center text-sm text-sky-800 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg w-fit">
                <span>💡 팁: 마우스 화살표 끝이 풍선 중앙에 닿았을 때 클릭하세요!</span>
              </div>

              {/* Target Balloon */}
              <motion.button
                key={`${targetPos.x}-${targetPos.y}`}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={handleTargetClick}
                style={{
                  position: 'absolute',
                  left: `${targetPos.x}%`,
                  top: `${targetPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl flex flex-col items-center justify-center text-white font-bold hover:scale-110 active:scale-95 transition-transform border-4 border-white cursor-pointer"
              >
                <span className="text-4xl">{balloonEmoji}</span>
                <span className="text-xs font-bold mt-1 bg-black/20 px-2 py-0.5 rounded-full">콕! 누르기</span>
              </motion.button>

              {/* Real-time Encouragement Banner */}
              <div className="text-center py-2">
                {clickFeedback ? (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-md text-amber-700 font-bold border border-amber-200"
                  >
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>{clickFeedback}</span>
                  </motion.div>
                ) : (
                  <span className="text-stone-400 font-medium">화면의 둥둥 떠있는 풍선을 찾아보세요!</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: 더블클릭 연습 */}
        {mode === 'doubleClick' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Mouse className="w-6 h-6 text-amber-600" />
                더블클릭 연습: 마우스가 흔들리지 않게 "톡-톡" 빠르게 2번!
              </h3>
              <p className="text-stone-600 mt-1">
                어르신들이 가장 많이 실수하는 부분입니다. 마우스를 바닥에 꽉 붙이고, 검지 손가락만 박자에 맞춰 경쾌하게 톡-톡!
              </p>
            </div>

            {/* Instruction Callout */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-2xl shrink-0">
                  ✌️
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-base">{dcMessage}</p>
                  <p className="text-amber-800 text-sm mt-0.5">
                    {dcSpeed ? `직전 클릭 간격: ${dcSpeed}ms (700ms 이내로 두 번 눌러야 성공입니다)` : '아이콘을 더블클릭해보세요.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => speakText(dcMessage)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-amber-300 text-amber-900 font-medium hover:bg-amber-100 text-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>듣기</span>
              </button>
            </div>

            {/* Double Click Targets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Target 1: 보물상자 */}
              <div
                onClick={() => handleItemClick('chest')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-center select-none ${
                  dcOpened['chest']
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : 'bg-stone-50 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <div className="text-6xl mb-3 flex justify-center">
                  {dcOpened['chest'] ? '💎' : '🎁'}
                </div>
                <h4 className="font-bold text-lg text-stone-900">
                  {dcOpened['chest'] ? '황금 보석 상자 (열림!)' : '보물 상자'}
                </h4>
                <p className="text-stone-500 text-sm mt-1">
                  {dcOpened['chest'] ? '보석을 획득하셨습니다!' : '톡-톡 두 번 눌러 열기'}
                </p>
                {dcOpened['chest'] && (
                  <span className="inline-block mt-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    열림 성공!
                  </span>
                )}
              </div>

              {/* Target 2: 사진 폴더 */}
              <div
                onClick={() => handleItemClick('photos')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-center select-none ${
                  dcOpened['photos']
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : 'bg-stone-50 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <div className="text-6xl mb-3 flex justify-center text-amber-500">
                  {dcOpened['photos'] ? <FolderOpen className="w-16 h-16 text-emerald-600" /> : <Folder className="w-16 h-16 text-amber-500" />}
                </div>
                <h4 className="font-bold text-lg text-stone-900">
                  {dcOpened['photos'] ? '가족 사진첩 (열림!)' : '내 사진 폴더'}
                </h4>
                <p className="text-stone-500 text-sm mt-1">
                  {dcOpened['photos'] ? '손주 사진 10장이 들어있어요!' : '톡-톡 두 번 눌러 열기'}
                </p>
                {dcOpened['photos'] && (
                  <span className="inline-block mt-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    열림 성공!
                  </span>
                )}
              </div>

              {/* Target 3: 음악 폴더 */}
              <div
                onClick={() => handleItemClick('music')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-center select-none ${
                  dcOpened['music']
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : 'bg-stone-50 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <div className="text-6xl mb-3 flex justify-center">
                  {dcOpened['music'] ? '🎵' : '📁'}
                </div>
                <h4 className="font-bold text-lg text-stone-900">
                  {dcOpened['music'] ? '신나는 트로트 (재생 중)' : '추억의 노래'}
                </h4>
                <p className="text-stone-500 text-sm mt-1">
                  {dcOpened['music'] ? '즐거운 노래가 나와요!' : '톡-톡 두 번 눌러 열기'}
                </p>
                {dcOpened['music'] && (
                  <span className="inline-block mt-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                    열림 성공!
                  </span>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setDcOpened({});
                  setDcSpeed(null);
                  setDcMessage('상자나 폴더를 마우스로 빠르게 톡-톡 두 번 눌러보세요!');
                }}
                className="text-stone-500 hover:text-stone-800 text-sm underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                모든 상자 다시 닫기
              </button>
            </div>
          </div>
        )}

        {/* Mode 3: 우클릭 연습 */}
        {mode === 'rightClick' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Mouse className="w-6 h-6 text-amber-600" />
                우클릭 연습: 마우스 오른쪽 단추는 "마법 메뉴"를 부르는 열쇠!
              </h3>
              <p className="text-stone-600 mt-1">
                중지(가운데 손가락)로 마우스 오른쪽 단추를 누르면, 숨어있던 명령 메뉴들이 뿅 나타납니다.
              </p>
            </div>

            <div
              onContextMenu={handleContextMenu}
              onClick={() => setRightMenu(prev => ({ ...prev, visible: false }))}
              className="relative w-full h-[360px] bg-gradient-to-b from-stone-100 to-stone-200 rounded-2xl border border-stone-300 flex flex-col items-center justify-center select-none overflow-hidden"
            >
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm max-w-md pointer-events-none">
                <p className="text-4xl mb-2">👉🖱️</p>
                <h4 className="font-bold text-stone-800 text-lg">이 회색 영역 아무 곳이나 "오른쪽 단추"를 톡 눌러보세요!</h4>
                <p className="text-stone-600 text-sm mt-1">
                  (평소에 쓰던 왼쪽 단추가 아니라, 오른쪽 단추를 누르셔야 합니다!)
                </p>
              </div>

              {/* Simulated Context Menu */}
              <AnimatePresence>
                {rightMenu.visible && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                      position: 'absolute',
                      left: Math.min(rightMenu.x, 300),
                      top: Math.min(rightMenu.y, 180),
                    }}
                    className="w-56 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 z-20 text-stone-800 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-1.5 text-xs text-stone-400 font-bold border-b border-stone-100">
                      마우스 오른쪽 메뉴
                    </div>
                    {[
                      { name: '새로고침 (화면 깨끗하게)', icon: '🔄', msg: '새로고침을 누르셨습니다! 화면이 말끔해졌어요.' },
                      { name: '새 폴더 만들기 (서류함 추가)', icon: '📁', msg: '새 폴더가 만들어졌습니다! 서류를 담을 수 있어요.' },
                      { name: '글자 크기 크게 보기', icon: '🔍', msg: '글자를 시원하게 키우는 메뉴를 누르셨습니다.' },
                      { name: '바탕화면 배경 바꾸기', icon: '🖼️', msg: '예쁜 풍경 사진으로 배경을 바꿉니다.' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setRightClickAction(item.msg);
                          setRightMenu({ ...rightMenu, visible: false });
                          speakText(item.msg);
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-amber-50 hover:text-amber-900 font-medium flex items-center gap-2.5 transition"
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {rightClickAction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span className="font-bold text-base">{rightClickAction}</span>
                </div>
                <button
                  onClick={() => setRightClickAction(null)}
                  className="text-emerald-700 text-xs px-2 py-1 bg-emerald-100 rounded hover:bg-emerald-200"
                >
                  닫기
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Mode 4: 드래그 앤 드롭 연습 */}
        {mode === 'drag' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Mouse className="w-6 h-6 text-amber-600" />
                드래그 앤 드롭 연습: 마우스로 꾹 잡고 원하는 곳으로 끌고 가기!
              </h3>
              <p className="text-stone-600 mt-1">
                아이콘을 마우스 왼쪽 단추로 누른 상태에서 손가락을 떼지 말고, "문서 보관함" 위로 질질 끌고 가서 손을 놓으세요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Items */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <h4 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                  <span>흩어져 있는 파일들 (끌고 갈 물건)</span>
                </h4>
                <div className="space-y-3">
                  {draggedItems.map(item => (
                    <div
                      key={item.id}
                      draggable={!item.placed}
                      onDragStart={() => {
                        setCurrentDraggingId(item.id);
                        speakText(`${item.name}을 잡았습니다. 보관함으로 끌고 가세요.`);
                      }}
                      className={`p-4 rounded-xl border flex items-center justify-between select-none transition-all ${
                        item.placed
                          ? 'bg-stone-200 border-stone-300 text-stone-400 opacity-60 line-through cursor-default'
                          : 'bg-white border-stone-300 hover:border-amber-400 hover:shadow-md cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.icon}</span>
                        <span className="font-bold text-stone-800">{item.name}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded">
                        {item.placed ? '보관 완료' : '잡아서 끌기'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverBox(true);
                }}
                onDragLeave={() => setIsDragOverBox(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverBox(false);
                  if (currentDraggingId) {
                    setDraggedItems(prev =>
                      prev.map(item => item.id === currentDraggingId ? { ...item, placed: true } : item)
                    );
                    speakText('보관함에 쏙 넣었습니다! 참 잘하셨어요.');
                    setCurrentDraggingId(null);
                  }
                }}
                className={`border-4 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[300px] ${
                  isDragOverBox
                    ? 'border-amber-500 bg-amber-50 scale-102'
                    : 'border-stone-300 bg-amber-50/30'
                }`}
              >
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-4 text-amber-700">
                  📁
                </div>
                <h4 className="text-xl font-extrabold text-stone-900">문서 안전 보관함</h4>
                <p className="text-stone-600 mt-2 max-w-xs">
                  왼쪽의 파일들을 마우스로 꾹 누른 채 이 네모 상자 안으로 끌고 와서 손을 놓으세요!
                </p>
                <div className="mt-4 text-sm font-bold text-amber-700 bg-white px-4 py-1.5 rounded-full border border-amber-200">
                  보관 완료: {draggedItems.filter(i => i.placed).length} / {draggedItems.length}
                </div>
              </div>
            </div>

            {draggedItems.every(i => i.placed) && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-500 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-200" />
                  <div>
                    <h4 className="font-bold text-lg">대성공! 모든 파일을 안전하게 정리하셨습니다!</h4>
                    <p className="text-emerald-100 text-sm">드래그 앤 드롭 실력이 아주 훌륭하십니다.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDraggedItems(prev => prev.map(i => ({ ...i, placed: false })));
                    speakText('파일 정리를 다시 시작합니다.');
                  }}
                  className="px-4 py-2 bg-white text-emerald-800 rounded-xl font-bold hover:bg-emerald-50 transition"
                >
                  다시 연습하기
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Mode 5: 휠 스크롤 연습 */}
        {mode === 'scroll' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Mouse className="w-6 h-6 text-amber-600" />
                휠 스크롤 연습: 마우스 가운데 동그란 바퀴를 아래로 굴려보세요!
              </h3>
              <p className="text-stone-600 mt-1">
                긴 글이나 신문 기사를 볼 때, 마우스 가운데 바퀴(휠)를 내 몸 쪽(아래)으로 살살 굴려 끝까지 읽는 연습입니다.
              </p>
            </div>

            {/* Scroll Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-stone-700">읽은 분량:</span>
              <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-600 h-full transition-all duration-150"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <span className="text-sm font-extrabold text-amber-600">{scrollProgress}%</span>
            </div>

            {/* Scrollable Newspaper Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-[380px] overflow-y-auto bg-stone-50 rounded-2xl border-2 border-stone-300 p-8 space-y-6 shadow-inner"
            >
              <div className="text-center border-b-2 border-stone-300 pb-4">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">우리 동네 행복 신문</span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">배움에는 나이가 없습니다! 컴퓨터 교실 대인기</h2>
                <p className="text-stone-500 text-sm mt-1">발행일: 2026년 봄날 | 기자: 컴퓨터 첫걸음</p>
              </div>

              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
                <p className="font-semibold text-lg text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  👇 마우스 가운데 휠을 아래로 천천히 굴리면서 기사를 계속 읽어내려가 보세요!
                </p>
                <p>
                  오늘날 컴퓨터와 스마트폰은 우리 생활에서 없어서는 안 될 소중한 친구가 되었습니다.
                  처음에는 마우스가 내 마음대로 움직이지 않아 당황스럽기도 하고, 키보드의 글자 자리를 찾는 데 시간이 걸리기도 합니다.
                </p>
                <p>
                  하지만 매일 10분씩 마우스를 쥐고 풍선을 터뜨려보고, 사랑하는 가족의 이름을 한 자 한 자 치다 보면 어느새 내 손과 마우스가 하나가 된 듯 편안해집니다.
                </p>
                <div className="p-4 bg-white rounded-xl border border-stone-200 my-4 text-center">
                  <span className="text-4xl">🌸 ☕ 🌸</span>
                  <h4 className="font-bold text-stone-900 mt-2">오늘의 명언</h4>
                  <p className="text-stone-600 italic">"시작이 반이다. 오늘 마우스를 잡은 당신은 이미 절반을 해내셨습니다."</p>
                </div>
                <p>
                  이제 다음 단계에서는 키보드로 멋진 글씨를 쓰고, 인터넷 세상에서 좋아하는 가수 임영웅이나 나훈아의 노래를 마음껏 들을 수 있는 신나는 여정이 기다리고 있습니다.
                </p>
                <p>
                  컴퓨터는 아무리 잘못 눌러도 고장 나지 않는 착한 기계입니다. 겁내지 마시고 씩씩하게 도전해보세요!
                </p>
                <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-extrabold text-emerald-950">축하합니다! 끝까지 다 읽으셨습니다!</h4>
                  <p className="text-emerald-800 text-sm">휠 스크롤 감각을 완벽하게 익히셨습니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
