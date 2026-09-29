export type HandoverReason = 
  | '퇴사 (이직/진로변경)'
  | '부서 이동 / 직무 전환'
  | '육아 / 출산 휴직'
  | '장기 병가 / 안식휴가'
  | '프로젝트 종료 / 파견 복귀'
  | '기타 사유';

export type HandoverStatus = 'draft' | 'in_progress' | 'review' | 'signed' | 'archived';

export type TaskCycle = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'ad-hoc';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface RoutineTask {
  id: string;
  cycle: TaskCycle;
  title: string;
  description: string;
  priority: TaskPriority;
  toolOrSystem: string;
  estimatedTime: string;
  guideUrl?: string;
  keyTips: string;
  isHandedOver: boolean;
  handoverDate?: string;
  verifiedByTakeover?: boolean;
}

export type ProjectStatus = 'active' | 'pending' | 'delayed' | 'wrapped';

export interface ActiveProject {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 to 100
  status: ProjectStatus;
  nextActions: string;
  keyRisks: string;
  collaborators: string;
  docLink?: string;
  isHandedOver: boolean;
}

export type AccountStatus = 'pending' | 'in_progress' | 'transferred' | 'revoked' | 'not_applicable';

export interface AccountAccess {
  id: string;
  systemName: string;
  roleType: 'Admin' | 'Member' | 'Billing' | 'Owner' | 'Operator';
  accountIdentifier: string;
  has2FA: boolean;
  status: AccountStatus;
  notes: string;
  transferredDate?: string;
}

export interface ContactStakeholder {
  id: string;
  category: '내부 협업 부서' | '고객사' | '외주/협력사' | '대행사/파트너' | '시스템 벤더';
  name: string;
  organization: string;
  role: string;
  contact: string;
  frequency: string;
  relationshipNotes: string;
}

export interface KeyAsset {
  id: string;
  name: string;
  category: '기획서/SOP' | '소스코드/레포' | '디자인/에셋' | '계약서/품의서' | '매뉴얼/가이드' | '데이터/스프레드시트';
  location: string;
  description: string;
  isEssential: boolean;
}

export interface EmergencySOP {
  id: string;
  scenario: string;
  urgency: 'critical' | 'high' | 'medium';
  actionSteps: string[];
  escalationContact: string;
  lastTestedDate?: string;
}

export interface QnAItem {
  id: string;
  asker: string;
  question: string;
  answer?: string;
  isResolved: boolean;
  createdAt: string;
  answeredAt?: string;
}

export interface HandoverSession {
  id: string;
  date: string;
  topic: string;
  duration: string;
  attendees: string;
  status: 'scheduled' | 'completed';
  notes: string;
}

export interface SignatureEntry {
  name: string;
  role: string;
  signed: boolean;
  signatureDataUrl?: string;
  signedAt?: string;
  comment?: string;
}

export interface HandoverSignOff {
  handedOverBy: SignatureEntry; // 인계자
  takenOverBy: SignatureEntry;  // 인수자
  approvedBy: SignatureEntry;   // 확인자(부서장/팀장)
  completionDate?: string;
}

export interface HandoverDocument {
  id: string;
  title: string;
  department: string;
  reason: HandoverReason;
  startDate: string;
  targetDate: string;
  status: HandoverStatus;
  summary: string;

  // 인원 정보
  handoverPerson: {
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
  };
  takeoverPerson: {
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
  };
  supervisor: {
    name: string;
    role: string;
    department: string;
    email: string;
  };

  // 모듈 데이터
  routineTasks: RoutineTask[];
  activeProjects: ActiveProject[];
  accountAccesses: AccountAccess[];
  contacts: ContactStakeholder[];
  keyAssets: KeyAsset[];
  emergencySOPs: EmergencySOP[];
  sessions: HandoverSession[];
  qnaItems: QnAItem[];
  signOff: HandoverSignOff;

  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'routine' 
  | 'projects' 
  | 'accounts' 
  | 'contacts_assets' 
  | 'emergency' 
  | 'sessions_qna' 
  | 'signoff';
