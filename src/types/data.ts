export interface CourseData {
  kode: string
  nama: string
  sks: number
  nilai: string
  n: number
}

export interface GradeScenario {
  grades: Record<string, string>
  gpa: number
  difficulty: number
  totalA: number
  totalAB: number
  totalB: number
  totalBC: number
  totalC: number
  totalD: number
  totalE: number
}

export type JurusanType = 'RPL' | 'Informatika'

export interface AlertState {
  type: 'error' | 'success'
  message: string
}
