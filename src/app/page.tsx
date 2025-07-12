'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  BookOpen,
  Award,
  Target,
  Trash2,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calculator,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { useMemo } from 'react'
import { mataKuliahRPL } from './data/matkul-rpl'
import { mataKuliahInformatika } from './data/matkul-informatika'

interface CourseData {
  kode: string
  nama: string
  sks: number
  nilai: string
  n: number
}

interface GradeScenario {
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

type JurusanType = 'RPL' | 'Informatika'

const nilaiToAngka = (nilai: string): number => {
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

const getGradeColor = (grade: string): string => {
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

const getDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 2) return 'bg-green-500'
  if (difficulty <= 4) return 'bg-yellow-500'
  if (difficulty <= 6) return 'bg-orange-500'
  return 'bg-red-500'
}

const getDifficultyLabel = (difficulty: number): string => {
  if (difficulty <= 2) return 'Very Easy'
  if (difficulty <= 4) return 'Easy'
  if (difficulty <= 6) return 'Moderate'
  if (difficulty <= 8) return 'Hard'
  return 'Very Hard'
}

const getAllowedSemesters = (
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

const generateGradeScenarios = (
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
      // Calculate GPA for this combination
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
        // Calculate difficulty score (lower is easier)
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

  // Sort by difficulty (easiest first), then by GPA (highest first)
  return scenarios.sort((a, b) => {
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty
    return b.gpa - a.gpa
  })
}

export default function CourseSelectionApp() {
  const [jurusan, setJurusan] = useState<JurusanType | ''>('RPL')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [sourceSemester, setSourceSemester] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [data, setData] = useState<CourseData[]>([])
  const [targetGPA, setTargetGPA] = useState<string>('')
  const [scenarios, setScenarios] = useState<GradeScenario[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showAlert, setShowAlert] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const scenariosPerPage = 5
  const totalPages = Math.ceil(scenarios.length / scenariosPerPage)
  const startIndex = (currentPage - 1) * scenariosPerPage
  const endIndex = startIndex + scenariosPerPage
  const currentScenarios = scenarios.slice(startIndex, endIndex)

  const mataKuliah = useMemo(
    () =>
      jurusan === 'RPL'
        ? mataKuliahRPL
        : jurusan === 'Informatika'
          ? mataKuliahInformatika
          : {},
    [jurusan],
  )

  useEffect(() => {
    setSelectedSemester('')
    setSourceSemester('')
    setSelectedCourse('')
    setData([])
    setTargetGPA('')
    setScenarios([])
  }, [jurusan])

  useEffect(() => {
    if (!selectedSemester) return
    const courses = mataKuliah[selectedSemester] || []
    const filteredCourses: CourseData[] = []
    let sksAdded = 0

    for (const c of courses) {
      if (sksAdded + c.sks > 24) break
      filteredCourses.push({
        kode: c.kode,
        nama: c.nama,
        sks: c.sks,
        nilai: '',
        n: 0,
      })
      sksAdded += c.sks
    }

    setData(filteredCourses)
    setShowAlert({
      type: 'success',
      message: `Loaded ${filteredCourses.length} courses from ${selectedSemester}`,
    })
    setTimeout(() => setShowAlert(null), 3000)
  }, [selectedSemester, mataKuliah])

  useEffect(() => {
    if (!targetGPA || data.length === 0) {
      setScenarios([])
      return
    }

    const target = parseFloat(targetGPA)
    if (isNaN(target) || target < 0 || target > 4) {
      setScenarios([])
      return
    }

    const gradedCourses = data.filter((course) => course.nilai)
    const ungradedCourses = data.filter((course) => !course.nilai)

    if (ungradedCourses.length === 0) {
      setScenarios([])
      return
    }

    const newScenarios = generateGradeScenarios(
      ungradedCourses,
      gradedCourses,
      target,
    )
    setScenarios(newScenarios)
    setCurrentPage(1)
  }, [targetGPA, data])

  const handleAddCourse = () => {
    if (!sourceSemester || !selectedCourse) return
    const course = mataKuliah[sourceSemester]?.find(
      (c) => c.kode === selectedCourse,
    )
    if (!course) return

    const totalSKS = data.reduce((acc, cur) => acc + cur.sks, 0)
    if (totalSKS + course.sks > 24) {
      setShowAlert({
        type: 'error',
        message: 'Cannot add course: Total credits would exceed 24 limit',
      })
      setTimeout(() => setShowAlert(null), 3000)
      return
    }

    if (data.find((d) => d.kode === course.kode)) {
      setShowAlert({
        type: 'error',
        message: 'Course already added to your selection',
      })
      setTimeout(() => setShowAlert(null), 3000)
      return
    }

    setData((prev) => [
      ...prev,
      {
        kode: course.kode,
        nama: course.nama,
        sks: course.sks,
        nilai: '',
        n: 0,
      },
    ])
    setShowAlert({
      type: 'success',
      message: `Successfully added ${course.nama}`,
    })
    setTimeout(() => setShowAlert(null), 3000)
    setSelectedCourse('')
  }

  const handleRemoveCourse = (kode: string) => {
    setData((prev) => prev.filter((item) => item.kode !== kode))
    setShowAlert({
      type: 'success',
      message: 'Course removed successfully',
    })
    setTimeout(() => setShowAlert(null), 3000)
  }

  const handleNilaiChange = (kode: string, nilai: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.kode === kode ? { ...item, nilai, n: nilaiToAngka(nilai) } : item,
      ),
    )
  }

  const semesterOptions = Object.keys(mataKuliah)
  const allowedSemesterOptions = selectedSemester
    ? getAllowedSemesters(selectedSemester, mataKuliah)
    : []
  const availableCourses =
    sourceSemester && mataKuliah[sourceSemester]
      ? mataKuliah[sourceSemester].filter(
          (c) => !data.find((d) => d.kode === c.kode),
        )
      : []

  const totalSKS = data.reduce((acc, cur) => acc + cur.sks, 0)
  const totalBobot = data.reduce((acc, cur) => acc + cur.n * cur.sks, 0)
  const IPS = totalSKS > 0 ? (totalBobot / totalSKS).toFixed(2) : '0.00'
  const creditProgress = (totalSKS / 24) * 100
  const gpaProgress = (Number.parseFloat(IPS) / 4) * 100

  const ungradedCourses = data.filter((course) => !course.nilai)
  const gradedCourses = data.filter((course) => course.nilai)

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl shadow-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Course Selection
            </h1>
            <p className="text-gray-600 text-lg mt-2 max-w-2xl mx-auto">
              Plan your academic semester with intelligent course management and
              GPA targeting
            </p>
          </div>
        </div>

        {/* Pilih Jurusan */}
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
              <BookOpen className="w-5 h-5 text-gray-700" />
              Select Major
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Badge
                onClick={() => setJurusan('RPL')}
                variant={jurusan === 'RPL' ? 'default' : 'outline'}
                className="cursor-pointer text-base py-2 px-4 transition-all hover:bg-gray-200"
              >
                RPL
              </Badge>
              <Badge
                onClick={() => setJurusan('Informatika')}
                variant={jurusan === 'Informatika' ? 'default' : 'outline'}
                className="cursor-pointer text-base py-2 px-4 transition-all hover:bg-gray-200"
              >
                Informatika
              </Badge>
            </div>
          </CardContent>
        </Card>

        {showAlert && (
          <Alert
            className={`${
              showAlert.type === 'error'
                ? 'border-red-300 bg-red-50'
                : 'border-green-300 bg-green-50'
            } transition-all duration-300`}
          >
            {showAlert.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-700" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-700" />
            )}
            <AlertDescription
              className={
                showAlert.type === 'error' ? 'text-red-800' : 'text-green-800'
              }
            >
              {showAlert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {jurusan && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                    <BookOpen className="w-5 h-5 text-gray-700" />
                    Select Current Semester
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="h-12 text-base border-gray-300 hover:border-gray-400 transition-colors text-gray-900">
                      <SelectValue placeholder="Choose your current semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map((smt) => (
                        <SelectItem
                          key={smt}
                          value={smt}
                          className="text-base py-3 text-gray-900"
                        >
                          {smt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {jurusan && selectedSemester && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                    <Plus className="w-5 h-5 text-gray-700" />
                    Add Additional Course
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Source Semester
                      </label>
                      <Select
                        value={sourceSemester}
                        onValueChange={setSourceSemester}
                      >
                        <SelectTrigger className="h-11 border-gray-300 hover:border-gray-400 transition-colors text-gray-900">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedSemesterOptions.map((smt) => (
                            <SelectItem
                              key={smt}
                              value={smt}
                              className="text-gray-900"
                            >
                              {smt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Available Courses
                      </label>
                      <Select
                        value={selectedCourse}
                        onValueChange={setSelectedCourse}
                      >
                        <SelectTrigger className="h-11 border-gray-300 hover:border-gray-400 transition-colors text-gray-900">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCourses.map((course) => (
                            <SelectItem
                              key={course.kode}
                              value={course.kode}
                              className="text-gray-900"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{course.nama}</span>
                                <Badge
                                  variant="secondary"
                                  className="ml-2 bg-gray-100 text-gray-800"
                                >
                                  {course.sks} SKS
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddCourse}
                    disabled={!sourceSemester || !selectedCourse}
                    className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </CardContent>
              </Card>
            )}

            {data.length > 0 && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xl text-gray-900">
                      <BookOpen className="w-5 h-5 text-gray-700" />
                      Selected Courses ({data.length})
                    </span>
                    <Badge
                      variant="outline"
                      className="text-sm border-gray-300 text-gray-700"
                    >
                      {totalSKS}/24 Credits
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs bg-gray-200 text-gray-800"
                            >
                              {item.kode}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-300 text-gray-600"
                            >
                              {item.sks} SKS
                            </Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.nama}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Select
                            value={item.nilai}
                            onValueChange={(value) =>
                              handleNilaiChange(item.kode, value)
                            }
                          >
                            <SelectTrigger className="w-20 h-9 border-gray-300 text-gray-900">
                              <SelectValue placeholder="—" />
                            </SelectTrigger>
                            <SelectContent>
                              {['A', 'AB', 'B', 'BC', 'C', 'D', 'E'].map(
                                (grade) => (
                                  <SelectItem
                                    key={grade}
                                    value={grade}
                                    className="text-gray-900"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-2 h-2 rounded-full ${getGradeColor(
                                          grade,
                                        )}`}
                                      />
                                      {grade}
                                    </div>
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          {item.nilai && (
                            <Badge className="bg-gray-800 text-white">
                              {item.n.toFixed(1)}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCourse(item.kode)}
                            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Target GPA Section */}
            {data.length > 0 && ungradedCourses.length > 0 && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                    Target GPA Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Target GPA (0.00 - 4.00)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="4"
                      step="0.01"
                      value={targetGPA}
                      onChange={(e) => setTargetGPA(e.target.value)}
                      placeholder="Enter your target GPA"
                      className="h-11 border-gray-300 hover:border-gray-400 transition-colors"
                    />
                  </div>

                  {targetGPA && scenarios.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Analysis Results
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Found <strong>{scenarios.length}</strong> possible
                        scenarios to achieve GPA ≥ {targetGPA}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Showing scenarios ranked from easiest to hardest
                      </p>
                    </div>
                  )}

                  {targetGPA &&
                    scenarios.length === 0 &&
                    parseFloat(targetGPA) > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            No Scenarios Found
                          </span>
                        </div>
                        <p className="text-sm text-red-700">
                          Target GPA of {targetGPA} is not achievable with
                          current course selection.
                        </p>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Grade Scenarios */}
            {scenarios.length > 0 && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xl text-gray-900">
                      <Target className="w-5 h-5 text-gray-700" />
                      Grade Scenarios
                    </span>
                    <Badge
                      variant="outline"
                      className="text-sm border-gray-300 text-gray-700"
                    >
                      Page {currentPage} of {totalPages}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentScenarios.map((scenario, index) => (
                    <div
                      key={startIndex + index}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gray-800 text-white">
                            Scenario {startIndex + index + 1}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            GPA: {scenario.gpa.toFixed(2)}
                          </Badge>
                          <Badge
                            className={`text-white ${getDifficultyColor(scenario.difficulty)}`}
                          >
                            {getDifficultyLabel(scenario.difficulty)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {scenario.totalA > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>A: {scenario.totalA}</span>
                          </div>
                        )}
                        {scenario.totalAB > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span>AB: {scenario.totalAB}</span>
                          </div>
                        )}
                        {scenario.totalB > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>B: {scenario.totalB}</span>
                          </div>
                        )}
                        {scenario.totalBC > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <span>BC: {scenario.totalBC}</span>
                          </div>
                        )}
                        {scenario.totalC > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span>C: {scenario.totalC}</span>
                          </div>
                        )}
                        {scenario.totalD > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span>D: {scenario.totalD}</span>
                          </div>
                        )}
                        {scenario.totalE > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>E: {scenario.totalE}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Required Grades:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {ungradedCourses.map((course) => (
                            <div
                              key={course.kode}
                              className="flex items-center justify-between text-sm bg-gray-50 rounded p-2"
                            >
                              <span className="font-mono text-xs text-gray-600">
                                {course.nama}
                              </span>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${getGradeColor(
                                    scenario.grades[course.kode],
                                  )}`}
                                />
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-200 text-gray-800"
                                >
                                  {scenario.grades[course.kode]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum =
                              Math.max(
                                1,
                                Math.min(totalPages - 4, currentPage - 2),
                              ) + i
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pageNum === currentPage
                                    ? 'default'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            )
                          },
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <Target className="w-5 h-5 text-gray-700" />
                  Credit Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {totalSKS}
                  </span>
                  <span className="text-sm text-gray-500">/ 24 Credits</span>
                </div>
                <Progress value={creditProgress} className="h-3" />
                <div className="text-sm text-gray-600">
                  {24 - totalSKS} credits remaining
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <Award className="w-5 h-5 text-gray-700" />
                  Current GPA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {IPS}
                  </span>
                  <span className="text-sm text-gray-500">/ 4.00</span>
                </div>
                <Progress value={gpaProgress} className="h-3" />
                <div className="text-sm text-gray-600">
                  {Number.parseFloat(IPS) >= 3.5
                    ? 'Excellent'
                    : Number.parseFloat(IPS) >= 3.0
                      ? 'Good'
                      : Number.parseFloat(IPS) >= 2.5
                        ? 'Satisfactory'
                        : 'Needs Improvement'}
                </div>
              </CardContent>
            </Card>

            {data.length > 0 && (
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Courses</span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800"
                    >
                      {data.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Graded Courses
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800"
                    >
                      {gradedCourses.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Ungraded Courses
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800"
                    >
                      {ungradedCourses.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Avg Credits/Course
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800"
                    >
                      {data.length > 0
                        ? (totalSKS / data.length).toFixed(1)
                        : '0'}
                    </Badge>
                  </div>
                  {targetGPA && scenarios.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Possible Scenarios
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {scenarios.length}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
