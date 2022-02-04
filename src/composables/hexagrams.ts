import { Ref, ref, watch } from 'vue'
import { YiJing } from '~/core/YiJing'
import { HexagramRecord, TrigramRecord } from '~/types/index.type'

export const useHexagrams = () => {
  const lines: Ref<number[]> = ref([0, 0, 0, 0, 0, 0])
  const hexagrams: Ref<{ situation: HexagramRecord | null; opposite: HexagramRecord | null }> = ref({
    situation: null,
    opposite: null,
  })

  const trigrams: Ref<{ top: TrigramRecord | null; bottom: TrigramRecord | null }> = ref({
    top: null,
    bottom: null,
  })
  const addLine = (value: number, index: number) => {
    lines.value[index] = value
  }

  const start = () => {
    const yijing = new YiJing(lines.value)
    hexagrams.value = { situation: yijing.hexagrams.situation, opposite: yijing.hexagrams.opposite }
    trigrams.value = { top: yijing.trigrams[1], bottom: yijing.trigrams[0] }
  }

  watch(
    () => lines.value,
    (value) => {
      if (value.every((n) => n >= 6 && n <= 9)) {
        start()
      }
    },
    { deep: true }
  )
  return {
    lines,
    addLine,
    start,
    hexagrams,
    trigrams,
  }
}
