function getWorkDuration(startTime, endTime, breakStart, breakEnd) {
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const start = toMinutes(startTime);
  let end = toMinutes(endTime);
  let breakS = toMinutes(breakStart);
  let breakE = toMinutes(breakEnd);
  console.log(start, end, breakS, breakE);
  // รองรับเวลาข้ามวันสำหรับเวลาทำงาน
  if (end <= start) {
    end += 24 * 60; // บวก 24 ชม. (1440 นาที)
  }

  // รองรับเวลาข้ามวันสำหรับช่วงพัก
  if (breakE <= breakS) {
    breakE += 24 * 60;
  }

  let workMinutes = end - start;

  // ปรับช่วงพักให้อยู่ในช่วงเวลาที่ถูกต้อง (เพิ่ม 24 ชม. ถ้าจำเป็น)
  if (breakS < start) {
    breakS += 24 * 60;
    breakE += 24 * 60;
  }

  // หักเวลาพักถ้ามันทับเวลาทำงาน
  const overlapStart = Math.max(start, breakS);
  const overlapEnd = Math.min(end, breakE);

  if (overlapStart < overlapEnd) {
    workMinutes -= (overlapEnd - overlapStart);
  }

  const hours = Math.floor(workMinutes / 60);
  const minutes = workMinutes % 60;
  const total = parseFloat((workMinutes / (60 * 8)).toFixed(2)); // คิดจากวันทำงาน 8 ชม.

  return { hours, minutes, total };
}



