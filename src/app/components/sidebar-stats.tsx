import { Target, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { CourseData } from '@/types/data'
import { MAX_CREDITS } from '@/constants/convert'

interface SidebarStatsProps {
  data: CourseData[]
  totalSKS: number
  IPS: string
  gradedCourses: CourseData[]
  ungradedCourses: CourseData[]
  targetGPA: string
  scenariosLength: number
}

export function SidebarStats({
  data,
  totalSKS,
  IPS,
  gradedCourses,
  ungradedCourses,
  targetGPA,
  scenariosLength,
}: SidebarStatsProps) {
  const creditProgress = (totalSKS / MAX_CREDITS) * 100
  const gpaProgress = (Number.parseFloat(IPS) / 4) * 100

  const getGPAStatus = (ips: string) => {
    const gpa = Number.parseFloat(ips)
    if (gpa >= 3.5) return 'Excellent'
    if (gpa >= 3.0) return 'Good'
    if (gpa >= 2.5) return 'Satisfactory'
    return 'Needs Improvement'
  }

  return (
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
            <span className="text-2xl font-bold text-gray-900">{totalSKS}</span>
            <span className="text-sm text-gray-500">
              / {MAX_CREDITS} Credits
            </span>
          </div>
          <Progress value={creditProgress} className="h-3" />
          <div className="text-sm text-gray-600">
            {MAX_CREDITS - totalSKS} credits remaining
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
            <span className="text-2xl font-bold text-gray-900">{IPS}</span>
            <span className="text-sm text-gray-500">/ 4.00</span>
          </div>
          <Progress value={gpaProgress} className="h-3" />
          <div className="text-sm text-gray-600">{getGPAStatus(IPS)}</div>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-900">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Courses</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {data.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Graded Courses</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {gradedCourses.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ungraded Courses</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {ungradedCourses.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Credits/Course</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {data.length > 0 ? (totalSKS / data.length).toFixed(1) : '0'}
              </Badge>
            </div>
            {targetGPA && scenariosLength > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Possible Scenarios
                </span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {scenariosLength}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
