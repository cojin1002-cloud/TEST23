import React, { useState } from 'react';
import { 
  Plus, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  Edit2, 
  Trash2,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react';
import { AccountAccess, AccountStatus } from '../../types/handover';

interface AccountsTabProps {
  accounts: AccountAccess[];
  onUpdateAccounts: (accounts: AccountAccess[]) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (account: AccountAccess) => void;
}

export const AccountsTab: React.FC<AccountsTabProps> = ({
  accounts,
  onUpdateAccounts,
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusConfigs: Record<AccountStatus, { label: string; textClass: string; bgClass: string; borderClass: string }> = {
    pending: { label: '이관 대기', textClass: 'text-amber-700', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
    in_progress: { label: '승인/신청 중', textClass: 'text-indigo-700', bgClass: 'bg-indigo-50', borderClass: 'border-indigo-200' },
    transferred: { label: '이관 완료', textClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' },
    revoked: { label: '권한 회수 완료', textClass: 'text-slate-600', bgClass: 'bg-slate-100', borderClass: 'border-slate-200' },
    not_applicable: { label: '해당 없음', textClass: 'text-slate-400', bgClass: 'bg-slate-50', borderClass: 'border-slate-200' },
  };

  const handleStatusChange = (id: string, newStatus: AccountStatus) => {
    const updated = accounts.map((acc) => {
      if (acc.id === id) {
        return {
          ...acc,
          status: newStatus,
          transferredDate: newStatus === 'transferred' ? new Date().toISOString().slice(0, 10) : acc.transferredDate,
        };
      }
      return acc;
    });
    onUpdateAccounts(updated);
  };

  const deleteAccount = (id: string) => {
    if (confirm('이 계정 권한 항목을 삭제하시겠습니까?')) {
      onUpdateAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  const filtered = accounts.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const transferredCount = accounts.filter((a) => a.status === 'transferred' || a.status === 'revoked').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">시스템 계정 및 접근 권한 이관</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            클라우드, 사내 어드민, 외부 솔루션의 마스터/관리자 권한 및 2차 인증(OTP)을 안전하게 이전합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>계정 권한 추가</span>
        </button>
      </div>

      {/* Security Tip Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">보안 체크리스트 필독</p>
          <p className="text-amber-900 leading-relaxed">
            1. 관리자 권한 이양 후 반드시 전임자의 접근 권한을 즉시 회수하거나 비밀번호를 초기화하세요.<br />
            2. Google Authenticator / YubiKey 등 2차 인증(2FA) 등록 기기를 후임자의 스마트폰으로 재설정해야 합니다.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          전체 ({accounts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            filterStatus === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          이관 대기 ({accounts.filter((a) => a.status === 'pending').length})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('transferred')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
            filterStatus === 'transferred' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          이관 완료 ({accounts.filter((a) => a.status === 'transferred').length})
        </button>
      </div>

      {/* Account Table/Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-sm font-medium text-slate-700">해당 상태의 계정 권한 항목이 없습니다.</p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            + 새 계정 권한 등록하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {filtered.map((acc) => {
              const cfg = statusConfigs[acc.status];

              return (
                <div key={acc.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-indigo-600">
                          {acc.roleType} 권한
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {acc.accountIdentifier}
                        </span>
                        {acc.has2FA && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Smartphone className="w-3 h-3 text-amber-600" />
                              2FA/OTP 필수
                            </span>
                          </>
                        )}
                        {acc.transferredDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700">이관일: {acc.transferredDate}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {acc.systemName}
                      </h3>

                      {acc.notes && (
                        <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                          {acc.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status Dropdown */}
                      <select
                        value={acc.status}
                        onChange={(e) => handleStatusChange(acc.id, e.target.value as AccountStatus)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer`}
                      >
                        <option value="pending">이관 대기</option>
                        <option value="in_progress">승인/진행 중</option>
                        <option value="transferred">이관 완료</option>
                        <option value="revoked">권한 회수</option>
                        <option value="not_applicable">해당 없음</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(acc)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAccount(acc.id)}
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
        </div>
      )}
    </div>
  );
};
