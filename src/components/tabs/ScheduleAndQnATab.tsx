import React, { useState } from 'react';
import { 
  CalendarClock, 
  HelpCircle, 
  Plus, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  User, 
  Clock, 
  Check
} from 'lucide-react';
import { HandoverSession, QnAItem } from '../../types/handover';

interface ScheduleAndQnATabProps {
  sessions: HandoverSession[];
  qnaItems: QnAItem[];
  onUpdateSessions: (sessions: HandoverSession[]) => void;
  onUpdateQnA: (items: QnAItem[]) => void;
  onOpenAddSession: () => void;
  onOpenEditSession: (session: HandoverSession) => void;
  onOpenAddQnA: () => void;
}

export const ScheduleAndQnATab: React.FC<ScheduleAndQnATabProps> = ({
  sessions,
  qnaItems,
  onUpdateSessions,
  onUpdateQnA,
  onOpenAddSession,
  onOpenEditSession,
  onOpenAddQnA,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sessions' | 'qna'>('sessions');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');

  const toggleSessionStatus = (id: string) => {
    const updated = sessions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'completed' ? ('scheduled' as const) : ('completed' as const),
        };
      }
      return s;
    });
    onUpdateSessions(updated);
  };

  const deleteSession = (id: string) => {
    if (confirm('이 인수인계 미팅 일정을 삭제하시겠습니까?')) {
      onUpdateSessions(sessions.filter((s) => s.id !== id));
    }
  };

  const handleStartAnswer = (qna: QnAItem) => {
    setEditingAnswerId(qna.id);
    setAnswerDraft(qna.answer || '');
  };

  const handleSaveAnswer = (id: string) => {
    const updated = qnaItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          answer: answerDraft,
          isResolved: !!answerDraft.trim(),
          answeredAt: new Date().toISOString().slice(0, 10),
        };
      }
      return item;
    });
    onUpdateQnA(updated);
    setEditingAnswerId(null);
    setAnswerDraft('');
  };

  const deleteQnA = (id: string) => {
    if (confirm('이 질의응답 항목을 삭제하시겠습니까?')) {
      onUpdateQnA(qnaItems.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Segmented Switcher */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('sessions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'sessions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>인수인계 미팅 일정 ({sessions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('qna')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'qna'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>인계 질의응답 (Q&A) ({qnaItems.length})</span>
          </button>
        </div>

        {activeSubTab === 'sessions' ? (
          <button
            type="button"
            onClick={onOpenAddSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>미팅 일정 등록</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAddQnA}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>질문 등록하기</span>
          </button>
        )}
      </div>

      {/* SESSIONS SUBTAB */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
              예정된 인수인계 미팅이 없습니다. [+ 미팅 일정 등록]으로 1:1 핸드오버 일정을 계획하세요.
            </div>
          ) : (
            sessions.map((session, idx) => {
              const isDone = session.status === 'completed';

              return (
                <div
                  key={session.id}
                  className={`bg-white rounded-xl border transition-all ${
                    isDone ? 'border-slate-200/80 bg-slate-50/50' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleSessionStatus(session.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                          title={isDone ? '미완료로 변경' : '완료로 표시'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                          )}
                        </button>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-indigo-600">세션 #{idx + 1}</span>
                            <span aria-hidden="true">·</span>
                            <span>{session.date}</span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {session.duration}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>참석: {session.attendees}</span>
                            <span aria-hidden="true">·</span>
                            <span className={isDone ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                              {isDone ? '진행 완료' : '예정됨'}
                            </span>
                          </div>

                          <h3 className={`text-sm sm:text-base font-bold text-slate-900 ${isDone ? 'text-slate-600' : ''}`}>
                            {session.topic}
                          </h3>

                          {session.notes && (
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line">
                              {session.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => onOpenEditSession(session)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSession(session.id)}
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
            })
          )}
        </div>
      )}

      {/* Q&A SUBTAB */}
      {activeSubTab === 'qna' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              인수자(후임)가 업무 중 궁금하거나 모호한 사항을 질문으로 남기면, 인계자(전임)가 공식 답변을 기록하여 지식 베이스로 누적 보관합니다.
            </p>
          </div>

          {qnaItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
              등록된 질문이 없습니다. 궁금한 업무 사항을 자유롭게 등록해보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {qnaItems.map((qna) => (
                <div
                  key={qna.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-indigo-600">Q. 질문</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <User className="w-3 h-3 text-slate-400" />
                          {qna.asker}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{qna.createdAt}</span>
                        <span aria-hidden="true">·</span>
                        <span className={qna.isResolved ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                          {qna.isResolved ? '답변 완료' : '답변 대기'}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        {qna.question}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => deleteQnA(qna.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Predecessor Answer Area */}
                  {editingAnswerId === qna.id ? (
                    <div className="mt-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="text-xs font-semibold text-slate-700 block">
                        A. 인계자 답변 작성
                      </label>
                      <textarea
                        rows={3}
                        value={answerDraft}
                        onChange={(e) => setAnswerDraft(e.target.value)}
                        placeholder="상세한 조치 방법이나 히스토리를 작성하세요..."
                        className="w-full text-xs p-2.5 rounded-md border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAnswerId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAnswer(qna.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                        >
                          답변 저장
                        </button>
                      </div>
                    </div>
                  ) : qna.answer ? (
                    <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-indigo-950 font-semibold">
                        <span>A. 인계자 공식 답변</span>
                        {qna.answeredAt && (
                          <span className="text-[11px] text-slate-500 font-normal">
                            답변일: {qna.answeredAt}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-slate-700">
                        {qna.answer}
                      </p>
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleStartAnswer(qna)}
                          className="text-[11px] text-indigo-600 hover:underline"
                        >
                          답변 수정
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartAnswer(qna)}
                      className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-lg text-xs text-indigo-600 hover:bg-indigo-50/50 font-medium transition-colors"
                    >
                      + 인계자 답변 등록하기
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
