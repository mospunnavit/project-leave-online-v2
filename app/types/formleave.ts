export interface Leave {
    id: number;
    u_id: string;
    leave_date: string;
    start_time: string;
    end_time: string;
    reason: string;
    leave_type: string;
    status: string;
    image_filename: string;
    submitted_at: string;
    username: string;
    department: string;
    firstname: string;
    lastname: string;
    
  }
  
  type LeaveTime = {
    startTime: string;
    endTime: string;
  };