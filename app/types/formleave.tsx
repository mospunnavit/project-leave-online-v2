export interface Leave {
    id: string;
    username : string;
    leaveTime: LeaveTime[];
    reason: string;
    selectedLeavetype: string;
    leaveDays: string;
    fullname: string;
    department: string;
    periodTime: string;
    createdAt: string;
    status: string;
  }
  
  type LeaveTime = {
    startTime: string;
    endTime: string;
  };