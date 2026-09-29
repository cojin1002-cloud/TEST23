import React, { useState } from 'react';
import { 
  FileText, 
  Terminal, 
  Layers, 
  TrendingUp, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { TEMPLATE_PRESETS } from '../../data/sampleHandovers';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (templateId: string, customTitle?: string) => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('template-blank');
  const [titleDraft, setTitleDraft] = useState('');

  if (!isOpen) return null;

  const icons: Record<string, React.ElementType> = {
    Terminal,
    Layers,
    TrendingUp,
    Briefcase,
    FileText,
  };

  const handleCreate = () => {
    onCreate(selectedTemplate, titleDraft.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">새 업무 인수인계서 작성</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              직무에 맞는 최적의 템플릿을 선택하거나 빈 양식으로 시작하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            인수인계서 제목 (선택)
          </label>
          <input
            type="text"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="예: 2026 하반기 플랫폼 운영 및 인프라 인수인계서"
            className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Template Presets Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            직무별 추천 템플릿 선택
          </label>
          <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {TEMPLATE_PRESETS.map((tmpl) => {
              const Icon = icons[tmpl.icon] || FileText;
              const isSelected = selectedTemplate === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{tmpl.title}</span>
                      <span className="text-[10px] text-slate-600">{tmpl.department}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>인수인계서 생성</span>
          </button>
        </div>
      </div>
    </div>
  );
};
