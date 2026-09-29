import React, { useState, useEffect } from 'react';
import { AccountAccess, AccountStatus } from '../../types/handover';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: AccountAccess | null;
  onSave: (account: AccountAccess) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSave,
}) => {
  const [systemName, setSystemName] = useState('');
  const [roleType, setRoleType] = useState<'Admin' | 'Member' | 'Billing' | 'Owner' | 'Operator'>('Admin');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [has2FA, setHas2FA] = useState(false);
  const [status, setStatus] = useState<AccountStatus>('pending');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (account) {
      setSystemName(account.systemName);
      setRoleType(account.roleType);
      setAccountIdentifier(account.accountIdentifier);
      setHas2FA(account.has2FA);
      setStatus(account.status);
      setNotes(account.notes);
    } else {
      setSystemName('');
      setRoleType('Admin');
      setAccountIdentifier('');
      setHas2FA(false);
      setStatus('pending');
      setNotes('');
    }
  }, [account, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: AccountAccess = {
      id: account?.id || `acc-${Date.now()}`,
      systemName,
      roleType,
      accountIdentifier,
      has2FA,
      status,
      notes,
      transferredDate: status === 'transferred' ? account?.transferredDate || new Date().toISOString().slice(0, 10) : undefined,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {account ? '계정 권한 이관 항목 수정' : '새 시스템 계정 및 권한 추가'}
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
            <label className="block font-semibold text-slate-700 mb-1">시스템 / 서비스명</label>
            <input
              type="text"
              required
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="예: AWS Production Root 콘솔, GitHub Org Admin, Jira"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">권한 등급</label>
              <select
                value={roleType}
                onChange={(e) => setRoleType(e.target.value as any)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="Owner">최고 관리자 (Owner)</option>
                <option value="Admin">관리자 (Admin)</option>
                <option value="Operator">운영자 (Operator)</option>
                <option value="Billing">결제/정산 (Billing)</option>
                <option value="Member">일반 멤버 (Member)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">이관 상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AccountStatus)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="pending">이관 대기</option>
                <option value="in_progress">승인/신청 중</option>
                <option value="transferred">이관 완료</option>
                <option value="revoked">권한 회수 대상</option>
                <option value="not_applicable">해당 없음</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">계정 식별자 (ID 또는 이메일)</label>
            <input
              type="text"
              required
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              placeholder="예: admin@company.com 또는 @taewan-dev"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">이관 상세 메모 및 특이사항</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 보안 OTP 기기 실물 전달 필요, IT지원팀 승인 결재 상신 필요"
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="has-2fa-check"
              checked={has2FA}
              onChange={(e) => setHas2FA(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="has-2fa-check" className="font-semibold text-slate-800">
              2차 인증(OTP / 보안키 / 2FA) 재설정 및 기기 이전 필수
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
