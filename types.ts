
export type Gender = 'male' | 'female';
export type AgeBand = '16-20' | '21-35' | '36-50' | '50+';
export type ApprovalStatus = 'pending' | 'applied' | 'approved' | 'enrolled';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  gender: Gender;
  ageBand: AgeBand;
  selectedPathId?: string;
  hasPaid?: boolean;
  approvalStatus?: ApprovalStatus;
  commitmentNote?: string;
  isAdmin?: boolean;
}

export interface YearMilestone {
  year: number;
  title: string;
  description: string;
  outcome: string;
}

export interface JourneyContent {
  headline: string;
  subHeadline: string;
  whyLivestock: string;
  systemSummary: string;
  innovationDetail: string;
  agencyStatement: string;
  narrative: YearMilestone[];
  visionRange: string;
}
