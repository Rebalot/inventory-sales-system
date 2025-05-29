export function getUtcRangeFromLocalDate(localDateString: string) {
 const [year, month, day] = localDateString.split('-').map(Number); // '2025-04-30' → [2025, 4, 30]

  // Crear fechas locales
  const startLocal = new Date(year, month - 1, day, 0, 0, 0);
  const endLocal = new Date(year, month - 1, day, 23, 59, 59, 999);
  console.log('startLocal', startLocal);
  
  // toISOString convierte a UTC real
  return {
    gte: startLocal.toISOString(),
    lte: endLocal.toISOString(),
  };
}