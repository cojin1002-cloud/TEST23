import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  ShieldCheck, 
  Award, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { HandoverDocument, HandoverSignOff, SignatureEntry } from '../../types/handover';
import { calculateProgress } from '../../utils/storage';

interface SignOffTabProps {
  document: HandoverDocument;
  onUpdateSignOff: (signOff: HandoverSignOff) => void;
  onOpenPrint: () => void;
}

export const SignOffTab: React.FC<SignOffTabProps> = ({
  document,
  onUpdateSignOff,
  onOpenPrint,
}) => {
  const progress = calculateProgress(document);
  const [activeSigner, setActiveSigner] = useState<'handedOverBy' | 'takenOverBy' | 'approvedBy' | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas when signer modal/box is active
  useEffect(() => {
    if (activeSigner && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e1b4b'; // deep indigo ink
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    }
  }, [activeSigner]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const handleOpenSignModal = (roleKey: 'handedOverBy' | 'takenOverBy' | 'approvedBy') => {
    setActiveSigner(roleKey);
    setCommentDraft(document.signOff[roleKey]?.comment || '');
  };

  const handleSaveSignature = () => {
    if (!activeSigner) return;
    const canvas = canvasRef.current;
    let dataUrl: string | undefined = undefined;

    if (canvas && hasDrawn) {
      dataUrl = canvas.toDataURL('image/png');
    }

    const currentEntry = document.signOff[activeSigner];
    const updatedEntry: SignatureEntry = {
      ...currentEntry,
      signed: true,
      signatureDataUrl: dataUrl || currentEntry?.signatureDataUrl,
      signedAt: new Date().toISOString().slice(0, 10),
      comment: commentDraft,
    };

    const newSignOff: HandoverSignOff = {
      ...document.signOff,
      [activeSigner]: updatedEntry,
    };

    // If all 3 signed, set completionDate
    if (
      newSignOff.handedOverBy.signed &&
      newSignOff.takenOverBy.signed &&
      newSignOff.approvedBy.signed
    ) {
      newSignOff.completionDate = new Date().toISOString().slice(0, 10);
    }

    onUpdateSignOff(newSignOff);
    setActiveSigner(null);
  };

  const handleResetSignature = (roleKey: 'handedOverBy' | 'takenOverBy' | 'approvedBy') => {
    if (confirm('해당 서명을 초기화하시겠습니까?')) {
      const newSignOff: HandoverSignOff = {
        ...document.signOff,
        [roleKey]: {
          ...document.signOff[roleKey],
          signed: false,
          signatureDataUrl: undefined,
          signedAt: undefined,
        },
        completionDate: undefined,
      };
      onUpdateSignOff(newSignOff);
    }
  };

  const isAllSigned = 
    document.signOff.handedOverBy?.signed && 
    document.signOff.takenOverBy?.signed && 
    document.signOff.approvedBy?.signed;

  const signers = [
    {
      key: 'handedOverBy' as const,
      roleTitle: '인계자 (전임자)',
      defaultName: document.handoverPerson.name,
      subTitle: document.handoverPerson.role,
      entry: document.signOff.handedOverBy,
      guide: '본인은 담당 직무의 루틴 업무, 계정 권한, 현안 과제 및 비상 대응 절차를 성실히 인계하였음을 확인합니다.',
    },
    {
      key: 'takenOverBy' as const,
      roleTitle: '인수자 (후임자)',
      defaultName: document.takeoverPerson.name,
      subTitle: document.takeoverPerson.role,
      entry: document.signOff.takenOverBy,
      guide: '본인은 위 인수인계 내역을 확인 및 실습하였으며 향후 단독으로 업무를 수행할 준비를 마쳤음을 확인합니다.',
    },
    {
      key: 'approvedBy' as const,
      roleTitle: '확인자 (부서장 / 팀장)',
      defaultName: document.supervisor.name,
      subTitle: document.supervisor.role,
      entry: document.signOff.approvedBy,
      guide: '부서장으로서 인계자와 인수자 간의 업무 인수인계가 원활하게 완료되었음을 최종 승인합니다.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>최종 인수인계 확인 및 전자 서명</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            인계자, 인수자, 부서장 3자 상호 서명을 통해 인수인계 효력을 완료하고 공식 증서를 발급합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>공식 인수인계서 인쇄 / PDF</span>
        </button>
      </div>

      {/* Completion Banner */}
      {isAllSigned ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">
                인수인계 3자 서명이 모두 완료되었습니다!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                완료일자: {document.signOff.completionDate || new Date().toISOString().slice(0, 10)} · 상단의 [공식 인수인계서 인쇄 / PDF] 버튼으로 출력하거나 보관하세요.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            모든 정기 업무와 계정 권한이 정상 이전되었는지 검토한 후 각 서명란의 [서명하기]를 클릭하여 전자 서명을 진행하세요.
          </p>
        </div>
      )}

      {/* 3-Party Signature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {signers.map(({ key, roleTitle, defaultName, subTitle, entry, guide }) => {
          const isSigned = !!entry?.signed;

          return (
            <div
              key={key}
              className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isSigned ? 'border-emerald-300 ring-1 ring-emerald-200 shadow-xs' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">{roleTitle}</span>
                  {isSigned ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 서명 완료
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">서명 대기</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {entry?.name || defaultName}
                  </h3>
                  <p className="text-xs text-slate-500">{entry?.role || subTitle}</p>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                  {guide}
                </p>

                {/* Signature Box Display */}
                <div className="h-28 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden">
                  {isSigned && entry?.signatureDataUrl ? (
                    <img
                      src={entry.signatureDataUrl}
                      alt={`${roleTitle} 서명`}
                      className="max-h-24 max-w-full object-contain p-2"
                    />
                  ) : isSigned ? (
                    <div className="text-center text-emerald-700 font-bold text-sm">
                      <FileCheck className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      <span>[전자 서명 날인 완료]</span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 text-xs">
                      <PenTool className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                      <span>서명이 등록되지 않았습니다</span>
                    </div>
                  )}

                  {isSigned && entry?.signedAt && (
                    <div className="absolute bottom-1 right-2 text-[10px] text-slate-500 font-mono">
                      서명일: {entry.signedAt}
                    </div>
                  )}
                </div>

                {entry?.comment && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2 rounded border border-amber-100">
                    "{entry.comment}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                {isSigned ? (
                  <button
                    type="button"
                    onClick={() => handleResetSignature(key)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" /> 서명 재작성
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenSignModal(key)}
                    className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>서명하기</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Signature Pad Modal */}
      {activeSigner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-600" />
                <span>
                  {activeSigner === 'handedOverBy'
                    ? '인계자 전자 서명'
                    : activeSigner === 'takenOverBy'
                    ? '인수자 전자 서명'
                    : '확인자 (부서장) 전자 서명'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveSigner(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                서명 패드 (마우스 또는 터치로 서명하세요)
              </label>
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50 relative">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 bg-white cursor-crosshair touch-none"
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> 지우기
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * 캔버스에 직접 서명하지 않아도 [서명 완료] 클릭 시 공식 인증 날인 처리됩니다.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                확인 의견 / 소감 (선택사항)
              </label>
              <input
                type="text"
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="예: 주요 업무 및 배포 프로세스 숙지 완료하였습니다."
                className="w-full text-xs p-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSigner(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveSignature}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>서명 완료하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
