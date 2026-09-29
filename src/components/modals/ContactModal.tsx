import React, { useState, useEffect } from 'react';
import { ContactStakeholder } from '../../types/handover';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ContactStakeholder | null;
  onSave: (contact: ContactStakeholder) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSave,
}) => {
  const [category, setCategory] = useState<ContactStakeholder['category']>('내부 협업 부서');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [frequency, setFrequency] = useState('');
  const [relationshipNotes, setRelationshipNotes] = useState('');

  useEffect(() => {
    if (contact) {
      setCategory(contact.category);
      setName(contact.name);
      setOrganization(contact.organization);
      setRole(contact.role);
      setContactInfo(contact.contact);
      setFrequency(contact.frequency);
      setRelationshipNotes(contact.relationshipNotes);
    } else {
      setCategory('내부 협업 부서');
      setName('');
      setOrganization('');
      setRole('');
      setContactInfo('');
      setFrequency('수시');
      setRelationshipNotes('');
    }
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ContactStakeholder = {
      id: contact?.id || `ct-${Date.now()}`,
      category,
      name,
      organization,
      role,
      contact: contactInfo,
      frequency,
      relationshipNotes,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {contact ? '담당자 연락망 수정' : '새 담당자 연락망 추가'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">소속 분류</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="내부 협업 부서">내부 협업 부서</option>
                <option value="고객사">고객사</option>
                <option value="외주/협력사">외주/협력사</option>
                <option value="대행사/파트너">대행사/파트너</option>
                <option value="시스템 벤더">시스템 벤더</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">소통 주기</label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="예: 매주 월요일, 수시, 월 1회"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">성명</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">회사 / 팀</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="재무회계팀 또는 메가존"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">직책 / 역할</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="결제 정산 담당 / 매니저"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">연락처 / 슬랙</label>
              <input
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="010-0000-0000 / @slack"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">협업 팁 & 소통 시 유의사항</label>
            <textarea
              rows={2}
              value={relationshipNotes}
              onChange={(e) => setRelationshipNotes(e.target.value)}
              placeholder="예: 전화 통화보다 이메일/슬랙 선호, 매월 20일 이전 정산 요청 필수"
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
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
