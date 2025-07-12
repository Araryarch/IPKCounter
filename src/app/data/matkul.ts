import { JurusanType } from '@/types/data'
import { mataKuliahInformatika } from './matkul-informatika'
import { mataKuliahRPL } from './matkul-rpl'

export const allMataKuliah: Record<JurusanType, typeof mataKuliahRPL> = {
  RPL: mataKuliahRPL,
  Informatika: mataKuliahInformatika,
}
