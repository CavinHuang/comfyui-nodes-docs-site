import { defineConfig } from 'vitepress'
import head from './config/head'
import { metaData } from './config/constants'
import { mdPlugin } from './config/plugin'
import type { DefaultTheme } from 'vitepress'
import { sideBar } from './config/sidebar'

const Nav: DefaultTheme.NavItem[] = [
  { text: '指南', link: '/guide/' },
  { text: '节点文档', link: '/nodes-docs/' },
  { text: '工作流', link: '/workflows/' },
  { text: '教程', link: '/tutorial/' },
]

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guide',
      collapsed: true,
      items: [
        {
          text: '介绍',
          link: '/guide/',
        },
        {
          text: '参与共建',
          link: '/guide/contributing',
        },
      ],
    },
  ]
}

function sidebarNodeDocs():DefaultTheme.SidebarItem[] {
  return [
    // {
    //   text: '基础组件',
    //   collapsed: false,
    //   items: sidebarBasicComponentConfig,
    // },
    // {
    //   text: '业务组件',
    //   collapsed: false,
    //   items: sidebarBusinessComponentConfig,
    // },
  ]
}

function sidebarWorkflows():DefaultTheme.SidebarItem[] {
  return [
    {
      text: '模板',
      collapsed: true,
      items: [
        {
          text: '基础配置',
          link: '/guide/config/',
        },
      ],
    },
  ]
}

const sidebar: DefaultTheme.Config['sidebar'] = {
  '/guide/': sidebarGuide(),
  '/nodes-docs/': sideBar,
  '/workflows/': sidebarWorkflows(),
  '/tutorial/': []
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head,
  ...metaData,
  title: "Comfyui Node Docs",
  description: "comfyui docs",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: [
    /^\/play/,
    /^\/interactive/,
    /:\/\/localhost/,
  ],
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config: (md) => mdPlugin(md),
  },
  appearance: {
    valueLight: 'theme-light'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',

    search: {
      provider: 'local',
    },
    
    nav: Nav,

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the ownner License.',
      copyright: 'Copyright © 2021-PRESENT icc grow'
    }
  }
})
