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
import { mataKuliah } from './data/matkul'

interface CourseData {
  kode: string
  nama: string
  sks: number
  nilai: string
  n: number
}

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

const getAllowedSemesters = (current: string): string[] => {
  const currentNumber = Number.parseInt(current.split(' ')[1])
  const parity = currentNumber % 2
  return Object.keys(mataKuliah).filter((smt) => {
    const num = Number.parseInt(smt.split(' ')[1])
    if (num === currentNumber) return false
    if (num > currentNumber) return num % 2 === parity
    return true
  })
}

export default function CourseSelectionApp() {
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [sourceSemester, setSourceSemester] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [data, setData] = useState<CourseData[]>([])
  const [showAlert, setShowAlert] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

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
  }, [selectedSemester])

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
    ? getAllowedSemesters(selectedSemester)
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
              Plan your academic semester with intelligent course management
            </p>
          </div>
        </div>

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

            {selectedSemester && (
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
                                        className={`w-2 h-2 rounded-full ${getGradeColor(grade)}`}
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
                      {data.filter((item) => item.nilai).length}
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
