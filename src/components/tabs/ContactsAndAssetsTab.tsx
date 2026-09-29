import React, { useState } from 'react';
import { 
  Users, 
  FolderLock, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Building, 
  Edit2, 
  Trash2,
  FileText,
  Star
} from 'lucide-react';
import { ContactStakeholder, KeyAsset } from '../../types/handover';

interface ContactsAndAssetsTabProps {
  contacts: ContactStakeholder[];
  keyAssets: KeyAsset[];
  onUpdateContacts: (contacts: ContactStakeholder[]) => void;
  onUpdateAssets: (assets: KeyAsset[]) => void;
  onOpenAddContact: () => void;
  onOpenEditContact: (contact: ContactStakeholder) => void;
  onOpenAddAsset: () => void;
  onOpenEditAsset: (asset: KeyAsset) => void;
}

export const ContactsAndAssetsTab: React.FC<ContactsAndAssetsTabProps> = ({
  contacts,
  keyAssets,
  onUpdateContacts,
  onUpdateAssets,
  onOpenAddContact,
  onOpenEditContact,
  onOpenAddAsset,
  onOpenEditAsset,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteContact = (id: string) => {
    if (confirm('이 연락처 항목을 삭제하시겠습니까?')) {
      onUpdateContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const deleteAsset = (id: string) => {
    if (confirm('이 자산/문서 항목을 삭제하시겠습니까?')) {
      onUpdateAssets(keyAssets.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Key Stakeholder Contacts */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>내·외부 주요 담당자 및 협력사 연락망</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              업무 수행 중 정기적으로 소통하거나 이슈 발생 시 도움을 요청할 수 있는 담당자 네트워크입니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddContact}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>연락처 추가</span>
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
            등록된 담당자 연락처가 없습니다. [+ 연락처 추가] 버튼을 눌러 등록하세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-indigo-600">{contact.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>소통: {contact.frequency}</span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {contact.name}
                      <span className="ml-1.5 text-xs font-normal text-slate-600">
                        {contact.organization} · {contact.role}
                      </span>
                    </div>

                    <div className="pt-1 flex items-center gap-1 text-xs text-slate-700 font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="truncate flex-1">{contact.contact}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(contact.contact, contact.id)}
                        className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors"
                        title="연락처 복사"
                      >
                        {copiedId === contact.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {contact.relationshipNotes && (
                      <p className="pt-1 text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-2 rounded border border-amber-100/60">
                        <span className="font-semibold text-amber-900">협업 팁: </span>
                        {contact.relationshipNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={() => onOpenEditContact(contact)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteContact(contact.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Key Assets & Document Vault */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-indigo-600" />
              <span>핵심 문서 및 저장소 / 드라이브 위치</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              기획서, 소스코드 저장소, 디자인 에셋, 표준 매뉴얼 등 업무에 반드시 필요한 핵심 파일 위치 링크입니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddAsset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>자료 링크 추가</span>
          </button>
        </div>

        {keyAssets.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
            등록된 문서/자료 링크가 없습니다. [+ 자료 링크 추가] 버튼을 눌러 등록하세요.
          </div>
        ) : (
          <div className="space-y-2.5">
            {keyAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-indigo-600">{asset.category}</span>
                    {asset.isEssential && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-rose-500 text-rose-500" /> 필수 참조
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {asset.name}
                  </h3>

                  {asset.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {asset.description}
                    </p>
                  )}

                  <div className="pt-1 flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <span className="truncate max-w-md">{asset.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {asset.location.startsWith('http') && (
                    <a
                      href={asset.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>열기</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopy(asset.location, asset.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="링크 복사"
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenEditAsset(asset)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
