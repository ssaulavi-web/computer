export type FontSize = 'normal' | 'large' | 'huge';

export type MainTab = 'simulator' | 'curriculum';

export type SimulatorModule = 'mouse' | 'keyboard' | 'window' | 'web';

export type MouseSubMode = 'click' | 'doubleClick' | 'rightClick' | 'drag' | 'scroll';

export interface TimeSlot {
  time: string;
  content: string;
}

export interface PeriodPlan {
  title: string;
  timeTable: TimeSlot[];
  keyPoints?: string[];
  instructorScript?: string;
  missions?: string[];
  troubleshootingFAQ?: { q: string; a: string }[];
}

export interface BreakTimePlan {
  duration: string;
  tips: string;
}

export interface LessonPlan {
  title: string;
  week: number;
  overview: string;
  period1: PeriodPlan;
  breakTime: BreakTimePlan;
  period2: PeriodPlan;
  handoutText: string;
  relatedSimulatorModule?: SimulatorModule;
}

export interface CurriculumWeek {
  id: string;
  weekNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  iconName: string;
  relatedSimulatorModule?: SimulatorModule;
  period1Summary: string;
  period2Summary: string;
  lessonPlan: LessonPlan;
}
