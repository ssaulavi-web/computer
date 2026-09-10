import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid,
  Minus,
  Square,
  X,
  Folder,
  Image as ImageIcon,
  FileText,
  Volume2,
  CheckCircle2,
  Trophy,
  RefreshCw,
  Sparkles,
  Move
} from 'lucide-react';
import { speakText } from '../../utils/speech';

interface WindowLabProps {
  fontSizeClass: string;
}

interface VirtualWindow {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const WindowLab: React.FC<WindowLabProps> = ({ fontSizeClass }) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string>('photo-app');

  // Interactive missions checklist
  const [missionsCompleted, setMissionsCompleted] = useState<{ [key: string]: boolean }>({
    maximize: false,
    drag: false,
    minimize: false,
    close: false,
    start: false,
  });

  const [windows, setWindows] = useState<VirtualWindow[]>([
    {
      id: 'photo-app',
      title: '가족 사진첩 (창 1)',
      icon: <ImageIcon className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="p-4 space-y-3 text-center">
          <div className="bg-amber-100/60 p-4 rounded-xl border border-amber-200">
            <span className="text-4xl">🌻 🏞️ 🌸</span>
            <p className="font-bold text-stone-800 mt-2">행복한 봄나들이 가족 사진</p>
            <p className="text-xs text-stone-500">2026년 4월 화창한 날</p>
          </div>
          <p className="text-xs text-stone-600">
            오른쪽 맨 위 <strong>[ㅁ 최대화]</strong>를 누르면 이 사진을 화면 가득 크게 볼 수 있어요!
          </p>
        </div>
      ),
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 30,
      y: 30,
      width: 320,
      height: 240,
    },
    {
      id: 'memo-app',
      title: '간단 메모장 (창 2)',
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      content: (
        <div className="p-4 space-y-2">
          <p className="text-sm font-bold text-stone-800">📌 오늘의 장보기 목록:</p>
          <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
            <li>신선한 사과 1봉지</li>
            <li>구수한 된장</li>
            <li>달콤한 참외</li>
          </ul>
        </div>
      ),
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 90,
      width: 300,
      height: 200,
    },
  ]);

  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const completeMission = (missionKey: string) => {
    if (!missionsCompleted[missionKey]) {
      setMissionsCompleted(prev => ({ ...prev, [missionKey]: true }));
    }
  };

  const toggleStartMenu = () => {
    const nextState = !startMenuOpen;
    setStartMenuOpen(nextState);
    if (nextState) {
      completeMission('start');
      speakText('왼쪽 아래 [시작] 단추를 누르셨습니다. 설치된 프로그램 목록이 나타납니다.');
    }
  };

  const handleMinimize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    completeMission('minimize');
    speakText('최소화 단추를 누르셨습니다. 창이 화면 아래 작업표시줄로 쏙 내려갔습니다.');
  };

  const handleMaximize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(prev =>
      prev.map(w => {
        if (w.id === id) {
          const nextState = !w.isMaximized;
          if (nextState) {
            completeMission('maximize');
            speakText('최대화 단추를 누르셨습니다. 창이 화면 가득 커졌습니다.');
          } else {
            speakText('창이 원래 크기로 돌아왔습니다.');
          }
          return { ...w, isMaximized: nextState };
        }
        return w;
      })
    );
  };

  const handleClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isOpen: false } : w))
    );
    completeMission('close');
    speakText('닫기 X 단추를 누르셨습니다. 창이 깔끔하게 닫혔습니다.');
  };

  const restoreWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: false, isOpen: true } : w))
    );
    setActiveWindowId(id);
    speakText('작업표시줄에서 창을 다시 화면 위로 꺼냈습니다.');
  };

  // Window drag handlers
  const handleMouseDownHeader = (id: string, e: React.MouseEvent) => {
    setActiveWindowId(id);
    const win = windows.find(w => w.id === id);
    if (!win || win.isMaximized) return;

    setIsDraggingWindow(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    });
  };

  const handleMouseMoveStage = (e: React.MouseEvent) => {
    if (!isDraggingWindow) return;
    const stageRect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(10, Math.min(stageRect.width - 250, e.clientX - stageRect.left - 50));
    const newY = Math.max(10, Math.min(stageRect.height - 150, e.clientY - stageRect.top - 20));

    setWindows(prev =>
      prev.map(w => (w.id === activeWindowId ? { ...w, x: newX, y: newY } : w))
    );
    completeMission('drag');
  };

  const handleMouseUpStage = () => {
    if (isDraggingWindow) {
      setIsDraggingWindow(false);
      speakText('창을 원하는 자리로 잘 옮기셨습니다.');
    }
  };

  const allMissionsDone = Object.values(missionsCompleted).every(Boolean);

  return (
    <div className={`space-y-6 ${fontSizeClass}`}>
      {/* Educational Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-amber-600" />
              윈도우 창(Window) 3대 필수 버튼 마스터하기
            </h3>
            <p className="text-stone-600 mt-1">
              컴퓨터의 창 오른쪽 위에 있는 <strong>ㅡ (최소화), ㅁ (최대화), X (닫기)</strong>를 자유자재로 다뤄보세요!
            </p>
          </div>
          <button
            onClick={() => {
              setWindows(prev =>
                prev.map(w => ({
                  ...w,
                  isOpen: true,
                  isMinimized: false,
                  isMaximized: false,
                }))
              );
              speakText('창을 모두 원래 상태로 되돌렸습니다.');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 text-sm font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            창 위치 초기화
          </button>
        </div>

        {/* Mission Badges */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {[
            { key: 'maximize', label: 'ㅁ 최대화 눌러보기' },
            { key: 'drag', label: '창 머리 잡고 옮겨보기' },
            { key: 'minimize', label: 'ㅡ 최소화로 숨기기' },
            { key: 'close', label: 'X 닫기 단추 누르기' },
            { key: 'start', label: '[시작] 단추 열어보기' },
          ].map(m => (
            <div
              key={m.key}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                missionsCompleted[m.key]
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}
            >
              <span>{missionsCompleted[m.key] ? '✓' : '○'}</span>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Desktop Canvas */}
      <div
        onMouseMove={handleMouseMoveStage}
        onMouseUp={handleMouseUpStage}
        className="relative w-full h-[520px] bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-600 rounded-2xl overflow-hidden shadow-xl border-4 border-stone-800 select-none flex flex-col justify-between"
      >
        {/* Desktop Icons */}
        <div className="p-4 grid grid-cols-1 gap-4 w-28 z-0">
          <div
            onDoubleClick={() => restoreWindow('photo-app')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/20 cursor-pointer text-white text-center transition"
          >
            <div className="w-12 h-12 bg-amber-400/90 rounded-2xl flex items-center justify-center shadow-md">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold mt-1.5 drop-shadow">가족 사진첩</span>
          </div>

          <div
            onDoubleClick={() => restoreWindow('memo-app')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-white/20 cursor-pointer text-white text-center transition"
          >
            <div className="w-12 h-12 bg-blue-400/90 rounded-2xl flex items-center justify-center shadow-md">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold mt-1.5 drop-shadow">간단 메모장</span>
          </div>
        </div>

        {/* Windows on Desktop */}
        {windows.map(win => {
          if (!win.isOpen || win.isMinimized) return null;

          return (
            <motion.div
              key={win.id}
              onClick={() => setActiveWindowId(win.id)}
              style={
                win.isMaximized
                  ? {
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: 'calc(100% - 48px)',
                      zIndex: activeWindowId === win.id ? 20 : 10,
                    }
                  : {
                      position: 'absolute',
                      left: `${win.x}px`,
                      top: `${win.y}px`,
                      width: `${win.width}px`,
                      height: `${win.height}px`,
                      zIndex: activeWindowId === win.id ? 20 : 10,
                    }
              }
              className={`bg-white rounded-t-xl rounded-b-lg shadow-2xl border border-stone-300 flex flex-col overflow-hidden transition-all ${
                activeWindowId === win.id ? 'ring-2 ring-amber-400 shadow-sky-900/30' : 'opacity-95'
              }`}
            >
              {/* Window Title Bar */}
              <div
                onMouseDown={(e) => handleMouseDownHeader(win.id, e)}
                className={`px-3 py-2 flex items-center justify-between select-none cursor-move ${
                  activeWindowId === win.id
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {win.icon}
                  <span>{win.title}</span>
                  <Move className="w-3.5 h-3.5 opacity-60 ml-1" />
                </div>

                {/* 3 Essential Window Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Minimize Button */}
                  <button
                    onClick={(e) => handleMinimize(win.id, e)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/20 text-white font-bold transition"
                    title="ㅡ 최소화 (아래로 숨기기)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Maximize Button */}
                  <button
                    onClick={(e) => handleMaximize(win.id, e)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/20 text-white font-bold transition"
                    title="ㅁ 최대화 (화면 가득 키우기)"
                  >
                    <Square className="w-3 h-3" />
                  </button>

                  {/* Close Button (Red) */}
                  <button
                    onClick={(e) => handleClose(win.id, e)}
                    className="w-6 h-6 rounded flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-bold transition shadow-xs"
                    title="X 닫기 (창 닫기)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Window Body Content */}
              <div className="flex-1 bg-stone-50 overflow-y-auto">
                {win.content}
              </div>
            </motion.div>
          );
        })}

        {/* Start Menu Popup */}
        <AnimatePresence>
          {startMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute left-2 bottom-14 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 p-4 z-30 space-y-4"
            >
              <div className="border-b border-stone-100 pb-2 flex items-center gap-2 font-bold text-stone-900">
                <span className="text-xl">🪟</span>
                <span>윈도우 시작 메뉴</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button
                  onClick={() => {
                    restoreWindow('photo-app');
                    setStartMenuOpen(false);
                  }}
                  className="p-3 bg-stone-50 hover:bg-amber-50 rounded-xl text-left font-bold text-stone-800 flex items-center gap-2 border border-stone-200"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>사진첩</span>
                </button>
                <button
                  onClick={() => {
                    restoreWindow('memo-app');
                    setStartMenuOpen(false);
                  }}
                  className="p-3 bg-stone-50 hover:bg-amber-50 rounded-xl text-left font-bold text-stone-800 flex items-center gap-2 border border-stone-200"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>메모장</span>
                </button>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500">
                <span>사용자: 행복한 컴퓨터 교실</span>
                <span className="text-amber-700 font-bold">전원 끄기</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows Taskbar at the bottom */}
        <div className="h-12 bg-stone-900/90 backdrop-blur-md border-t border-stone-700/50 flex items-center justify-between px-3 z-30 select-none">
          {/* Start Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleStartMenu}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition ${
                startMenuOpen
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-100'
              }`}
            >
              <span className="text-base">🪟</span>
              <span>시작</span>
            </button>

            {/* Taskbar Window Tabs */}
            {windows.map(win => (
              <button
                key={win.id}
                onClick={() => restoreWindow(win.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  win.isOpen && !win.isMinimized && activeWindowId === win.id
                    ? 'bg-stone-700 text-amber-300 border-b-2 border-amber-400'
                    : win.isMinimized
                    ? 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {win.icon}
                <span className="truncate max-w-[100px]">{win.title}</span>
                {win.isMinimized && <span className="text-[10px] text-amber-400">(숨김)</span>}
              </button>
            ))}
          </div>

          {/* Clock & Notification */}
          <div className="text-xs text-stone-300 font-medium flex items-center gap-2">
            <span>🔊 100%</span>
            <span>오후 2:30</span>
          </div>
        </div>
      </div>

      {allMissionsDone && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl text-emerald-950 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="font-extrabold text-lg">축하합니다! 윈도우 창 3대 단추와 다루기를 모두 완벽히 정복하셨습니다!</h4>
              <p className="text-emerald-800 text-sm">이제 어떤 프로그램 창이 열려도 당황하지 않고 자유롭게 다루실 수 있습니다.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
