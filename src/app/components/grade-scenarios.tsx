'use client'

import React from 'react'
import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

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
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [pageInput, setPageInput] = useState<string>(currentPage.toString())

  React.useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [difficultyFilter, setCurrentPage])

  if (scenarios.length === 0) return null

  const filteredScenarios = scenarios.filter((scenario) => {
    if (difficultyFilter === 'all') return true
    const difficulty = scenario.difficulty
    switch (difficultyFilter) {
      case 'very-easy':
        return difficulty <= 2
      case 'easy':
        return difficulty > 2 && difficulty <= 4
      case 'moderate':
        return difficulty > 4 && difficulty <= 6
      case 'hard':
        return difficulty > 6 && difficulty <= 8
      case 'very-hard':
        return difficulty > 8
      default:
        return true
    }
  })

  const totalPages = Math.ceil(filteredScenarios.length / SCENARIOS_PER_PAGE)
  const startIndex = (currentPage - 1) * SCENARIOS_PER_PAGE
  const endIndex = startIndex + SCENARIOS_PER_PAGE
  const currentScenarios = filteredScenarios.slice(startIndex, endIndex)

  const handlePageInputChange = (value: string) => {
    setPageInput(value)
  }

  const handlePageInputSubmit = () => {
    const page = Number.parseInt(pageInput)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit()
    }
  }

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
      <div className="px-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filter by Difficulty:
            </span>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-40 h-9 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="very-easy">Very Easy</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="very-hard">Very Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {filteredScenarios.length} of {scenarios.length} scenarios
            </span>
          </div>
        </div>
      </div>
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                First
              </Button>
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
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page</span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={(e) => handlePageInputChange(e.target.value)}
                onBlur={handlePageInputSubmit}
                onKeyPress={handleKeyPress}
                className="w-16 h-8 text-center text-sm"
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
