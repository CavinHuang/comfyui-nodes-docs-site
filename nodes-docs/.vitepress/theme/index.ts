// https://vitepress.dev/guide/custom-theme
import { Component, h, watch } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'


// custom
import './styles/css-vars.scss'
import './styles/index.scss'
import 'uno.css'

import HomePage from './components/HomePage.vue'
import VPDemo from './components/vp-demo.vue'
import CareTop from './components/icons/CareTop.vue'
import PreviewList from './components/PreviewList.vue'

let homePageStyle: HTMLStyleElement | undefined

const globals: [string, Component][] = [
  ['Demo', VPDemo],
  ['CareTop', CareTop],
  ['PreviewList', PreviewList],
  // ['IconList', IconList],
  // ['ApiTyping', ApiTyping],
  // ['FunctionType', ApiFunctionType],
  // ['EnumType', ApiEnumType],
  // ['BooleanType', ApiBooleanType],
  // ['StringType', ApiStringType],
  // ['NumberType', ApiNumberType],
  // ['RefType', ApiRefType],
  // ['ExternalType', ApiExternalType],
]


export default {
  extends: DefaultTheme,
  Layout: () => {
    // return h(DefaultTheme.Layout, null, {
    //   // https://vitepress.dev/guide/extending-default-theme#layout-slots
    // })
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(HomePage),
    })
  },
  enhanceApp({ app, router, siteData }) {
    if (typeof window === 'undefined') return
    // console.log(app, isDark)
    // watch(() => {}, () => {},)

    watch(
      () => router.route.data.relativePath,
      () => updateHomePageStyle(location.pathname === '/'),
      { immediate: true }
    )
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  }
} satisfies Theme


// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}