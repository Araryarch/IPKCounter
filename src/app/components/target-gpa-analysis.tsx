'use client'

import { useState } from 'react'
import { z } from 'zod'
import { TrendingUp, Calculator, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const gpaSchema = z.string().refine(
  (val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0 && num <= 4
  },
  {
    message: 'GPA harus antara 0.00 dan 4.00',
  },
)

interface TargetGPAAnalysisProps {
  targetGPA: string
  setTargetGPA: (gpa: string) => void
  scenariosLength: number
}

export function TargetGPAAnalysis({
  targetGPA,
  setTargetGPA,
  scenariosLength,
}: TargetGPAAnalysisProps) {
  const [inputGPA, setInputGPA] = useState(targetGPA)
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    const parsed = gpaSchema.safeParse(inputGPA)

    if (!parsed.success) {
      setError(parsed.error.errors[0].message)
      setAnalyzed(false)
      return
    }

    setError('')
    setLoading(true)
    setAnalyzed(false)
    setTimeout(() => {
      setTargetGPA(inputGPA)
      setLoading(false)
      setAnalyzed(true)
    }, 1000)
  }

  const showResults = analyzed && scenariosLength > 0
  const showNoResults =
    analyzed && scenariosLength === 0 && Number.parseFloat(inputGPA) > 0

  return (
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
            value={inputGPA}
            onChange={(e) => setInputGPA(e.target.value)}
            placeholder="Enter your target GPA"
            className="h-11 border-gray-300 hover:border-gray-400 transition-colors"
          />
          {error && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {error}
            </p>
          )}
        </div>

        <Button onClick={handleAnalyze} disabled={loading} className="w-full">
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>

        {loading && <Skeleton className="h-16 w-full rounded-lg" />}

        {showResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Analysis Results
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Found <strong>{scenariosLength}</strong> possible scenarios to
              achieve GPA ≥ {inputGPA}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Showing scenarios ranked from easiest to hardest
            </p>
          </div>
        )}

        {showNoResults && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                No Scenarios Found
              </span>
            </div>
            <p className="text-sm text-red-700">
              Target GPA of {inputGPA} is not achievable with current course
              selection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
