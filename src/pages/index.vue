<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/stores/user'
import Hexagram from '~/components/Hexagram.vue'
import { useHexagrams, useDraw } from '~/composables'

export default defineComponent({
  components: {
    Hexagram,
  },
  setup() {
    const user = useUserStore()
    const name = ref(user.savedName)
    const { draw, isValid, isTooLong, isAllValidNumbers, isFullLength } = useDraw()

    const { lines, addLine, hexagrams, trigrams, envelop, areAllHexagramsFound } = useHexagrams()

    const types = ['top', 'bottom']
    const hexagramTypes = ['situation', 'nucleus', 'perspective', 'opposite']

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
      hexagrams,
      trigrams,
      draw,
      isValid,
      isFullLength,
      isAllValidNumbers,
      isTooLong,
      envelop,
      types,
      hexagramTypes,
      areAllHexagramsFound,
    }
  },
})
</script>

<template>
  <div>
    <p class="text-4xl">
      <icon-park-outline-chinese class="inline-block text-red-600" />
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
              class="inputCoin"
              :class="{
                'border-red-500': isTooLong || (draw && !isAllValidNumbers) || (isFullLength && !isValid),
                'border-green-500': isValid,
              }"
              type="number"
              name="search"
              :placeholder="t('coin.input.placeholder')" />
          </div>
        </div>
        <div v-if="areAllHexagramsFound" class="grid grid-cols-2">
          <div
            v-for="(type, i) in hexagramTypes"
            :key="i"
            class="flex flex-col justify-start items-center py-6"
            :class="{ 'col-span-full': type === 'situation' || type === 'opposite' }">
            <p class="font-bold text-md md:text-lg dark:text-red-500 text-center mb-2">
              {{ t(`hexagrams.type.${type}`) }} :
            </p>
            <h1 class="text-2xl md:text-4xl">{{ hexagrams[type].chineseName }} {{ hexagrams[type].pinyinName }}</h1>
            <h1 class="text-xl md:text-2xl dark:text-gray-400">
              {{ t(`hexagrams.desc.${hexagrams[type].number}`) }}
            </h1>
            <h3 class="text-md md:text-lg">{{ hexagrams[type].number }}</h3>
          </div>
        </div>

        <div v-if="trigrams.top && trigrams.bottom" class="flex flex-col md:flex-row">
          <div v-for="type in types" :key="type" class="w-full md:w-1/2">
            <h4 class="font-bold text-md md:text-lg dark:text-red-500 font-bold">{{ t(`trigrams.${type}.name`) }}</h4>
            <p>{{ trigrams[type]?.pinyinName }} - {{ trigrams[type]?.chineseName }}</p>
            <p>( {{ trigrams[type]?.number }} )</p>
            <span class="p-6 block text-justify dark:text-gray-200">{{
              t(`trigrams.desc.${trigrams[type]?.number}`)
            }}</span>
          </div>
        </div>
        <div v-if="hexagrams.situation" class="flex flex-col">
          <h4 class="text-lg dark:text-red-500 text-center font-bold w-full mt-6 px-4">{{ t(`envelop.title`) }}</h4>
          <h4 class="text-md dark:text-gray-400">{{ t(`envelop.desc`) }}</h4>
          <span class="p-6 block text-justify dark:text-gray-200">{{ t(`envelop.values.${envelop}`) }}</span>
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
.inputCoin {
  @apply border-2 border-primary transition h-12 px-5 pr-16 rounded-md focus:outline-none w-full text-black text-lg;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
