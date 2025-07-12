export const nilaiToAngka = (nilai: string): number => {
  const konversi: Record<string, number> = {
    A: 4.0,
    AB: 3.5,
    B: 3.0,
    BC: 2.5,
    C: 2.0,
    D: 1.0,
    E: 0.0,
  }
  return konversi[nilai.toUpperCase()] ?? 0
}

export const getGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    A: 'bg-green-500',
    AB: 'bg-green-400',
    B: 'bg-blue-500',
    BC: 'bg-blue-400',
    C: 'bg-yellow-500',
    D: 'bg-orange-500',
    E: 'bg-red-500',
  }
  return colors[grade] || 'bg-gray-500'
}

export const getDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 2) return 'bg-green-500'
  if (difficulty <= 4) return 'bg-yellow-500'
  if (difficulty <= 6) return 'bg-orange-500'
  return 'bg-red-500'
}

export const getDifficultyLabel = (difficulty: number): string => {
  if (difficulty <= 2) return 'Very Easy'
  if (difficulty <= 4) return 'Easy'
  if (difficulty <= 6) return 'Moderate'
  if (difficulty <= 8) return 'Hard'
  return 'Very Hard'
}

export const GRADES = ['A', 'AB', 'B', 'BC', 'C', 'D', 'E']
export const MAX_CREDITS = 24
export const SCENARIOS_PER_PAGE = 5
