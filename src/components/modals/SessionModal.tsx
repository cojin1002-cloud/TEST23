import React, { useState, useEffect } from 'react';
import { HandoverSession } from '../../types/handover';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: HandoverSession | null;
  onSave: (session: HandoverSession) => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  session,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('1시간');
  const [attendees, setAttendees] = useState('');
  const [status, setStatus] = useState<'scheduled' | 'completed'>('scheduled');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (session) {
      setDate(session.date);
      setTopic(session.topic);
      setDuration(session.duration);
      setAttendees(session.attendees);
      setStatus(session.status);
      setNotes(session.notes);
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setTopic('');
      setDuration('1시간');
      setAttendees('');
      setStatus('scheduled');
      setNotes('');
    }
  }, [session, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: HandoverSession = {
      id: session?.id || `sess-${Date.now()}`,
      date,
      topic,
      duration,
      attendees,
      status,
      notes,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {session ? '인수인계 미팅 일정 수정' : '새 인수인계 미팅 일정 등록'}
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
            <label className="block font-semibold text-slate-700 mb-1">미팅 / 세션 주제</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 클라우드 인프라 구조 워크스루 및 2FA 기기 전달"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">일자</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">예상 시간</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="예: 1시간 30분"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">참석자</label>
              <input
                type="text"
                required
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="예: 김태완, 이수진"
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">진행 상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2 rounded-md border border-slate-300 bg-white"
              >
                <option value="scheduled">예정됨 (Scheduled)</option>
                <option value="completed">진행 완료 (Completed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">세션 메모 / 회의록</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="미팅에서 논의된 주요 내용, 후임자 전달 사항 등을 메모하세요."
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
