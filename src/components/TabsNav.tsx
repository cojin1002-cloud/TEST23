import React from 'react';
import { 
  ClipboardList, 
  Kanban, 
  KeyRound, 
  AlertTriangle, 
  Users, 
  CalendarClock, 
  PenTool,
  Check
} from 'lucide-react';
import { ActiveTab, HandoverDocument } from '../types/handover';

interface TabsNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  document: HandoverDocument;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onChangeTab,
  document,
}) => {
  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    count?: number;
    isComplete?: boolean;
  }> = [
    {
      id: 'routine',
      label: '정기/루틴 업무',
      icon: ClipboardList,
      count: document.routineTasks.length,
      isComplete: document.routineTasks.length > 0 && document.routineTasks.every((t) => t.isHandedOver),
    },
    {
      id: 'projects',
      label: '진행 프로젝트',
      icon: Kanban,
      count: document.activeProjects.length,
      isComplete: document.activeProjects.length > 0 && document.activeProjects.every((p) => p.isHandedOver),
    },
    {
      id: 'accounts',
      label: '계정 & 권한 이관',
      icon: KeyRound,
      count: document.accountAccesses.length,
      isComplete: document.accountAccesses.length > 0 && document.accountAccesses.every((a) => a.status === 'transferred' || a.status === 'revoked'),
    },
    {
      id: 'emergency',
      label: '비상 대응 (SOP)',
      icon: AlertTriangle,
      count: document.emergencySOPs.length,
    },
    {
      id: 'contacts_assets',
      label: '연락망 & 자료함',
      icon: Users,
      count: document.contacts.length + document.keyAssets.length,
    },
    {
      id: 'sessions_qna',
      label: '일정 & 질의응답 (Q&A)',
      icon: CalendarClock,
      count: document.sessions.length + document.qnaItems.length,
    },
    {
      id: 'signoff',
      label: '최종 서명 & 증서',
      icon: PenTool,
      isComplete: !!(document.signOff.handedOverBy?.signed && document.signOff.takenOverBy?.signed && document.signOff.approvedBy?.signed),
    },
  ];

  return (
    <div className="bg-slate-100/80 border-b border-slate-200 sticky top-16 z-20 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.isComplete && (
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
