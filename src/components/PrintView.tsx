import React from 'react';
import { Printer, ArrowLeft, Download, Check } from 'lucide-react';
import { HandoverDocument } from '../types/handover';
import { calculateProgress } from '../utils/storage';

interface PrintViewProps {
  document: HandoverDocument;
  onClose: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({ document, onClose }) => {
  const progress = calculateProgress(document);

  const handlePrint = () => {
    window.print();
  };

  const cycleText = (c: string) => {
    switch (c) {
      case 'daily': return '일간';
      case 'weekly': return '주간';
      case 'monthly': return '월간';
      case 'quarterly': return '분기';
      case 'yearly': return '연간';
      default: return '수시';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      {/* Top Floating Control Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>편집 화면으로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">A4 용지 규격 최적화 양식</span>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄 / PDF로 저장</span>
          </button>
        </div>
      </div>

      {/* Official Korean Corporate Document Sheet (A4 ratio) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-md border border-slate-300 print:border-none print:shadow-none print:p-0 print:max-w-none text-slate-900 font-sans">
        
        {/* Document Header & Approval Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-950 uppercase">
              업 무 인 수 인 계 서
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              문서번호: HD-{document.id.slice(-6).toUpperCase()} · 작성일자: {document.createdAt.slice(0, 10)}
            </p>
          </div>

          {/* Corporate Approval Stamp Box */}
          <div className="border border-slate-800 text-center text-xs self-end sm:self-auto">
            <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-50 text-[11px] font-semibold border-b border-slate-800 py-1">
              <div className="px-3">인 계 자</div>
              <div className="px-3">인 수 자</div>
              <div className="px-3">부 서 장</div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-800 h-16 items-center">
              <div className="px-2 flex items-center justify-center">
                {document.signOff.handedOverBy?.signatureDataUrl ? (
                  <img
                    src={document.signOff.handedOverBy.signatureDataUrl}
                    alt="인계자 서명"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {document.signOff.handedOverBy?.signed ? '(인)' : '미서명'}
                  </span>
                )}
              </div>
              <div className="px-2 flex items-center justify-center">
                {document.signOff.takenOverBy?.signatureDataUrl ? (
                  <img
                    src={document.signOff.takenOverBy.signatureDataUrl}
                    alt="인수자 서명"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {document.signOff.takenOverBy?.signed ? '(인)' : '미서명'}
                  </span>
                )}
              </div>
              <div className="px-2 flex items-center justify-center">
                {document.signOff.approvedBy?.signatureDataUrl ? (
                  <img
                    src={document.signOff.approvedBy.signatureDataUrl}
                    alt="승인자 서명"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {document.signOff.approvedBy?.signed ? '(인)' : '미서명'}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-800 text-[10px] text-slate-600 border-t border-slate-800 py-0.5 bg-slate-50">
              <div>{document.handoverPerson.name}</div>
              <div>{document.takeoverPerson.name}</div>
              <div>{document.supervisor.name}</div>
            </div>
          </div>
        </div>

        {/* Section 1: 기본 인적사항 및 개요 */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-800 pl-2 mb-2 uppercase">
            1. 기본 인적사항 및 인수인계 개요
          </h2>
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <tbody>
              <tr className="border-b border-slate-300">
                <th className="w-24 bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">문 서 제 목</th>
                <td className="p-2 font-medium" colSpan={3}>{document.title}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">소 속 부 서</th>
                <td className="p-2 border-r border-slate-300">{document.department}</td>
                <th className="w-24 bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">인 계 사 유</th>
                <td className="p-2">{document.reason}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">인수인계 기간</th>
                <td className="p-2" colSpan={3}>
                  {document.startDate} ~ {document.targetDate} (달성률: {progress.overallPercentage}%)
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">인계자 (전임)</th>
                <td className="p-2 border-r border-slate-300">
                  {document.handoverPerson.name} ({document.handoverPerson.role} / {document.handoverPerson.phone})
                </td>
                <th className="bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">인수자 (후임)</th>
                <td className="p-2">
                  {document.takeoverPerson.name} ({document.takeoverPerson.role} / {document.takeoverPerson.phone})
                </td>
              </tr>
              <tr>
                <th className="bg-slate-100 p-2 text-left font-semibold border-r border-slate-300">인계 총괄 요약</th>
                <td className="p-2 text-slate-700 leading-relaxed" colSpan={3}>
                  {document.summary || '상기 업무 전반에 대한 절차 및 권한을 성실히 인수인계함.'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 2: 정기 및 반복 업무 */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-800 pl-2 mb-2 uppercase">
            2. 정기 / 반복 담당 업무 인계 내역
          </h2>
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="p-1.5 w-12 text-center border-r border-slate-300">주기</th>
                <th className="p-1.5 w-44 text-left border-r border-slate-300">업무명</th>
                <th className="p-1.5 text-left border-r border-slate-300">수행 절차 및 노하우/주의사항</th>
                <th className="p-1.5 w-24 text-center border-r border-slate-300">사용 시스템</th>
                <th className="p-1.5 w-16 text-center">인계여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {document.routineTasks.map((task) => (
                <tr key={task.id} className="text-[11px]">
                  <td className="p-1.5 text-center font-medium border-r border-slate-200">
                    {cycleText(task.cycle)}
                  </td>
                  <td className="p-1.5 font-bold border-r border-slate-200">
                    {task.title}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-slate-700 leading-relaxed">
                    <div>{task.description}</div>
                    {task.keyTips && (
                      <div className="text-[10px] text-amber-900 mt-1 font-medium">
                        * 주의/Tip: {task.keyTips}
                      </div>
                    )}
                  </td>
                  <td className="p-1.5 text-center text-slate-600 border-r border-slate-200">
                    {task.toolOrSystem}
                  </td>
                  <td className="p-1.5 text-center font-bold">
                    {task.isHandedOver ? '완료' : '진행중'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section 3: 진행 프로젝트 */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-800 pl-2 mb-2 uppercase">
            3. 진행 중인 주요 과제 및 프로젝트 현황
          </h2>
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="p-1.5 w-44 text-left border-r border-slate-300">프로젝트명</th>
                <th className="p-1.5 w-16 text-center border-r border-slate-300">진척도</th>
                <th className="p-1.5 text-left border-r border-slate-300">내용 및 후속 조치 필요사항</th>
                <th className="p-1.5 w-32 text-left border-r border-slate-300">협업자</th>
                <th className="p-1.5 w-16 text-center">인계여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {document.activeProjects.map((p) => (
                <tr key={p.id} className="text-[11px]">
                  <td className="p-1.5 font-bold border-r border-slate-200">{p.title}</td>
                  <td className="p-1.5 text-center font-semibold border-r border-slate-200">{p.progress}%</td>
                  <td className="p-1.5 border-r border-slate-200 leading-relaxed text-slate-700">
                    <div>{p.description}</div>
                    {p.nextActions && (
                      <div className="text-[10px] text-indigo-900 mt-0.5">
                        - 차기계획: {p.nextActions}
                      </div>
                    )}
                  </td>
                  <td className="p-1.5 text-slate-600 border-r border-slate-200">{p.collaborators || '-'}</td>
                  <td className="p-1.5 text-center font-bold">{p.isHandedOver ? '완료' : '진행중'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section 4: 계정 및 권한 이관 */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-800 pl-2 mb-2 uppercase">
            4. 시스템 계정 및 접근 권한 이관 현황
          </h2>
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="p-1.5 text-left border-r border-slate-300">시스템/서비스명</th>
                <th className="p-1.5 w-20 text-center border-r border-slate-300">권한 구분</th>
                <th className="p-1.5 w-44 text-left border-r border-slate-300">계정 식별자</th>
                <th className="p-1.5 w-20 text-center border-r border-slate-300">2FA/OTP</th>
                <th className="p-1.5 w-24 text-center border-r border-slate-300">이관 상태</th>
                <th className="p-1.5 text-left">특이사항/이전 조치</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {document.accountAccesses.map((a) => (
                <tr key={a.id} className="text-[11px]">
                  <td className="p-1.5 font-bold border-r border-slate-200">{a.systemName}</td>
                  <td className="p-1.5 text-center border-r border-slate-200">{a.roleType}</td>
                  <td className="p-1.5 font-mono text-[10px] border-r border-slate-200">{a.accountIdentifier}</td>
                  <td className="p-1.5 text-center border-r border-slate-200">{a.has2FA ? '해당' : '-'}</td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-200">
                    {a.status === 'transferred' ? '이관완료' : a.status === 'revoked' ? '회수완료' : '진행중'}
                  </td>
                  <td className="p-1.5 text-slate-600">{a.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section 5: 비상 상황 대응 매뉴얼 (SOP) */}
        {document.emergencySOPs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 border-l-4 border-slate-800 pl-2 mb-2 uppercase">
              5. 장애 및 비상 상황 대응 절차 (SOP)
            </h2>
            <div className="space-y-2">
              {document.emergencySOPs.map((sop, idx) => (
                <div key={sop.id} className="border border-slate-300 rounded p-2.5 text-xs">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>시나리오 #{idx + 1}: {sop.scenario}</span>
                    <span className="text-[10px] font-mono text-slate-500">[{sop.urgency.toUpperCase()}]</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-0.5 pl-2">
                    {sop.actionSteps.map((step, sIdx) => (
                      <div key={sIdx}>- {step}</div>
                    ))}
                  </div>
                  {sop.escalationContact && (
                    <div className="text-[10px] text-slate-500 mt-1.5 border-t border-slate-200 pt-1">
                      비상 에스컬레이션: {sop.escalationContact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: 서약 및 3자 서명 날인문 */}
        <section className="mt-8 pt-6 border-t-2 border-slate-900">
          <p className="text-xs text-center text-slate-800 font-medium leading-relaxed mb-6">
            상기 본인들은 상기 기재된 모든 업무 절차, 시스템 권한, 진행 과제 및 관련 자료 일체를 성실히 인수인계하였으며,<br />
            인수자는 단독 업무 수행에 차질이 없도록 숙지하였음을 확인하고 이에 상호 연명으로 날인합니다.
          </p>

          <div className="text-center font-bold text-xs text-slate-900 mb-6">
            {document.signOff.completionDate || new Date().toISOString().slice(0, 10).replace(/-/g, '년 ') + '일'}
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-xs">
            {/* Handover */}
            <div className="text-center space-y-2">
              <div className="text-slate-500 text-[11px]">인 계 자 (전임)</div>
              <div className="font-bold text-slate-900">{document.handoverPerson.name}</div>
              <div className="h-16 border border-dashed border-slate-400 rounded flex items-center justify-center p-1 bg-slate-50/50">
                {document.signOff.handedOverBy?.signatureDataUrl ? (
                  <img
                    src={document.signOff.handedOverBy.signatureDataUrl}
                    alt="서명"
                    className="max-h-14 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-slate-400 text-[11px]">(인 또는 서명)</span>
                )}
              </div>
            </div>

            {/* Takeover */}
            <div className="text-center space-y-2">
              <div className="text-slate-500 text-[11px]">인 수 자 (후임)</div>
              <div className="font-bold text-slate-900">{document.takeoverPerson.name}</div>
              <div className="h-16 border border-dashed border-slate-400 rounded flex items-center justify-center p-1 bg-slate-50/50">
                {document.signOff.takenOverBy?.signatureDataUrl ? (
                  <img
                    src={document.signOff.takenOverBy.signatureDataUrl}
                    alt="서명"
                    className="max-h-14 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-slate-400 text-[11px]">(인 또는 서명)</span>
                )}
              </div>
            </div>

            {/* Supervisor */}
            <div className="text-center space-y-2">
              <div className="text-slate-500 text-[11px]">부 서 장 (확인)</div>
              <div className="font-bold text-slate-900">{document.supervisor.name}</div>
              <div className="h-16 border border-dashed border-slate-400 rounded flex items-center justify-center p-1 bg-slate-50/50">
                {document.signOff.approvedBy?.signatureDataUrl ? (
                  <img
                    src={document.signOff.approvedBy.signatureDataUrl}
                    alt="서명"
                    className="max-h-14 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-slate-400 text-[11px]">(인 또는 서명)</span>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
