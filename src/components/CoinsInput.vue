<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  name: 'CoinsInput',
  props: { line: { type: Number, default: 0 }, index: { type: Number, default: 0 } },
  setup(props, { emit }) {
    const score = ref(0)
    watch(
      () => props.line,
      (val) => {
        score.value = val
      },
      { immediate: true }
    )

    watch(
      () => score.value,
      (val) => {
        if (/*val !== score.value && */ val >= 6 && val <= 9) {
          console.log('emit')
          emit('onChange', { score: val, index: props.index })
        }
      }
    )

    return {
      score,
    }
  },
})
</script>

<template>
  <div class="flex flex-row h-10 min-w-20 max-w-20 w-full rounded-lg relative bg-transparent mt-1 justify-center m-4">
    <input type="number" class="numberInput w-full" name="custom-input-number" v-model="score" />
  </div>
</template>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.numberInput {
  @apply outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none;
}
</style>
