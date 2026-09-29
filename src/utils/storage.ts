import { HandoverDocument, RoutineTask, ActiveProject, AccountAccess } from '../types/handover';
import { SAMPLE_HANDOVERS } from '../data/sampleHandovers';

const STORAGE_KEY = 'handover_pro_documents_v1';
const ACTIVE_DOC_ID_KEY = 'handover_pro_active_doc_id';

export function loadHandovers(): HandoverDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_HANDOVERS));
      return SAMPLE_HANDOVERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_HANDOVERS;
  } catch (err) {
    console.error('Failed to load handovers from storage:', err);
    return SAMPLE_HANDOVERS;
  }
}

export function saveHandovers(handovers: HandoverDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handovers));
  } catch (err) {
    console.error('Failed to save handovers to storage:', err);
  }
}

export function loadActiveDocId(handovers: HandoverDocument[]): string {
  const savedId = localStorage.getItem(ACTIVE_DOC_ID_KEY);
  if (savedId && handovers.some((d) => d.id === savedId)) {
    return savedId;
  }
  return handovers[0]?.id || '';
}

export function saveActiveDocId(id: string): void {
  localStorage.setItem(ACTIVE_DOC_ID_KEY, id);
}

export function calculateProgress(doc: HandoverDocument) {
  const routineTotal = doc.routineTasks.length;
  const routineDone = doc.routineTasks.filter((t) => t.isHandedOver).length;

  const projectTotal = doc.activeProjects.length;
  const projectDone = doc.activeProjects.filter((p) => p.isHandedOver).length;

  const accountTotal = doc.accountAccesses.length;
  const accountDone = doc.accountAccesses.filter((a) => a.status === 'transferred' || a.status === 'revoked' || a.status === 'not_applicable').length;

  const sessionTotal = doc.sessions.length;
  const sessionDone = doc.sessions.filter((s) => s.status === 'completed').length;

  const signaturesRequired = 3;
  let signaturesDone = 0;
  if (doc.signOff.handedOverBy?.signed) signaturesDone++;
  if (doc.signOff.takenOverBy?.signed) signaturesDone++;
  if (doc.signOff.approvedBy?.signed) signaturesDone++;

  const totalItems = routineTotal + projectTotal + accountTotal + sessionTotal + signaturesRequired;
  const completedItems = routineDone + projectDone + accountDone + sessionDone + signaturesDone;

  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    overallPercentage,
    routineTotal,
    routineDone,
    projectTotal,
    projectDone,
    accountTotal,
    accountDone,
    sessionTotal,
    sessionDone,
    signaturesDone,
    signaturesRequired,
  };
}

export function generateMarkdownExport(doc: HandoverDocument): string {
  const progress = calculateProgress(doc);

  let md = `# [업무 인수인계서] ${doc.title}\n\n`;
  md += `> **문서 상태**: ${doc.status.toUpperCase()} | **전체 진행률**: ${progress.overallPercentage}%\n\n`;
  md += `## 1. 기본 정보\n`;
  md += `- **소속 부서**: ${doc.department}\n`;
  md += `- **인계 사유**: ${doc.reason}\n`;
  md += `- **인수인계 기간**: ${doc.startDate} ~ ${doc.targetDate}\n`;
  md += `- **인계자(전임자)**: ${doc.handoverPerson.name} (${doc.handoverPerson.role} / ${doc.handoverPerson.email} / ${doc.handoverPerson.phone})\n`;
  md += `- **인수자(후임자)**: ${doc.takeoverPerson.name} (${doc.takeoverPerson.role} / ${doc.takeoverPerson.email} / ${doc.takeoverPerson.phone})\n`;
  md += `- **확인자(부서장)**: ${doc.supervisor.name} (${doc.supervisor.role} / ${doc.supervisor.email})\n\n`;
  md += `### 인계 총괄 개요\n${doc.summary}\n\n`;

  md += `## 2. 정기 / 반복 업무 인수인계 (${progress.routineDone}/${progress.routineTotal})\n`;
  if (doc.routineTasks.length === 0) {
    md += `등록된 업무 항목이 없습니다.\n\n`;
  } else {
    doc.routineTasks.forEach((t, idx) => {
      const cycleText = {
        daily: '매일',
        weekly: '매주',
        monthly: '매월',
        quarterly: '분기별',
        yearly: '연간',
        'ad-hoc': '수시',
      }[t.cycle];
      md += `### ${idx + 1}. [${cycleText}] ${t.title} ${t.isHandedOver ? '✅ [인계완료]' : '⏳ [미완료]'}\n`;
      md += `- **세부 절차**: ${t.description}\n`;
      md += `- **사용 툴/시스템**: ${t.toolOrSystem}\n`;
      md += `- **소요 시간**: ${t.estimatedTime}\n`;
      if (t.keyTips) md += `- **핵심 노하우/주의사항**: ${t.keyTips}\n`;
      if (t.guideUrl) md += `- **참고 가이드**: [링크](${t.guideUrl})\n`;
      md += `\n`;
    });
  }

  md += `## 3. 진행 중인 프로젝트 및 현안 과제 (${progress.projectDone}/${progress.projectTotal})\n`;
  doc.activeProjects.forEach((p, idx) => {
    md += `### ${idx + 1}. ${p.title} (진척도: ${p.progress}%) ${p.isHandedOver ? '✅' : '⏳'}\n`;
    md += `- **개요**: ${p.description}\n`;
    md += `- **후속 조치**: ${p.nextActions}\n`;
    md += `- **리스크/주의사항**: ${p.keyRisks}\n`;
    md += `- **협업자**: ${p.collaborators}\n`;
    if (p.docLink) md += `- **기획서**: [문서 링크](${p.docLink})\n`;
    md += `\n`;
  });

  md += `## 4. 시스템 계정 및 접근 권한 이관 (${progress.accountDone}/${progress.accountTotal})\n`;
  doc.accountAccesses.forEach((a, idx) => {
    md += `- [${a.status === 'transferred' ? 'X' : ' '}] **${a.systemName}** (${a.roleType}) | 식별자: ${a.accountIdentifier} | 2FA: ${a.has2FA ? '필요' : '해당없음'}\n  - 메모: ${a.notes}\n`;
  });
  md += `\n`;

  md += `## 5. 장애 및 비상 상황 대응 매뉴얼 (SOP)\n`;
  doc.emergencySOPs.forEach((sop, idx) => {
    md += `### 시나리오 ${idx + 1}: ${sop.scenario} [${sop.urgency.toUpperCase()}]\n`;
    sop.actionSteps.forEach((step) => {
      md += `- ${step}\n`;
    });
    md += `- **비상 보고/에스컬레이션**: ${sop.escalationContact}\n\n`;
  });

  md += `## 6. 내외부 주요 이해관계자 연락망\n`;
  doc.contacts.forEach((c) => {
    md += `- **${c.name}** (${c.organization} / ${c.role}) : ${c.contact}\n  - 소통 주기: ${c.frequency} | 팁: ${c.relationshipNotes}\n`;
  });
  md += `\n`;

  md += `## 7. 주요 파일 및 드라이브 저장소\n`;
  doc.keyAssets.forEach((k) => {
    md += `- [${k.category}] **${k.name}** : ${k.location}\n  - ${k.description}\n`;
  });
  md += `\n`;

  md += `## 8. 최종 서명 확인\n`;
  md += `- 인계자: ${doc.signOff.handedOverBy?.signed ? `[서명 완료: ${doc.signOff.handedOverBy.name}]` : '[미서명]'}\n`;
  md += `- 인수자: ${doc.signOff.takenOverBy?.signed ? `[서명 완료: ${doc.signOff.takenOverBy.name}]` : '[미서명]'}\n`;
  md += `- 확인자: ${doc.signOff.approvedBy?.signed ? `[서명 완료: ${doc.signOff.approvedBy.name}]` : '[미서명]'}\n`;

  return md;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function createHandoverFromPreset(templateId: string): HandoverDocument {
  const id = `handover-${Date.now()}`;
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(now.getDate() + 30);

  const startStr = now.toISOString().slice(0, 10);
  const targetStr = nextMonth.toISOString().slice(0, 10);

  const base: HandoverDocument = {
    id,
    title: '새 업무 인수인계서',
    department: '경영지원본부',
    reason: '퇴사 (이직/진로변경)',
    startDate: startStr,
    targetDate: targetStr,
    status: 'draft',
    summary: '원활한 업무 연속성을 보장하기 위해 주요 담당 업무, 진행 프로젝트, 시스템 계정 권한 및 비상 가이드를 성실히 인계합니다.',
    handoverPerson: {
      name: '홍길동',
      role: '과장 / 담당',
      department: '경영지원팀',
      email: 'gildong.hong@example.com',
      phone: '010-1234-5678',
    },
    takeoverPerson: {
      name: '김미래',
      role: '대리 / 후임',
      department: '경영지원팀',
      email: 'mirae.kim@example.com',
      phone: '010-9876-5432',
    },
    supervisor: {
      name: '이수석',
      role: '팀장',
      department: '경영지원팀',
      email: 'teamlead@example.com',
    },
    routineTasks: [],
    activeProjects: [],
    accountAccesses: [],
    contacts: [],
    keyAssets: [],
    emergencySOPs: [],
    sessions: [],
    qnaItems: [],
    signOff: {
      handedOverBy: { name: '홍길동', role: '인계자', signed: false },
      takenOverBy: { name: '김미래', role: '인수자', signed: false },
      approvedBy: { name: '이수석', role: '확인자(팀장)', signed: false },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (templateId === 'template-marketing') {
    base.title = '디지털 마케팅 및 퍼포먼스 광고 운영 인수인계서';
    base.department = '마케팅전략팀';
    base.routineTasks = [
      {
        id: `rt-${Date.now()}-1`,
        cycle: 'daily',
        title: '메타/구글/네이버 광고비 소진율 및 ROAS 일일 점검',
        description: '각 매체별 예산 소진 속도 및 일일 목표 CPA 초과 여부 확인 후 비효율 소재 OFF.',
        priority: 'high',
        toolOrSystem: 'Meta Ads Manager / Google Ads / Airbridge',
        estimatedTime: '30분',
        keyTips: '금요일 오후에는 주말 예산 증액 한도를 미리 점검하세요.',
        isHandedOver: false,
      },
      {
        id: `rt-${Date.now()}-2`,
        cycle: 'weekly',
        title: '주간 CRM 카카오 친구톡 & 앱 푸시 발송',
        description: '타겟 세그먼트 추출 후 프로모션 쿠폰 연계 푸시 발송 및 A/B 테스트 지표 집계.',
        priority: 'medium',
        toolOrSystem: 'Braze / Kakao 알림톡 관리자',
        estimatedTime: '2시간',
        keyTips: '오전 11시 30분 발송 시 오픈율이 가장 높습니다.',
        isHandedOver: false,
      },
    ];
    base.accountAccesses = [
      {
        id: `acc-${Date.now()}-1`,
        systemName: 'Meta 비즈니스 관리자 (Business Manager)',
        roleType: 'Admin',
        accountIdentifier: 'bm_company_kr',
        has2FA: true,
        status: 'pending',
        notes: '후임자 페이스북 계정 비즈니스 관리자 최고 관리자 초대',
      },
      {
        id: `acc-${Date.now()}-2`,
        systemName: 'Google Analytics 4 & Tag Manager',
        roleType: 'Admin',
        accountIdentifier: 'ga4-property-admin',
        has2FA: false,
        status: 'pending',
        notes: '속성 관리자 권한 부여 필요',
      },
    ];
    base.keyAssets = [
      {
        id: `ast-${Date.now()}-1`,
        name: '연간 마케팅 캘린더 및 소재 아카이브',
        category: '데이터/스프레드시트',
        location: 'https://docs.google.com/spreadsheets/marketing-calendar-2026',
        description: '월별 프로모션 테마 및 할인율 가이드라인',
        isEssential: true,
      },
    ];
  } else if (templateId === 'template-hr-ops') {
    base.title = '경영지원 및 총무/급여 정기 운영 인수인계서';
    base.department = '경영지원팀';
    base.routineTasks = [
      {
        id: `rt-${Date.now()}-1`,
        cycle: 'monthly',
        title: '임직원 급여 정산 및 4대보험 취득/상실 신고',
        description: '근태 확정 -> 급여대장 작성 -> 세무대리인 대사 -> 이체 실행 및 명세서 교부.',
        priority: 'high',
        toolOrSystem: 'Flex / 더존 iCube / 기업인터넷뱅킹',
        estimatedTime: '1일',
        keyTips: '매월 20일 급여 마감 후 24일까지 1차 승인 필수.',
        isHandedOver: false,
      },
      {
        id: `rt-${Date.now()}-2`,
        cycle: 'monthly',
        title: '사무실 소모품 및 간식 발주',
        description: '재고 파악 후 정기 납품처 발주 및 세금계산서 발행 확인.',
        priority: 'low',
        toolOrSystem: '스낵포 / 오피스디포',
        estimatedTime: '1시간',
        keyTips: '매월 첫째 주 화요일 일괄 발주.',
        isHandedOver: false,
      },
    ];
    base.accountAccesses = [
      {
        id: `acc-${Date.now()}-1`,
        systemName: '국세청 홈택스 법인 공인인증서 & 세무 계정',
        roleType: 'Owner',
        accountIdentifier: '법인사업자번호',
        has2FA: true,
        status: 'pending',
        notes: '보안 USB 실물 금고 보관 및 비밀번호 대면 인계',
      },
    ];
  }

  return base;
}
