export interface Leave {
    id: string;
    email: string;
    leaveFields: LeaveField[];
    reason: string;
    createdAt: Date;
  }
  
  interface LeaveField {
    date: string;
    days: string;
  }