export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEventInfo = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.schoolName?.trim()) errors.schoolName = '學校名稱為必填';
  if (!data.eventName?.trim()) errors.eventName = '比賽名稱為必填';
  if (!data.sport) errors.sport = '比賽項目為必填';
  if (data.sport === 'other' && !data.sportOther?.trim()) {
    errors.sportOther = '請輸入其他運動項目名稱';
  }
  if (!data.date) errors.date = '比賽日期為必填';
  if (!data.startTime) errors.startTime = '開始時間為必填';
  if (!data.venue?.trim()) errors.venue = '比賽地點為必填';
  if (!data.organizer?.trim()) errors.organizer = '主辦單位為必填';
  if (!data.contact?.trim()) errors.contact = '承辦人為必填';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTeam = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) errors.name = '隊伍名稱為必填';
  if (!data.grade) errors.grade = '年級為必填';
  if (!data.className) errors.className = '班級為必填';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateScore = (
  scoreA: number | null,
  scoreB: number | null
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (scoreA === null) errors.scoreA = '隊伍A比分為必填';
  if (scoreB === null) errors.scoreB = '隊伍B比分為必填';
  if (scoreA !== null && scoreB !== null && scoreA === scoreB) {
    errors.draw = '不允許平手，請輸入加賽後的最終比分';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
