import React from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Edit3, 
  User, 
  UserCheck, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { HandoverDocument, HandoverStatus } from '../types/handover';
import { calculateProgress } from '../utils/storage';

interface DocumentMetaHeaderProps {
  document: HandoverDocument;
  onEditMeta: () => void;
  onStatusChange: (status: HandoverStatus) => void;
}

export const DocumentMetaHeader: React.FC<DocumentMetaHeaderProps> = ({
  document,
  onEditMeta,
  onStatusChange,
}) => {
  const progress = calculateProgress(document);

  // Calculate D-Day
  const targetDate = new Date(document.targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const statusLabels: Record<HandoverStatus, { label: string; color: string; border: string }> = {
    draft: { label: '작성 중 (초안)', color: 'text-slate-700 bg-slate-100', border: 'border-slate-300' },
    in_progress: { label: '인수인계 진행 중', color: 'text-indigo-700 bg-indigo-50', border: 'border-indigo-300' },
    review: { label: '최종 검토 중', color: 'text-amber-700 bg-amber-50', border: 'border-amber-300' },
    signed: { label: '서명 및 완료', color: 'text-emerald-700 bg-emerald-50', border: 'border-emerald-300' },
    archived: { label: '보관됨', color: 'text-slate-500 bg-slate-50', border: 'border-slate-200' },
  };

  return (
    <div className="bg-white border-b border-slate-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Info Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {document.department}
              </span>
              <span aria-hidden="true">·</span>
              <span>{document.reason}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {document.startDate} ~ {document.targetDate}
              </span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${diffDays < 0 ? 'text-rose-600' : diffDays <= 7 ? 'text-amber-600' : 'text-slate-600'}`}>
                {diffDays < 0 ? `기한 초과 (D+${Math.abs(diffDays)})` : diffDays === 0 ? '오늘 마감 (D-Day)' : `D-${diffDays}일 남음`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                {document.title}
              </h1>
              <button
                type="button"
                onClick={onEditMeta}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
                title="기본 정보 및 인원 수정"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {document.summary && (
              <p className="text-sm text-slate-600 line-clamp-2 max-w-3xl">
                {document.summary}
              </p>
            )}
          </div>

          {/* Status selector & Quick Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <label htmlFor="status-select" className="text-xs text-slate-500 font-medium">
                진행 상태:
              </label>
              <select
                id="status-select"
                value={document.status}
                onChange={(e) => onStatusChange(e.target.value as HandoverStatus)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border ${
                  statusLabels[document.status].color
                } ${statusLabels[document.status].border} focus:ring-2 focus:ring-indigo-500 cursor-pointer`}
              >
                <option value="draft">작성 중 (초안)</option>
                <option value="in_progress">인수인계 진행 중</option>
                <option value="review">최종 검토 중</option>
                <option value="signed">서명 및 완료</option>
                <option value="archived">보관됨</option>
              </select>
            </div>
          </div>
        </div>

        {/* Participants Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
          {/* Handover Person */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-500" /> 인계자 (전임)
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">작성 및 설명</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {document.handoverPerson.name}
              <span className="ml-1.5 font-normal text-xs text-slate-600">
                {document.handoverPerson.role}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-2 truncate">
              <span>{document.handoverPerson.email}</span>
              <span aria-hidden="true">·</span>
              <span>{document.handoverPerson.phone}</span>
            </div>
          </div>

          {/* Takeover Person */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> 인수자 (후임)
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">확인 및 실습</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {document.takeoverPerson.name}
              <span className="ml-1.5 font-normal text-xs text-slate-600">
                {document.takeoverPerson.role}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-2 truncate">
              <span>{document.takeoverPerson.email}</span>
              <span aria-hidden="true">·</span>
              <span>{document.takeoverPerson.phone}</span>
            </div>
          </div>

          {/* Supervisor */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> 확인자 (부서장)
              </span>
              <span className="text-[11px] text-amber-600 font-medium">최종 승인</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {document.supervisor.name}
              <span className="ml-1.5 font-normal text-xs text-slate-600">
                {document.supervisor.role}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 truncate">
              <span>{document.supervisor.email}</span>
            </div>
          </div>
        </div>

        {/* Global Progress Gauge */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">전체 인수인계 달성률</span>
              <span className="text-sm font-bold text-indigo-600">{progress.overallPercentage}%</span>
            </div>

            {/* Sub metric text separators */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>루틴 업무 {progress.routineDone}/{progress.routineTotal}</span>
              <span aria-hidden="true">·</span>
              <span>프로젝트 {progress.projectDone}/{progress.projectTotal}</span>
              <span aria-hidden="true">·</span>
              <span>계정 권한 {progress.accountDone}/{progress.accountTotal}</span>
              <span aria-hidden="true">·</span>
              <span>서명 {progress.signaturesDone}/{progress.signaturesRequired}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                progress.overallPercentage === 100
                  ? 'bg-emerald-500'
                  : progress.overallPercentage > 50
                  ? 'bg-indigo-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(progress.overallPercentage, 3)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
