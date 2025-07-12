'use client'

import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CourseAdditionProps {
  sourceSemester: string
  setSourceSemester: (semester: string) => void
  selectedCourse: string
  setSelectedCourse: (course: string) => void
  allowedSemesterOptions: string[]
  availableCourses: { kode: string; nama: string; sks: number }[]
  onAddCourse: () => void
}

export function CourseAddition({
  sourceSemester,
  setSourceSemester,
  selectedCourse,
  setSelectedCourse,
  allowedSemesterOptions,
  availableCourses,
  onAddCourse,
}: CourseAdditionProps) {
  return (
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
            <Select value={sourceSemester} onValueChange={setSourceSemester}>
              <SelectTrigger className="h-11 border-gray-300 hover:border-gray-400 transition-colors text-gray-900">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {allowedSemesterOptions.map((smt) => (
                  <SelectItem key={smt} value={smt} className="text-gray-900">
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
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
          onClick={onAddCourse}
          disabled={!sourceSemester || !selectedCourse}
          className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </CardContent>
    </Card>
  )
}
