import type { CourseData, GradeScenario } from '@/types/data'
import { nilaiToAngka } from '@/constants/convert'

export const getAllowedSemesters = (
  current: string,
  mataKuliah: Record<string, { kode: string; nama: string; sks: number }[]>,
): string[] => {
  const currentNumber = Number.parseInt(current.split(' ')[1])
  const parity = currentNumber % 2
  return Object.keys(mataKuliah).filter((smt) => {
    const num = Number.parseInt(smt.split(' ')[1])
    if (num === currentNumber) return false
    if (num > currentNumber) return num % 2 === parity
    return true
  })
}

export const generateGradeScenarios = (
  ungradedCourses: CourseData[],
  gradedCourses: CourseData[],
  targetGPA: number,
): GradeScenario[] => {
  const grades = ['A', 'AB', 'B', 'BC', 'C', 'D', 'E']
  const scenarios: GradeScenario[] = []

  const gradedTotalBobot = gradedCourses.reduce(
    (acc, course) => acc + course.n * course.sks,
    0,
  )
  const gradedTotalSKS = gradedCourses.reduce(
    (acc, course) => acc + course.sks,
    0,
  )
  const ungradedTotalSKS = ungradedCourses.reduce(
    (acc, course) => acc + course.sks,
    0,
  )
  const totalSKS = gradedTotalSKS + ungradedTotalSKS

  if (ungradedCourses.length === 0) return scenarios

  const generateCombinations = (
    courseIndex: number,
    currentGrades: Record<string, string>,
  ) => {
    if (courseIndex === ungradedCourses.length) {
      let ungradedBobot = 0
      const gradeCounts = { A: 0, AB: 0, B: 0, BC: 0, C: 0, D: 0, E: 0 }

      for (const course of ungradedCourses) {
        const grade = currentGrades[course.kode]
        const nilai = nilaiToAngka(grade)
        ungradedBobot += nilai * course.sks
        gradeCounts[grade as keyof typeof gradeCounts]++
      }

      const totalBobot = gradedTotalBobot + ungradedBobot
      const gpa = totalBobot / totalSKS

      if (gpa >= targetGPA) {
        const difficulty =
          gradeCounts.E * 10 +
          gradeCounts.D * 8 +
          gradeCounts.C * 6 +
          gradeCounts.BC * 4 +
          gradeCounts.B * 2 +
          gradeCounts.AB * 1 +
          gradeCounts.A * 0

        scenarios.push({
          grades: { ...currentGrades },
          gpa,
          difficulty,
          totalA: gradeCounts.A,
          totalAB: gradeCounts.AB,
          totalB: gradeCounts.B,
          totalBC: gradeCounts.BC,
          totalC: gradeCounts.C,
          totalD: gradeCounts.D,
          totalE: gradeCounts.E,
        })
      }
      return
    }

    const course = ungradedCourses[courseIndex]
    for (const grade of grades) {
      generateCombinations(courseIndex + 1, {
        ...currentGrades,
        [course.kode]: grade,
      })
    }
  }

  generateCombinations(0, {})

  return scenarios.sort((a, b) => {
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty
    return b.gpa - a.gpa
  })
}
