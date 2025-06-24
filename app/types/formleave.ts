import { Leavetypes } from "./leavetypes";
export interface Leave {
    id: number;
    u_id: string;
    leave_date: string;
    end_leave_date: string;
    start_time: string;
    end_time: string;
    reason: string;
    lt_code: string;
    lc_code: string;
    usequotaleave: string;
    exported: boolean | number;
    status: string;
    image_filename: string;
    submitted_at: string;
    username: string;
    department_name: string;
    firstname: string;
    lastname: string;
    lt_name: string;
    lc_name: string;
    leave_type: Leavetypes;
    leave_category: string;
    
  }
  
  type LeaveTime = {
    startTime: string;
    endTime: string;
  };