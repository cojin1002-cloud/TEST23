import React, { useState, useEffect } from 'react';
import { 
  loadHandovers, 
  saveHandovers, 
  loadActiveDocId, 
  saveActiveDocId, 
  createHandoverFromPreset 
} from './utils/storage';
import { 
  HandoverDocument, 
  ActiveTab, 
  RoutineTask, 
  ActiveProject, 
  AccountAccess, 
  ContactStakeholder, 
  KeyAsset, 
  EmergencySOP, 
  HandoverSession, 
  QnAItem, 
  HandoverSignOff,
  HandoverStatus
} from './types/handover';

// Components
import { Header } from './components/Header';
import { DocumentMetaHeader } from './components/DocumentMetaHeader';
import { TabsNav } from './components/TabsNav';
import { RoutineTasksTab } from './components/tabs/RoutineTasksTab';
import { ProjectsTab } from './components/tabs/ProjectsTab';
import { AccountsTab } from './components/tabs/AccountsTab';
import { EmergencySOPTab } from './components/tabs/EmergencySOPTab';
import { ContactsAndAssetsTab } from './components/tabs/ContactsAndAssetsTab';
import { ScheduleAndQnATab } from './components/tabs/ScheduleAndQnATab';
import { SignOffTab } from './components/tabs/SignOffTab';
import { PrintView } from './components/PrintView';

// Modals
import { NewDocumentModal } from './components/modals/NewDocumentModal';
import { EditMetaModal } from './components/modals/EditMetaModal';
import { RoutineTaskModal } from './components/modals/RoutineTaskModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { AccountModal } from './components/modals/AccountModal';
import { ContactModal } from './components/modals/ContactModal';
import { AssetModal } from './components/modals/AssetModal';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { SessionModal } from './components/modals/SessionModal';
import { QnAModal } from './components/modals/QnAModal';

export default function App() {
  const [documents, setDocuments] = useState<HandoverDocument[]>(() => loadHandovers());
  const [activeDocId, setActiveDocId] = useState<string>(() => loadActiveDocId(documents));
  const [activeTab, setActiveTab] = useState<ActiveTab>('routine');
  const [isPrintView, setIsPrintView] = useState(false);

  // Modals state
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showEditMetaModal, setShowEditMetaModal] = useState(false);

  const [routineModal, setRoutineModal] = useState<{ isOpen: boolean; task?: RoutineTask | null }>({ isOpen: false });
  const [projectModal, setProjectModal] = useState<{ isOpen: boolean; project?: ActiveProject | null }>({ isOpen: false });
  const [accountModal, setAccountModal] = useState<{ isOpen: boolean; account?: AccountAccess | null }>({ isOpen: false });
  const [contactModal, setContactModal] = useState<{ isOpen: boolean; contact?: ContactStakeholder | null }>({ isOpen: false });
  const [assetModal, setAssetModal] = useState<{ isOpen: boolean; asset?: KeyAsset | null }>({ isOpen: false });
  const [sopModal, setSopModal] = useState<{ isOpen: boolean; sop?: EmergencySOP | null }>({ isOpen: false });
  const [sessionModal, setSessionModal] = useState<{ isOpen: boolean; session?: HandoverSession | null }>({ isOpen: false });
  const [qnaModal, setQnaModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  // Sync to storage on doc update
  useEffect(() => {
    saveHandovers(documents);
  }, [documents]);

  useEffect(() => {
    saveActiveDocId(activeDocId);
  }, [activeDocId]);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  // Helper to update active document
  const updateActiveDoc = (updatedFields: Partial<HandoverDocument>) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDoc.id) {
          return {
            ...doc,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return doc;
      })
    );
  };

  // Switch doc
  const handleSelectDoc = (id: string) => {
    setActiveDocId(id);
  };

  // Create new doc from template
  const handleCreateNewDoc = (templateId: string, customTitle?: string) => {
    const newDoc = createHandoverFromPreset(templateId);
    if (customTitle) {
      newDoc.title = customTitle;
    }
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    setActiveTab('routine');
  };

  // Delete doc
  const handleDeleteDoc = (id: string) => {
    const filtered = documents.filter((d) => d.id !== id);
    if (filtered.length > 0) {
      setDocuments(filtered);
      if (activeDocId === id) {
        setActiveDocId(filtered[0].id);
      }
    }
  };

  // Import JSON
  const handleImportJson = (importedDoc: HandoverDocument) => {
    const newDoc = {
      ...importedDoc,
      id: `imported-${Date.now()}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
  };

  // Status change
  const handleStatusChange = (status: HandoverStatus) => {
    updateActiveDoc({ status });
  };

  // If in Print View mode
  if (isPrintView) {
    return <PrintView document={activeDoc} onClose={() => setIsPrintView(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        documents={documents}
        activeDoc={activeDoc}
        onSelectDoc={handleSelectDoc}
        onOpenNewDocModal={() => setShowNewDocModal(true)}
        onOpenPrint={() => setIsPrintView(true)}
        onImportJson={handleImportJson}
        onDeleteDoc={handleDeleteDoc}
      />

      {/* Document Overview & Participant Summary Card */}
      <DocumentMetaHeader
        document={activeDoc}
        onEditMeta={() => setShowEditMetaModal(true)}
        onStatusChange={handleStatusChange}
      />

      {/* Segmented Navigation Tabs */}
      <TabsNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        document={activeDoc}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'routine' && (
          <RoutineTasksTab
            tasks={activeDoc.routineTasks}
            onUpdateTasks={(routineTasks) => updateActiveDoc({ routineTasks })}
            onOpenAddModal={() => setRoutineModal({ isOpen: true, task: null })}
            onOpenEditModal={(task) => setRoutineModal({ isOpen: true, task })}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={activeDoc.activeProjects}
            onUpdateProjects={(activeProjects) => updateActiveDoc({ activeProjects })}
            onOpenAddModal={() => setProjectModal({ isOpen: true, project: null })}
            onOpenEditModal={(project) => setProjectModal({ isOpen: true, project })}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsTab
            accounts={activeDoc.accountAccesses}
            onUpdateAccounts={(accountAccesses) => updateActiveDoc({ accountAccesses })}
            onOpenAddModal={() => setAccountModal({ isOpen: true, account: null })}
            onOpenEditModal={(account) => setAccountModal({ isOpen: true, account })}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencySOPTab
            sops={activeDoc.emergencySOPs}
            onUpdateSOPs={(emergencySOPs) => updateActiveDoc({ emergencySOPs })}
            onOpenAddModal={() => setSopModal({ isOpen: true, sop: null })}
            onOpenEditModal={(sop) => setSopModal({ isOpen: true, sop })}
          />
        )}

        {activeTab === 'contacts_assets' && (
          <ContactsAndAssetsTab
            contacts={activeDoc.contacts}
            keyAssets={activeDoc.keyAssets}
            onUpdateContacts={(contacts) => updateActiveDoc({ contacts })}
            onUpdateAssets={(keyAssets) => updateActiveDoc({ keyAssets })}
            onOpenAddContact={() => setContactModal({ isOpen: true, contact: null })}
            onOpenEditContact={(contact) => setContactModal({ isOpen: true, contact })}
            onOpenAddAsset={() => setAssetModal({ isOpen: true, asset: null })}
            onOpenEditAsset={(asset) => setAssetModal({ isOpen: true, asset })}
          />
        )}

        {activeTab === 'sessions_qna' && (
          <ScheduleAndQnATab
            sessions={activeDoc.sessions}
            qnaItems={activeDoc.qnaItems}
            onUpdateSessions={(sessions) => updateActiveDoc({ sessions })}
            onUpdateQnA={(qnaItems) => updateActiveDoc({ qnaItems })}
            onOpenAddSession={() => setSessionModal({ isOpen: true, session: null })}
            onOpenEditSession={(session) => setSessionModal({ isOpen: true, session })}
            onOpenAddQnA={() => setQnaModal({ isOpen: true })}
          />
        )}

        {activeTab === 'signoff' && (
          <SignOffTab
            document={activeDoc}
            onUpdateSignOff={(signOff) => updateActiveDoc({ signOff })}
            onOpenPrint={() => setIsPrintView(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-600 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 인수인계 프로 (Handover Pro) · 모든 데이터는 브라우저 로컬 저장소에 안전하게 보관됩니다.</p>
          <div className="flex items-center gap-3 text-slate-600">
            <span>마크다운 및 JSON 백업 지원</span>
            <span aria-hidden="true">·</span>
            <span>A4 표준 인수인계서 인쇄 양식 탑재</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <NewDocumentModal
        isOpen={showNewDocModal}
        onClose={() => setShowNewDocModal(false)}
        onCreate={handleCreateNewDoc}
      />

      <EditMetaModal
        isOpen={showEditMetaModal}
        onClose={() => setShowEditMetaModal(false)}
        document={activeDoc}
        onSave={updateActiveDoc}
      />

      <RoutineTaskModal
        isOpen={routineModal.isOpen}
        task={routineModal.task}
        onClose={() => setRoutineModal({ isOpen: false })}
        onSave={(savedTask) => {
          const exists = activeDoc.routineTasks.some((t) => t.id === savedTask.id);
          const updated = exists
            ? activeDoc.routineTasks.map((t) => (t.id === savedTask.id ? savedTask : t))
            : [...activeDoc.routineTasks, savedTask];
          updateActiveDoc({ routineTasks: updated });
        }}
      />

      <ProjectModal
        isOpen={projectModal.isOpen}
        project={projectModal.project}
        onClose={() => setProjectModal({ isOpen: false })}
        onSave={(savedProject) => {
          const exists = activeDoc.activeProjects.some((p) => p.id === savedProject.id);
          const updated = exists
            ? activeDoc.activeProjects.map((p) => (p.id === savedProject.id ? savedProject : p))
            : [...activeDoc.activeProjects, savedProject];
          updateActiveDoc({ activeProjects: updated });
        }}
      />

      <AccountModal
        isOpen={accountModal.isOpen}
        account={accountModal.account}
        onClose={() => setAccountModal({ isOpen: false })}
        onSave={(savedAccount) => {
          const exists = activeDoc.accountAccesses.some((a) => a.id === savedAccount.id);
          const updated = exists
            ? activeDoc.accountAccesses.map((a) => (a.id === savedAccount.id ? savedAccount : a))
            : [...activeDoc.accountAccesses, savedAccount];
          updateActiveDoc({ accountAccesses: updated });
        }}
      />

      <ContactModal
        isOpen={contactModal.isOpen}
        contact={contactModal.contact}
        onClose={() => setContactModal({ isOpen: false })}
        onSave={(savedContact) => {
          const exists = activeDoc.contacts.some((c) => c.id === savedContact.id);
          const updated = exists
            ? activeDoc.contacts.map((c) => (c.id === savedContact.id ? savedContact : c))
            : [...activeDoc.contacts, savedContact];
          updateActiveDoc({ contacts: updated });
        }}
      />

      <AssetModal
        isOpen={assetModal.isOpen}
        asset={assetModal.asset}
        onClose={() => setAssetModal({ isOpen: false })}
        onSave={(savedAsset) => {
          const exists = activeDoc.keyAssets.some((a) => a.id === savedAsset.id);
          const updated = exists
            ? activeDoc.keyAssets.map((a) => (a.id === savedAsset.id ? savedAsset : a))
            : [...activeDoc.keyAssets, savedAsset];
          updateActiveDoc({ keyAssets: updated });
        }}
      />

      <EmergencyModal
        isOpen={sopModal.isOpen}
        sop={sopModal.sop}
        onClose={() => setSopModal({ isOpen: false })}
        onSave={(savedSop) => {
          const exists = activeDoc.emergencySOPs.some((s) => s.id === savedSop.id);
          const updated = exists
            ? activeDoc.emergencySOPs.map((s) => (s.id === savedSop.id ? savedSop : s))
            : [...activeDoc.emergencySOPs, savedSop];
          updateActiveDoc({ emergencySOPs: updated });
        }}
      />

      <SessionModal
        isOpen={sessionModal.isOpen}
        session={sessionModal.session}
        onClose={() => setSessionModal({ isOpen: false })}
        onSave={(savedSession) => {
          const exists = activeDoc.sessions.some((s) => s.id === savedSession.id);
          const updated = exists
            ? activeDoc.sessions.map((s) => (s.id === savedSession.id ? savedSession : s))
            : [...activeDoc.sessions, savedSession];
          updateActiveDoc({ sessions: updated });
        }}
      />

      <QnAModal
        isOpen={qnaModal.isOpen}
        defaultAsker={activeDoc.takeoverPerson.name}
        onClose={() => setQnaModal({ isOpen: false })}
        onSave={(savedQnA) => {
          updateActiveDoc({ qnaItems: [savedQnA, ...activeDoc.qnaItems] });
        }}
      />
    </div>
  );
}
