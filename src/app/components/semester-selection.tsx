'use client'

import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SemesterSelectionProps {
  selectedSemester: string
  setSelectedSemester: (semester: string) => void
  semesterOptions: string[]
}

export function SemesterSelection({
  selectedSemester,
  setSelectedSemester,
  semesterOptions,
}: SemesterSelectionProps) {
  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <BookOpen className="w-5 h-5 text-gray-700" />
          Select Current Semester
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
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
  )
}
