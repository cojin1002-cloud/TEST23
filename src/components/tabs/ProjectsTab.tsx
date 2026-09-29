import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  AlertTriangle, 
  Users, 
  Edit2, 
  Trash2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { ActiveProject, ProjectStatus } from '../../types/handover';

interface ProjectsTabProps {
  projects: ActiveProject[];
  onUpdateProjects: (projects: ActiveProject[]) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (project: ActiveProject) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  onUpdateProjects,
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusMap: Record<ProjectStatus, { label: string; textClass: string }> = {
    active: { label: '진행 중', textClass: 'text-indigo-600 font-semibold' },
    pending: { label: '대기/보류', textClass: 'text-slate-600 font-semibold' },
    delayed: { label: '일정 지연', textClass: 'text-rose-600 font-semibold' },
    wrapped: { label: '완료/종료', textClass: 'text-emerald-600 font-semibold' },
  };

  const toggleHandedOver = (id: string) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, isHandedOver: !p.isHandedOver };
      }
      return p;
    });
    onUpdateProjects(updated);
  };

  const deleteProject = (id: string) => {
    if (confirm('이 프로젝트 인수인계 항목을 삭제하시겠습니까?')) {
      onUpdateProjects(projects.filter((p) => p.id !== id));
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">진행 중인 프로젝트 및 현안 과제</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            현재 진행 중인 프로젝트의 진척도, 잔여 마일스톤, 후속 조치 사항과 잠재 리스크를 인계합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>프로젝트 추가</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            filterStatus === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          전체 ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('active')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            filterStatus === 'active'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          진행 중 ({projects.filter((p) => p.status === 'active').length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            filterStatus === 'pending'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          대기/보류 ({projects.filter((p) => p.status === 'pending').length})
        </button>
      </div>

      {/* Project Cards */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-sm font-medium text-slate-700">등록된 진행 프로젝트가 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">상단의 [+ 프로젝트 추가] 버튼을 눌러 현안 과제를 추가하세요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const isDone = project.isHandedOver;

            return (
              <div
                key={project.id}
                className={`bg-white rounded-xl border transition-all ${
                  isDone
                    ? 'border-slate-200/80 bg-slate-50/40'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleHandedOver(project.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                        title={isDone ? '인계 취소' : '인계 완료로 표시'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                        )}
                      </button>

                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className={statusMap[project.status]?.textClass}>
                            {statusMap[project.status]?.label || project.status}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>진척도 {project.progress}%</span>
                          {project.collaborators && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                {project.collaborators}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title & Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3 className={`text-base font-bold text-slate-900 ${isDone ? 'text-slate-600' : ''}`}>
                              {project.title}
                            </h3>
                            <span className="text-xs font-bold text-indigo-600 shrink-0">
                              {project.progress}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                          {project.description}
                        </p>

                        {/* Next Actions & Milestones */}
                        {project.nextActions && (
                          <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950">
                            <div className="font-semibold text-indigo-900 mb-1 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                              후속 조치 사항 및 차기 마일스톤
                            </div>
                            <div className="leading-relaxed whitespace-pre-line">{project.nextActions}</div>
                          </div>
                        )}

                        {/* Risks & Attention Points */}
                        {project.keyRisks && (
                          <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/60 text-xs text-rose-950">
                            <div className="font-semibold text-rose-800 mb-1 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              주요 주의사항 및 잠재 리스크
                            </div>
                            <div className="leading-relaxed whitespace-pre-line">{project.keyRisks}</div>
                          </div>
                        )}

                        {/* Doc link */}
                        {project.docLink && (
                          <div>
                            <a
                              href={project.docLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>프로젝트 상세 기획서 / 대시보드 바로가기</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(project)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
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
