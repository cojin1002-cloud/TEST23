import React, { useState, useEffect } from 'react';
import { RoutineTask, TaskCycle, TaskPriority } from '../../types/handover';

interface RoutineTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: RoutineTask | null;
  onSave: (task: RoutineTask) => void;
}

export const RoutineTaskModal: React.FC<RoutineTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
}) => {
  const [cycle, setCycle] = useState<TaskCycle>('daily');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [toolOrSystem, setToolOrSystem] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('30분');
  const [guideUrl, setGuideUrl] = useState('');
  const [keyTips, setKeyTips] = useState('');
  const [isHandedOver, setIsHandedOver] = useState(false);

  useEffect(() => {
    if (task) {
      setCycle(task.cycle);
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setToolOrSystem(task.toolOrSystem);
      setEstimatedTime(task.estimatedTime);
      setGuideUrl(task.guideUrl || '');
      setKeyTips(task.keyTips);
      setIsHandedOver(task.isHandedOver);
    } else {
      setCycle('daily');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setToolOrSystem('');
      setEstimatedTime('30분');
      setGuideUrl('');
      setKeyTips('');
      setIsHandedOver(false);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: RoutineTask = {
      id: task?.id || `rt-${Date.now()}`,
      cycle,
      title,
      description,
      priority,
      toolOrSystem,
      estimatedTime,
      guideUrl: guideUrl.trim() || undefined,
      keyTips,
      isHandedOver,
      handoverDate: isHandedOver ? task?.handoverDate || new Date().toISOString().slice(0, 10) : undefined,
      verifiedByTakeover: task?.verifiedByTakeover || false,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {task ? '정기 업무 항목 수정' : '새 정기 업무 항목 추가'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">수행 주기</label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value as TaskCycle)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="daily">일간 (매일)</option>
                <option value="weekly">주간 (매주)</option>
                <option value="monthly">월간 (매월)</option>
                <option value="quarterly">분기별</option>
                <option value="yearly">연간 (연 1회)</option>
                <option value="ad-hoc">수시 (필요시)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">중요도</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="high">높음 (High)</option>
                <option value="medium">보통 (Medium)</option>
                <option value="low">낮음 (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">업무명</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 주간 스프린트 백로그 리뷰 및 배포 준비"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">세부 수행 절차 및 방법</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="구체적인 수행 단계, 체크해야 할 조건, 관련 부서 등을 작성하세요."
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">사용 시스템 / 툴</label>
              <input
                type="text"
                required
                value={toolOrSystem}
                onChange={(e) => setToolOrSystem(e.target.value)}
                placeholder="예: Jira, Datadog, Slack, Flex"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">예상 소요 시간</label>
              <input
                type="text"
                required
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="예: 30분, 1시간, 반나절"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">핵심 노하우 & 주의사항 (Tip)</label>
            <input
              type="text"
              value={keyTips}
              onChange={(e) => setKeyTips(e.target.value)}
              placeholder="예: 매월 20일 이전 결재 필수, 5xx 에러 발생 시 즉시 슬랙 공유"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">관련 위키/문서 링크 (선택)</label>
            <input
              type="url"
              value={guideUrl}
              onChange={(e) => setGuideUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="handed-over-check"
              checked={isHandedOver}
              onChange={(e) => setIsHandedOver(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="handed-over-check" className="font-semibold text-slate-800">
              인수자에게 인계 및 설명 완료됨
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
