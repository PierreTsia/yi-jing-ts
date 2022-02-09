import { reactive, toRefs } from 'vue'
import { YiJing } from '~/core/YiJing'
import { Envelop, HexagramRecord, TrigramRecord } from '~/types/index.type'

type HexagramState = {
  lines: number[]
  hexagrams: { situation: HexagramRecord | null; opposite: HexagramRecord | null; nucleus: HexagramRecord | null }
  trigrams: {
    top: TrigramRecord | null
    bottom: TrigramRecord | null
  }
  envelop: Envelop | null
}
const state: HexagramState = reactive({
  lines: [0, 0, 0, 0, 0, 0],
  hexagrams: {
    situation: null,
    opposite: null,
    nucleus: null,
  },
  trigrams: {
    top: null,
    bottom: null,
  },
  envelop: null,
})

export const useHexagrams = () => {
  const addLine = (value: number, index: number) => {
    state.lines[index] = value
  }

  const start = () => {
    const yijing = new YiJing(state.lines)
    state.hexagrams = {
      situation: yijing.hexagrams.situation,
      opposite: yijing.hexagrams.opposite,
      nucleus: yijing.hexagrams.nucleus,
    }
    state.trigrams = { top: yijing.trigrams[1], bottom: yijing.trigrams[0] }
    state.envelop = yijing.envelop
  }

  return {
    addLine,
    start,
    ...toRefs(state),
  }
}
