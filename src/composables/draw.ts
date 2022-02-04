import { computed, ref, watch } from 'vue'
import { useHexagrams } from '~/composables'

export const useDraw = () => {
  const { addLine, start } = useHexagrams()
  const draw = ref(null)
  const drawNumbersArray = computed(() => [...`${draw.value ?? 0}`].map(Number))

  const isValid = computed(() => isFullLength.value && isAllValidNumbers.value)
  const isFullLength = computed(() => drawNumbersArray.value.length === 6)
  const isTooLong = computed(() => drawNumbersArray.value.length > 6)
  const isAllValidNumbers = computed(() => drawNumbersArray.value.every((n) => n >= 6 && n <= 9))

  watch(
    () => drawNumbersArray.value,
    (newVal) => {
      if (isAllValidNumbers.value && drawNumbersArray.value.length <= 6) {
        newVal.forEach((number, i) => {
          addLine(number, i)
        })
        if (isValid.value) {
          start()
        }
      }
    },
    { deep: true }
  )

  return {
    draw,
    drawNumbersArray,
    isValid,
    isFullLength,
    isTooLong,
    isAllValidNumbers,
  }
}
