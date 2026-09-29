import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Printer, 
  Download, 
  Upload, 
  ChevronDown, 
  FileCode, 
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { HandoverDocument } from '../types/handover';
import { generateMarkdownExport, downloadFile } from '../utils/storage';

interface HeaderProps {
  documents: HandoverDocument[];
  activeDoc: HandoverDocument;
  onSelectDoc: (id: string) => void;
  onOpenNewDocModal: () => void;
  onOpenPrint: () => void;
  onImportJson: (doc: HandoverDocument) => void;
  onDeleteDoc: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  documents,
  activeDoc,
  onSelectDoc,
  onOpenNewDocModal,
  onOpenPrint,
  onImportJson,
  onDeleteDoc,
}) => {
  const [showDocMenu, setShowDocMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportMarkdown = () => {
    const md = generateMarkdownExport(activeDoc);
    const filename = `${activeDoc.title.replace(/\s+/g, '_')}_인수인계서.md`;
    downloadFile(md, filename, 'text/markdown;charset=utf-8');
    setShowExportMenu(false);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(activeDoc, null, 2);
    const filename = `${activeDoc.title.replace(/\s+/g, '_')}_backup.json`;
    downloadFile(jsonStr, filename, 'application/json');
    setShowExportMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.id && parsed.title && parsed.handoverPerson) {
          onImportJson(parsed);
          alert(`'${parsed.title}' 문서를 성공적으로 불러왔습니다.`);
        } else {
          alert('올바른 인수인계서 JSON 백업 파일이 아닙니다.');
        }
      } catch (err) {
        alert('파일을 파싱하는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Document Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
                  인수인계 프로
                  <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-slate-600">스마트 업무 인수인계 솔루션</p>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* Document Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDocMenu(!showDocMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors max-w-[260px] truncate"
              >
                <span className="truncate">{activeDoc.title}</span>
                <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />
              </button>

              {showDocMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDocMenu(false)}
                  />
                  <div className="absolute left-0 mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-sm">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                      <span>내 인수인계 문서 ({documents.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDocMenu(false);
                          onOpenNewDocModal();
                        }}
                        className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5 text-xs"
                      >
                        <Plus className="w-3 h-3" /> 새로 작성
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {documents.map((doc) => {
                        const isCurrent = doc.id === activeDoc.id;
                        return (
                          <div
                            key={doc.id}
                            className={`flex items-center justify-between px-3 py-2 hover:bg-slate-50 cursor-pointer ${
                              isCurrent ? 'bg-indigo-50/60 font-medium text-indigo-900' : 'text-slate-700'
                            }`}
                            onClick={() => {
                              onSelectDoc(doc.id);
                              setShowDocMenu(false);
                            }}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="truncate text-xs font-semibold">{doc.title}</p>
                              <p className="text-[11px] text-slate-600 truncate">
                                {doc.handoverPerson.name} → {doc.takeoverPerson.name} · {doc.department}
                              </p>
                            </div>
                            {documents.length > 1 && (
                              <button
                                type="button"
                                title="문서 삭제"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`'${doc.title}' 인수인계서를 삭제하시겠습니까?`)) {
                                    onDeleteDoc(doc.id);
                                  }
                                }}
                                className="text-slate-600 hover:text-rose-600 p-1 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* New Document Button */}
            <button
              type="button"
              onClick={onOpenNewDocModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>새 문서</span>
            </button>

            {/* Print / Official Document View Button */}
            <button
              type="button"
              onClick={onOpenPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>인쇄 / PDF 출력</span>
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-md shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>내보내기</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-xs">
                    <button
                      type="button"
                      onClick={handleExportMarkdown}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <FileCode className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-medium">마크다운 (.md) 다운로드</div>
                        <div className="text-[10px] text-slate-600">노션, 깃허브 등 호환</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Download className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-medium">JSON 백업 파일 저장</div>
                        <div className="text-[10px] text-slate-600">데이터 전체 복원용</div>
                      </div>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowExportMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Upload className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-medium">JSON 백업 불러오기</div>
                        <div className="text-[10px] text-slate-600">파일에서 데이터 복구</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
