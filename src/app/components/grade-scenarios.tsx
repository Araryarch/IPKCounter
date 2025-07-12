'use client'

import { Target, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { GradeScenario, CourseData } from '@/types/data'
import {
  getGradeColor,
  getDifficultyColor,
  getDifficultyLabel,
  SCENARIOS_PER_PAGE,
} from '@/constants/convert'

interface GradeScenariosProps {
  scenarios: GradeScenario[]
  ungradedCourses: CourseData[]
  currentPage: number
  setCurrentPage: (page: number) => void
}

export function GradeScenarios({
  scenarios,
  ungradedCourses,
  currentPage,
  setCurrentPage,
}: GradeScenariosProps) {
  if (scenarios.length === 0) return null

  const totalPages = Math.ceil(scenarios.length / SCENARIOS_PER_PAGE)
  const startIndex = (currentPage - 1) * SCENARIOS_PER_PAGE
  const endIndex = startIndex + SCENARIOS_PER_PAGE
  const currentScenarios = scenarios.slice(startIndex, endIndex)

  return (
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
                        className={`w-2 h-2 rounded-full ${getGradeColor(scenario.grades[course.kode])}`}
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
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
  )
}
