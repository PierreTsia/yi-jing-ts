<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/stores/user'
import Hexagram from '~/components/Hexagram.vue'
import { useHexagrams } from '~/composables/hexagrams'

type Args = { score: number; index: number }

export default defineComponent({
  components: {
    Hexagram,
  },
  setup() {
    const user = useUserStore()
    const name = ref(user.savedName)
    const draw = ref(null)
    const drawNumbersArray = computed(() => [...`${draw.value}`].map(Number))
    const { lines, addLine, hexagrams, trigrams } = useHexagrams()
    const updateLines = ({ score, index }: Args) => {
      addLine(score, index)
    }

    watch(
      () => drawNumbersArray.value,
      () => {
        if (isAllValidNumbers.value) {
          const lastIndex = drawNumbersArray.value.length - 1
          addLine(drawNumbersArray.value[lastIndex], lastIndex)
        }
      }
    )

    const isValid = computed(() => isFullLength.value && isAllValidNumbers.value)
    const isFullLength = computed(() => drawNumbersArray.value.length === 6)
    const isAllValidNumbers = computed(() => drawNumbersArray.value.every((n) => n >= 6 && n <= 9))
    const router = useRouter()
    const go = () => {
      if (name.value) router.push(`/hi/${encodeURIComponent(name.value)}`)
    }

    const { t } = useI18n()
    return {
      t,
      name,
      go,
      lines,
      addLine,
      updateLines,
      hexagrams,
      trigrams,
      draw,
      isValid,
      isFullLength,
      isAllValidNumbers,
    }
  },
})
</script>

<template>
  <div>
    <p class="text-4xl">
      <icon-park-outline-chinese class="inline-block text-red-800" />
    </p>
    <p>Yi-Jing</p>
    <p>
      <em class="text-sm opacity-75">{{ t('intro.desc') }}</em>
    </p>

    <div class="flex flex-col">
      <div class="my-10 w-30 h-30 flex mx-auto">
        <Hexagram :lines="lines" />
      </div>

      <div class="md:ml-6">
        <div class="w-full flex flex-col md:flex-row justify-center items-center md:items-start p-6">
          <div class="w-full md:w-1/2 md:mx-auto">
            <input
              v-model="draw"
              class="border-2 border-primary transition h-12 px-5 pr-16 rounded-md focus:outline-none w-full text-black text-lg"
              :class="{
                'border-red-500': (draw && !isAllValidNumbers) || (isFullLength && !isValid),
                'border-green-500': isValid,
              }"
              type="number"
              name="search"
              :placeholder="t('coin.input.placeholder')" />
          </div>
        </div>
        <div v-if="hexagrams.situation" class="flex flex-col justify-center items-center py-6">
          <p class="text-xs dark:text-gray-200 text-center mb-2">Hexagramme de situation :</p>
          <h1 class="text-4xl">{{ hexagrams.situation.chineseName }} {{ hexagrams.situation.pinyinName }}</h1>
          <h1 class="text-2xl dark:text-gray-400">
            {{ t(`hexagrams.desc.${hexagrams.situation.number}`) }}
          </h1>
          <h3 class="text-lg">{{ hexagrams.situation.number }}</h3>
        </div>
        <div v-if="hexagrams.opposite" class="flex flex-col justify-center items-center py-6">
          <p class="text-xs dark:text-gray-200 text-center mb-2">Hexagramme opposé :</p>
          <h1 class="text-4xl">{{ hexagrams.opposite.chineseName }} {{ hexagrams.opposite.pinyinName }}</h1>
          <h1 class="text-2xl dark:text-gray-400">
            {{ t(`hexagrams.desc.${hexagrams.opposite.number}`) }}
          </h1>
          <h3 class="text-lg">{{ hexagrams.opposite.number }}</h3>
        </div>
        <div v-if="trigrams.top && trigrams.bottom" class="flex flex-col md:flex-row">
          <div v-for="type in ['top', 'bottom']" class="w-full md:w-1/2">
            <h4 class="text-lg font-bold">{{ t(`trigrams.${type}.name`) }}</h4>
            <p>{{ trigrams[type].pinyinName }} - {{ trigrams[type].chineseName }}</p>
            <p>( {{ trigrams[type].number }} )</p>
            <span class="p-6 block text-justify dark:text-gray-400">{{
              t(`trigrams.desc.${trigrams[type].number}`)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
