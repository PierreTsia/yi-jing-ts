import { Ref, ref, watch } from 'vue'
import { YiJing } from '~/core/YiJing'
import { HexagramRecord } from '~/types/index.type'

export const useHexagrams = () => {
  const lines: Ref<number[]> = ref([6, 0, 0, 0, 0, 0])
  const hexagrams: Ref<{ situation: HexagramRecord | null; opposite: HexagramRecord | null }> = ref({
    situation: null,
    opposite: null,
  })
  const addLine = (value: number, index: number) => {
    lines.value[index] = value
  }

  const start = () => {
    const yijing = new YiJing(lines.value)
    console.log(yijing.hexagrams)
    hexagrams.value = { situation: yijing.hexagrams.situation, opposite: yijing.hexagrams.opposite }
  }

  watch(
    () => lines.value,
    (value) => {
      console.log(value)
      if (value.every((n) => n >= 6 && n <= 9)) {
        console.log('gogogo')
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
  }
}
