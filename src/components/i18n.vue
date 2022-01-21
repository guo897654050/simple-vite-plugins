<template>
  <form>
    <label>{{ t('language') }}</label>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>
  </form>
  <p>{{ t('hello') }}</p>
  <p>{{ locale}}</p>  
</template>

<script lang="ts" setup>
// import { useI18n } from 'vue-i18n'
import {ref, getCurrentInstance, Ref, computed, ConcreteComponent } from 'vue'

type I18n = ConcreteComponent &  {
  i18n: Record<string, Record<string, string>>
}


type IFunc = () => {
  locale: Ref<string>
  t: (msg: string) => string
}

const ins = getCurrentInstance();

const useI18n: IFunc = () => {
  const locale = ref('en')
  const t = (msg: string) => {
    // console.log(ins)
    const i18n = (ins!.type as I18n).i18n;

    return computed(() => i18n[locale.value][msg]).value

  }
  return { locale, t }
}
const { locale, t } = useI18n()


</script>

<i18n>
{
  "en": {
    "language": "Language",
    "hello": "hello, world!"
  },
  "ja": {
    "language": "言語",
    "hello": "こんにちは、世界！"
  }
}
</i18n>