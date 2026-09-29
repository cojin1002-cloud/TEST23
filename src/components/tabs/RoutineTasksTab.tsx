import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  Lightbulb, 
  Edit2, 
  Trash2, 
  Filter,
  CheckCheck
} from 'lucide-react';
import { RoutineTask, TaskCycle, TaskPriority } from '../../types/handover';

interface RoutineTasksTabProps {
  tasks: RoutineTask[];
  onUpdateTasks: (tasks: RoutineTask[]) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (task: RoutineTask) => void;
}

export const RoutineTasksTab: React.FC<RoutineTasksTabProps> = ({
  tasks,
  onUpdateTasks,
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cycleLabels: Record<TaskCycle, { label: string; desc: string }> = {
    daily: { label: '일간 (매일)', desc: '출근/퇴근 시 수행하는 일일 루틴' },
    weekly: { label: '주간 (매주)', desc: '주간 회의, 주간 보고, 정기 배포 등' },
    monthly: { label: '월간 (매월)', desc: '월말 결산, 세금계산서, 정기 점검' },
    quarterly: { label: '분기별', desc: '분기 목표 평가, 비밀번호 로테이션' },
    yearly: { label: '연간 (연 1회)', desc: '연간 사업계획, 라이선스 갱신' },
    'ad-hoc': { label: '수시 (필요시)', desc: '요청 시 비정기적으로 발생하는 업무' },
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedCycle !== 'all' && task.cycle !== selectedCycle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.toolOrSystem.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleHandedOver = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.isHandedOver;
        return {
          ...t,
          isHandedOver: nextState,
          handoverDate: nextState ? new Date().toISOString().slice(0, 10) : undefined,
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const toggleVerified = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          verifiedByTakeover: !t.verifiedByTakeover,
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const deleteTask = (id: string) => {
    if (confirm('이 정기 업무 항목을 삭제하시겠습니까?')) {
      onUpdateTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const completedCount = tasks.filter((t) => t.isHandedOver).length;
  const verifiedCount = tasks.filter((t) => t.verifiedByTakeover).length;

  return (
    <div className="space-y-6">
      {/* Overview & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">정기 및 반복 업무 인수인계</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            일간, 주간, 월간 주기로 반복되는 핵심 루틴과 절차를 정리하고 실습을 통해 인계합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>업무 항목 추가</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Cycle Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCycle('all')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCycle === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 ({tasks.length})
          </button>
          {(['daily', 'weekly', 'monthly', 'quarterly', 'ad-hoc'] as TaskCycle[]).map((cycle) => {
            const count = tasks.filter((t) => t.cycle === cycle).length;
            return (
              <button
                key={cycle}
                type="button"
                onClick={() => setSelectedCycle(cycle)}
                className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCycle === cycle
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cycleLabels[cycle].label.split(' ')[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="업무명, 절차, 툴 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 pl-3 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Task List Cards */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-sm font-medium text-slate-700">등록된 정기 업무 항목이 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">상단의 [+ 업무 항목 추가] 버튼을 눌러 새 루틴을 등록하세요.</p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 업무 등록하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isDone = task.isHandedOver;
            const isVerified = task.verifiedByTakeover;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border transition-all ${
                  isDone
                    ? 'border-slate-200/80 bg-slate-50/40'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox for Handed Over */}
                      <button
                        type="button"
                        onClick={() => toggleHandedOver(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                        title={isDone ? '인계 취소' : '인계 완료로 표시'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                        )}
                      </button>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Metadata row (No pills rule applied) */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-indigo-700">
                            {cycleLabels[task.cycle]?.label || task.cycle}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            소요 {task.estimatedTime}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>시스템: {task.toolOrSystem}</span>
                          {task.priority === 'high' && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-rose-600 font-semibold">중요도 높음</span>
                            </>
                          )}
                          {task.handoverDate && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-700">인계일: {task.handoverDate}</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className={`text-base font-bold text-slate-900 ${isDone ? 'text-slate-600' : ''}`}>
                          {task.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                          {task.description}
                        </p>

                        {/* Key Tips / Know-how */}
                        {task.keyTips && (
                          <div className="mt-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold">실무 팁 & 주의사항: </span>
                              <span>{task.keyTips}</span>
                            </div>
                          </div>
                        )}

                        {/* Guide Link */}
                        {task.guideUrl && (
                          <div className="pt-1">
                            <a
                              href={task.guideUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>관련 매뉴얼 / 위키 링크 바로가기</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {/* Takeover verification button */}
                      <button
                        type="button"
                        onClick={() => toggleVerified(task.id)}
                        className={`px-2 py-1 text-xs rounded-md border flex items-center gap-1 transition-colors ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                        title="인수자가 실습/숙지 완료했음을 표시"
                      >
                        <CheckCheck className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="hidden sm:inline">{isVerified ? '후임 확인됨' : '후임 확인'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenEditModal(task)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
