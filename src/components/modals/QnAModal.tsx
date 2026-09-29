import React, { useState } from 'react';
import { QnAItem } from '../../types/handover';

interface QnAModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAsker: string;
  onSave: (item: QnAItem) => void;
}

export const QnAModal: React.FC<QnAModalProps> = ({
  isOpen,
  onClose,
  defaultAsker,
  onSave,
}) => {
  const [asker, setAsker] = useState(defaultAsker);
  const [question, setQuestion] = useState('');
  const [initialAnswer, setInitialAnswer] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: QnAItem = {
      id: `qna-${Date.now()}`,
      asker: asker.trim() || '인수자',
      question: question.trim(),
      answer: initialAnswer.trim() || undefined,
      isResolved: !!initialAnswer.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      answeredAt: initialAnswer.trim() ? new Date().toISOString().slice(0, 10) : undefined,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            새 인계 질문 (Q&A) 등록
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
            <label className="block font-semibold text-slate-700 mb-1">질문자</label>
            <input
              type="text"
              required
              value={asker}
              onChange={(e) => setAsker(e.target.value)}
              placeholder="예: 이수진 (후임)"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">질문 내용</label>
            <textarea
              rows={3}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 정산 오류가 발생했을 때 수동으로 재실행하는 Jenkins 파이프라인이 어디에 있나요?"
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              답변 (이미 알고 있는 답변이 있거나 바로 작성할 경우 입력)
            </label>
            <textarea
              rows={2}
              value={initialAnswer}
              onChange={(e) => setInitialAnswer(e.target.value)}
              placeholder="전임자 답변 (선택사항, 나중에 등록 가능)"
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
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
