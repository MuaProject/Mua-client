export function generateFutureDates(days = 30) {
  const result: string[] = [];
  const today = new Date();

  for (let i = 0; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

    result.push(`${month}.${date} (${day})`);
  }

  return result;
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
