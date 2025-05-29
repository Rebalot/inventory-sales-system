export function generateAscendingDates(startDate: Date, count: number): Date[] {
  const endDate = new Date(); // hoy
  const timeSpan = endDate.getTime() - startDate.getTime();
  const dates: Date[] = [];

  for (let i = 0; i < count; i++) {
    // Distribución proporcional para mantener fechas ordenadas
    const proportion = i / count;
    const timestamp = startDate.getTime() + timeSpan * proportion + Math.random() * (timeSpan / count);
    dates.push(new Date(timestamp));
  }

  // Ordenar para asegurar que sean crecientes
  dates.sort((a, b) => a.getTime() - b.getTime());
  return dates;
}