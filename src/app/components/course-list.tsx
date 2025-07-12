'use client'

import { BookOpen, Trash2 } from 'lucide-react'
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
import type { CourseData } from '@/types/data'
import { getGradeColor, GRADES } from '@/constants/convert'

interface CourseListProps {
  data: CourseData[]
  totalSKS: number
  onNilaiChange: (kode: string, nilai: string) => void
  onRemoveCourse: (kode: string) => void
}

export function CourseList({
  data,
  totalSKS,
  onNilaiChange,
  onRemoveCourse,
}: CourseListProps) {
  if (data.length === 0) return null

  return (
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
                  onValueChange={(value) => onNilaiChange(item.kode, value)}
                >
                  <SelectTrigger className="w-20 h-9 border-gray-300 text-gray-900">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
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
                    ))}
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
                  onClick={() => onRemoveCourse(item.kode)}
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
  )
}
