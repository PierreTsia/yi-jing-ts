import { reactive, toRefs, computed } from 'vue'
import { YiJing } from '~/core/YiJing'
import { HexagramRecord, TrigramRecord } from '~/types/index.type'

enum EnvelopValue {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter',
}

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

  const envelop = computed(() => {
    if (!state.hexagrams.situation) return null
    const [bottom, top] = [state.hexagrams.situation.lines[0], state.hexagrams.situation.lines[5]]
    let result
    switch (bottom) {
      case 1:
        result = top === 0 ? EnvelopValue.Spring : EnvelopValue.Summer
        break
      case 0:
        result = top === 0 ? EnvelopValue.Winter : EnvelopValue.Autumn
        break
    }
    return result
  })

  const start = () => {
    const yijing = new YiJing(state.lines)
    state.hexagrams = { situation: yijing.hexagrams.situation, opposite: yijing.hexagrams.opposite }
    state.trigrams = { top: yijing.trigrams[1], bottom: yijing.trigrams[0] }
  }

  return {
    addLine,
    start,
    envelop,
    ...toRefs(state),
  }
}
