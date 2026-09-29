import React, { useState, useEffect } from 'react';
import { KeyAsset } from '../../types/handover';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: KeyAsset | null;
  onSave: (asset: KeyAsset) => void;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<KeyAsset['category']>('기획서/SOP');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isEssential, setIsEssential] = useState(false);

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setCategory(asset.category);
      setLocation(asset.location);
      setDescription(asset.description);
      setIsEssential(asset.isEssential);
    } else {
      setName('');
      setCategory('기획서/SOP');
      setLocation('');
      setDescription('');
      setIsEssential(false);
    }
  }, [asset, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: KeyAsset = {
      id: asset?.id || `ast-${Date.now()}`,
      name,
      category,
      location,
      description,
      isEssential,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {asset ? '자료/문서 링크 수정' : '새 자료 및 드라이브 링크 추가'}
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
            <label className="block font-semibold text-slate-700 mb-1">자료 / 파일명</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 2026 서비스 아키텍처 다이어그램 및 네트워크 맵"
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">문서 분류</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2 rounded-md border border-slate-300 bg-white"
            >
              <option value="기획서/SOP">기획서 / SOP</option>
              <option value="소스코드/레포">소스코드 / 리포지토리</option>
              <option value="디자인/에셋">디자인 / Figma / 에셋</option>
              <option value="계약서/품의서">계약서 / 품의서 / 법무</option>
              <option value="매뉴얼/가이드">운영 매뉴얼 / 런북</option>
              <option value="데이터/스프레드시트">데이터 / 스프레드시트</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">저장 위치 (URL 또는 사내 서버 경로)</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="https://drive.google.com/... 또는 \\fileserver\data"
              className="w-full p-2 rounded-md border border-slate-300 bg-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">설명 및 참고사항</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="문서의 용도, 접근 권한 요청 방법 등을 간략히 적어주세요."
              className="w-full p-2 rounded-md border border-slate-300 bg-white leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="essential-check"
              checked={isEssential}
              onChange={(e) => setIsEssential(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="essential-check" className="font-semibold text-slate-800">
              필수 숙지 및 인계 핵심 자료로 강조 표시
            </label>
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
