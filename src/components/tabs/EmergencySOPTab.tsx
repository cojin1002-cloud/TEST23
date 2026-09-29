import React, { useState } from 'react';
import { 
  Plus, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  ListOrdered, 
  Calendar, 
  Edit2, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { EmergencySOP } from '../../types/handover';

interface EmergencySOPTabProps {
  sops: EmergencySOP[];
  onUpdateSOPs: (sops: EmergencySOP[]) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (sop: EmergencySOP) => void;
}

export const EmergencySOPTab: React.FC<EmergencySOPTabProps> = ({
  sops,
  onUpdateSOPs,
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const urgencyBadges: Record<'critical' | 'high' | 'medium', { label: string; textClass: string }> = {
    critical: { label: '긴급 (CRITICAL)', textClass: 'text-rose-700 font-bold' },
    high: { label: '중요 (HIGH)', textClass: 'text-amber-700 font-semibold' },
    medium: { label: '보통 (MEDIUM)', textClass: 'text-indigo-700 font-medium' },
  };

  const deleteSOP = (id: string) => {
    if (confirm('이 비상 대응 SOP 항목을 삭제하시겠습니까?')) {
      onUpdateSOPs(sops.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">장애 및 비상 대응 매뉴얼 (SOP)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            전임자 부재 시 즉시 대응할 수 있도록 주요 인시던트 시나리오별 단계별 조치 매뉴얼과 비상 연락망을 기록합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>SOP 시나리오 추가</span>
        </button>
      </div>

      {/* List */}
      {sops.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">등록된 비상 대응 SOP가 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">
            "결제 오류 발생 시", "서버 과부하 시", "고객 민원 폭증 시" 등 예상되는 장애 시나리오를 추가하세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sops.map((sop, idx) => {
            const urgency = urgencyBadges[sop.urgency];

            return (
              <div
                key={sop.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Meta header (Zero pill rule) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">시나리오 #{idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span className={urgency.textClass}>{urgency.label}</span>
                        {sop.lastTestedDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>최근 모의훈련일: {sop.lastTestedDate}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 shrink-0 ${sop.urgency === 'critical' ? 'text-rose-600' : 'text-amber-500'}`} />
                        <span>{sop.scenario}</span>
                      </h3>

                      {/* Step-by-Step action procedure */}
                      <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                        <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
                          단계별 표준 조치 절차 (Action Procedure)
                        </div>
                        <ol className="space-y-2">
                          {sop.actionSteps.map((step, sIdx) => (
                            <li key={sIdx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                              <span className="font-semibold text-indigo-600 shrink-0 select-none">
                                {sIdx + 1}.
                              </span>
                              <span className="flex-1 whitespace-pre-line">{step.replace(/^\d+\.\s*/, '')}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Escalation Contact */}
                      {sop.escalationContact && (
                        <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-indigo-900">비상 에스컬레이션 보고처: </span>
                            <span>{sop.escalationContact}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(sop)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSOP(sop.id)}
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
