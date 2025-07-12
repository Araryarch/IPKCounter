'use client'

import { useEffect, useState, useMemo } from 'react'
import { GraduationCap } from 'lucide-react'

import type {
  CourseData,
  GradeScenario,
  JurusanType,
  AlertState,
} from '@/types/data'
import { nilaiToAngka, MAX_CREDITS } from '@/constants/convert'
import { getAllowedSemesters, generateGradeScenarios } from '@/lib/scenario'
import { mataKuliahRPL } from './data/matkul-rpl'
import { mataKuliahInformatika } from './data/matkul-informatika'

import { MajorSelection } from './components/major-selection'
import { SemesterSelection } from './components/semester-selection'
import { CourseAddition } from './components/course-addition'
import { CourseList } from './components/course-list'
import { TargetGPAAnalysis } from './components/target-gpa-analysis'
import { GradeScenarios } from './components/grade-scenarios'
import { SidebarStats } from './components/sidebar-stats'
import { AlertNotification } from './components/alert-notification'

export default function CourseSelectionApp() {
  const [jurusan, setJurusan] = useState<JurusanType | ''>('RPL')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [sourceSemester, setSourceSemester] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [data, setData] = useState<CourseData[]>([])
  const [targetGPA, setTargetGPA] = useState<string>('')
  const [scenarios, setScenarios] = useState<GradeScenario[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showAlert, setShowAlert] = useState<AlertState | null>(null)

  const mataKuliah = useMemo(
    () =>
      jurusan === 'RPL'
        ? mataKuliahRPL
        : jurusan === 'Informatika'
          ? mataKuliahInformatika
          : {},
    [jurusan],
  )

  // Reset state when major changes
  useEffect(() => {
    setSelectedSemester('')
    setSourceSemester('')
    setSelectedCourse('')
    setData([])
    setTargetGPA('')
    setScenarios([])
  }, [jurusan])

  // Load courses when semester changes
  useEffect(() => {
    if (!selectedSemester) return

    const courses = mataKuliah[selectedSemester] || []
    const filteredCourses: CourseData[] = []
    let sksAdded = 0

    for (const c of courses) {
      if (sksAdded + c.sks > MAX_CREDITS) break
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

  // Generate scenarios when target GPA or data changes
  useEffect(() => {
    if (!targetGPA || data.length === 0) {
      setScenarios([])
      return
    }

    const target = Number.parseFloat(targetGPA)
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
    if (totalSKS + course.sks > MAX_CREDITS) {
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

  // Computed values
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

  const ungradedCourses = data.filter((course) => !course.nilai)
  const gradedCourses = data.filter((course) => course.nilai)

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
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

        {/* Major Selection */}
        <MajorSelection jurusan={jurusan} setJurusan={setJurusan} />

        {/* Alert Notification */}
        <AlertNotification alert={showAlert} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Semester Selection */}
            {jurusan && (
              <SemesterSelection
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
                semesterOptions={semesterOptions}
              />
            )}

            {/* Course Addition */}
            {jurusan && selectedSemester && (
              <CourseAddition
                sourceSemester={sourceSemester}
                setSourceSemester={setSourceSemester}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                allowedSemesterOptions={allowedSemesterOptions}
                availableCourses={availableCourses}
                onAddCourse={handleAddCourse}
              />
            )}

            {/* Course List */}
            <CourseList
              data={data}
              totalSKS={totalSKS}
              onNilaiChange={handleNilaiChange}
              onRemoveCourse={handleRemoveCourse}
            />

            {/* Target GPA Analysis */}
            {data.length > 0 && ungradedCourses.length > 0 && (
              <TargetGPAAnalysis
                targetGPA={targetGPA}
                setTargetGPA={setTargetGPA}
                scenariosLength={scenarios.length}
              />
            )}

            {/* Grade Scenarios */}
            <GradeScenarios
              scenarios={scenarios}
              ungradedCourses={ungradedCourses}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Sidebar Stats */}
          <SidebarStats
            data={data}
            totalSKS={totalSKS}
            IPS={IPS}
            gradedCourses={gradedCourses}
            ungradedCourses={ungradedCourses}
            targetGPA={targetGPA}
            scenariosLength={scenarios.length}
          />
        </div>
      </div>
    </div>
  )
}
