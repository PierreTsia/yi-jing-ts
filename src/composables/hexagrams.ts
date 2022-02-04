import { reactive, toRefs } from 'vue'
import { YiJing } from '~/core/YiJing'
import { HexagramRecord, TrigramRecord } from '~/types/index.type'

type HexagramState = {
  lines: number[]
  hexagrams: { situation: HexagramRecord | null; opposite: HexagramRecord | null }
  trigrams: {
    top: TrigramRecord | null
    bottom: TrigramRecord | null
  }
}
const state: HexagramState = reactive({
  lines: [0, 0, 0, 0, 0, 0],
  hexagrams: {
    situation: null,
    opposite: null,
  },
  trigrams: {
    top: null,
    bottom: null,
  },
})

export const useHexagrams = () => {
  const addLine = (value: number, index: number) => {
    state.lines[index] = value
  }

  const start = () => {
    const yijing = new YiJing(state.lines)
    state.hexagrams = { situation: yijing.hexagrams.situation, opposite: yijing.hexagrams.opposite }
    state.trigrams = { top: yijing.trigrams[1], bottom: yijing.trigrams[0] }
  }

  return {
    addLine,
    start,
    ...toRefs(state),
  }
}
