'use client'

import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { JurusanType } from '@/types/data'

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
        <div className="flex gap-4">
          <Badge
            onClick={() => setJurusan('RPL')}
            variant={jurusan === 'RPL' ? 'default' : 'outline'}
            className="cursor-pointer text-base py-2 px-4 transition-all hover:bg-gray-200"
          >
            RPL
          </Badge>
          <Badge
            onClick={() => setJurusan('Informatika')}
            variant={jurusan === 'Informatika' ? 'default' : 'outline'}
            className="cursor-pointer text-base py-2 px-4 transition-all hover:bg-gray-200"
          >
            Informatika
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
