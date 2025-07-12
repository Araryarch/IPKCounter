'use client'

import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { JurusanType } from '@/types/data'
import { allMataKuliah } from '../data/matkul'

interface MajorSelectionProps {
  jurusan: JurusanType | ''
  setJurusan: (jurusan: JurusanType) => void
}

export function MajorSelection({ jurusan, setJurusan }: MajorSelectionProps) {
  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <BookOpen className="w-5 h-5 text-gray-700" />
          Select Major
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {Object.keys(allMataKuliah).map((key) => (
            <Badge
              key={key}
              onClick={() => setJurusan(key as JurusanType)}
              variant={jurusan === key ? 'default' : 'outline'}
              className="cursor-pointer text-base py-2 px-4 transition-all hover:bg-gray-200"
            >
              {key}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
