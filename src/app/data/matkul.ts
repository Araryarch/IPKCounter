import { JurusanType } from '@/types/data'
import { mataKuliahInformatika } from './matkul-informatika'
import { mataKuliahRPL } from './matkul-rpl'
import { mataKuliahRKA } from './matkul-rka'

export const allMataKuliah: Record<JurusanType, typeof mataKuliahRPL> = {
  RPL: mataKuliahRPL,
  Informatika: mataKuliahInformatika,
  RKA: mataKuliahRKA,
}
