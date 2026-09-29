import React, { useState } from 'react';
import { HandoverDocument, HandoverReason } from '../../types/handover';

interface EditMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: HandoverDocument;
  onSave: (updated: Partial<HandoverDocument>) => void;
}

export const EditMetaModal: React.FC<EditMetaModalProps> = ({
  isOpen,
  onClose,
  document,
  onSave,
}) => {
  const [title, setTitle] = useState(document.title);
  const [department, setDepartment] = useState(document.department);
  const [reason, setReason] = useState<HandoverReason>(document.reason);
  const [startDate, setStartDate] = useState(document.startDate);
  const [targetDate, setTargetDate] = useState(document.targetDate);
  const [summary, setSummary] = useState(document.summary);

  // Handover Person
  const [hpName, setHpName] = useState(document.handoverPerson.name);
  const [hpRole, setHpRole] = useState(document.handoverPerson.role);
  const [hpEmail, setHpEmail] = useState(document.handoverPerson.email);
  const [hpPhone, setHpPhone] = useState(document.handoverPerson.phone);

  // Takeover Person
  const [tpName, setTpName] = useState(document.takeoverPerson.name);
  const [tpRole, setTpRole] = useState(document.takeoverPerson.role);
  const [tpEmail, setTpEmail] = useState(document.takeoverPerson.email);
  const [tpPhone, setTpPhone] = useState(document.takeoverPerson.phone);

  // Supervisor
  const [spName, setSpName] = useState(document.supervisor.name);
  const [spRole, setSpRole] = useState(document.supervisor.role);
  const [spEmail, setSpEmail] = useState(document.supervisor.email);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      department,
      reason,
      startDate,
      targetDate,
      summary,
      handoverPerson: {
        ...document.handoverPerson,
        name: hpName,
        role: hpRole,
        email: hpEmail,
        phone: hpPhone,
      },
      takeoverPerson: {
        ...document.takeoverPerson,
        name: tpName,
        role: tpRole,
        email: tpEmail,
        phone: tpPhone,
      },
      supervisor: {
        ...document.supervisor,
        name: spName,
        role: spRole,
        email: spEmail,
      },
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-lg">기본 정보 및 인원 수정</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Document Info */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs">문서 기본 정보</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">인수인계서 제목</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">소속 부서/팀</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">인계 사유</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as HandoverReason)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                >
                  <option value="퇴사 (이직/진로변경)">퇴사 (이직/진로변경)</option>
                  <option value="부서 이동 / 직무 전환">부서 이동 / 직무 전환</option>
                  <option value="육아 / 출산 휴직">육아 / 출산 휴직</option>
                  <option value="장기 병가 / 안식휴가">장기 병가 / 안식휴가</option>
                  <option value="프로젝트 종료 / 파견 복귀">프로젝트 종료 / 파견 복귀</option>
                  <option value="기타 사유">기타 사유</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">인수인계 시작일</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">완료 목표일</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">인계 개요 요약</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Handover Person (전임자) */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-indigo-700 text-xs">인계자 (전임자) 정보</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">성명</label>
                <input
                  type="text"
                  required
                  value={hpName}
                  onChange={(e) => setHpName(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">직책 / 직급</label>
                <input
                  type="text"
                  required
                  value={hpRole}
                  onChange={(e) => setHpRole(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={hpEmail}
                  onChange={(e) => setHpEmail(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={hpPhone}
                  onChange={(e) => setHpPhone(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Takeover Person (후임자) */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-emerald-700 text-xs">인수자 (후임자) 정보</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">성명</label>
                <input
                  type="text"
                  required
                  value={tpName}
                  onChange={(e) => setTpName(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">직책 / 직급</label>
                <input
                  type="text"
                  required
                  value={tpRole}
                  onChange={(e) => setTpRole(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={tpEmail}
                  onChange={(e) => setTpEmail(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={tpPhone}
                  onChange={(e) => setTpPhone(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Supervisor (확인자) */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-amber-700 text-xs">확인자 (부서장/팀장) 정보</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">성명</label>
                <input
                  type="text"
                  required
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">직책</label>
                <input
                  type="text"
                  required
                  value={spRole}
                  onChange={(e) => setSpRole(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={spEmail}
                  onChange={(e) => setSpEmail(e.target.value)}
                  className="w-full p-2 rounded-md border border-slate-300 bg-white"
                />
              </div>
            </div>
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
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
