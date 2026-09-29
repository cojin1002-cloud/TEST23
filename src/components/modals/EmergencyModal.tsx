import React, { useState, useEffect } from 'react';
import { EmergencySOP } from '../../types/handover';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  sop?: EmergencySOP | null;
  onSave: (sop: EmergencySOP) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  sop,
  onSave,
}) => {
  const [scenario, setScenario] = useState('');
  const [urgency, setUrgency] = useState<EmergencySOP['urgency']>('critical');
  const [stepsText, setStepsText] = useState('');
  const [escalationContact, setEscalationContact] = useState('');
  const [lastTestedDate, setLastTestedDate] = useState('');

  useEffect(() => {
    if (sop) {
      setScenario(sop.scenario);
      setUrgency(sop.urgency);
      setStepsText(sop.actionSteps.join('\n'));
      setEscalationContact(sop.escalationContact);
      setLastTestedDate(sop.lastTestedDate || '');
    } else {
      setScenario('');
      setUrgency('critical');
      setStepsText('1. 인시던트 발생 감지 즉시 슬랙 비상 채널에 현황 공지\n2. 관리자 콘솔에서 임시 트래픽 우회 실행\n3. 관련 부서 및 팀장에 1차 상황 공유');
      setEscalationContact('');
      setLastTestedDate('');
    }
  }, [sop, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actionSteps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const item: EmergencySOP = {
      id: sop?.id || `sop-${Date.now()}`,
      scenario,
      urgency,
      actionSteps,
      escalationContact,
      lastTestedDate: lastTestedDate.trim() || undefined,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {sop ? '비상 대응 SOP 수정' : '새 비상 대응 SOP 등록'}
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
            <label className="block font-semibold text-slate-700 mb-1">인시던트 / 장애 시나리오</label>
            <input
              type="text"
              required
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="예: 결제 게이트웨이 타임아웃 급증 또는 메인 서버 다운 시"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">심각도 / 긴급성</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white font-semibold"
              >
                <option value="critical">긴급 (CRITICAL) - 서비스 중단 위험</option>
                <option value="high">중요 (HIGH) - 주요 기능 오류</option>
                <option value="medium">보통 (MEDIUM) - 부분적 지연</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">최근 테스트/훈련일</label>
              <input
                type="date"
                value={lastTestedDate}
                onChange={(e) => setLastTestedDate(e.target.value)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              단계별 표준 조치 절차 (한 줄에 한 단계씩 작성)
            </label>
            <textarea
              rows={4}
              required
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder="1. 상태 모니터링 확인&#10;2. 백업 시스템 전환&#10;3. 공지문 배포"
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">비상 연락망 및 보고 체계</label>
            <input
              type="text"
              required
              value={escalationContact}
              onChange={(e) => setEscalationContact(e.target.value)}
              placeholder="예: 테크리드(010-0000-0000), CS팀장 슬랙 채널 #incident"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
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
