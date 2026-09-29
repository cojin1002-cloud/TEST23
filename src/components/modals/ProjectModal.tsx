import React, { useState, useEffect } from 'react';
import { ActiveProject, ProjectStatus } from '../../types/handover';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ActiveProject | null;
  onSave: (project: ActiveProject) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [nextActions, setNextActions] = useState('');
  const [keyRisks, setKeyRisks] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [docLink, setDocLink] = useState('');
  const [isHandedOver, setIsHandedOver] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setProgress(project.progress);
      setStatus(project.status);
      setNextActions(project.nextActions);
      setKeyRisks(project.keyRisks);
      setCollaborators(project.collaborators);
      setDocLink(project.docLink || '');
      setIsHandedOver(project.isHandedOver);
    } else {
      setTitle('');
      setDescription('');
      setProgress(50);
      setStatus('active');
      setNextActions('');
      setKeyRisks('');
      setCollaborators('');
      setDocLink('');
      setIsHandedOver(false);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ActiveProject = {
      id: project?.id || `proj-${Date.now()}`,
      title,
      description,
      progress: Number(progress),
      status,
      nextActions,
      keyRisks,
      collaborators,
      docLink: docLink.trim() || undefined,
      isHandedOver,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {project ? '진행 프로젝트 수정' : '새 진행 프로젝트 추가'}
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
          <div>
            <label className="block font-semibold text-slate-700 mb-1">프로젝트명 / 과제명</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2026 결제 모듈 V2 개편 및 환불 자동화"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">상태 구분</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="active">진행 중 (Active)</option>
                <option value="pending">대기/보류 (Pending)</option>
                <option value="delayed">일정 지연 (Delayed)</option>
                <option value="wrapped">완료/종료 (Wrapped)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                현재 진척도 ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">프로젝트 개요 및 현재 상태</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="현재 어느 단계까지 진행되었는지 상세히 설명하세요."
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">후속 조치 필요사항 & 마일스톤</label>
            <textarea
              rows={2}
              value={nextActions}
              onChange={(e) => setNextActions(e.target.value)}
              placeholder="후임자가 이어서 처리해야 할 구체적인 다음 스텝과 마감일정"
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">주요 주의사항 및 잠재 리스크</label>
            <input
              type="text"
              value={keyRisks}
              onChange={(e) => setKeyRisks(e.target.value)}
              placeholder="예: 고객사 협의 지연 가능성, PG사 점검 시간 이슈"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">주요 협업자 / 관련자</label>
              <input
                type="text"
                value={collaborators}
                onChange={(e) => setCollaborators(e.target.value)}
                placeholder="예: 개발팀(김철수), 마케팅팀(이영희)"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">기획서/대시보드 링크</label>
              <input
                type="url"
                value={docLink}
                onChange={(e) => setDocLink(e.target.value)}
                placeholder="https://notion.so/..."
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="proj-handed-check"
              checked={isHandedOver}
              onChange={(e) => setIsHandedOver(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="proj-handed-check" className="font-semibold text-slate-800">
              프로젝트 히스토리 및 현안 인계 완료됨
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
