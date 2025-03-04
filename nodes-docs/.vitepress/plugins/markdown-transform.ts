import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
// import { docRoot, docsDirName, projRoot } from '@element-plus/build-utils'
// import { REPO_BRANCH, REPO_PATH } from '@element-plus/build-constants'
// import { getLang, languages } from '../utils/lang'
// import footerLocale from '../i18n/component/footer.json'

import type { Plugin } from 'vite'
import { docRoot, root } from '../utils'

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

let compPaths: string[]

export function MarkdownTransform(): Plugin {
  return {
    name: 'icc-sass-md-transform',

    enforce: 'pre',

    async buildStart() {
      const pattern = `components`

      compPaths = await glob(pattern, {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      })
    },

    async transform(code, id) {
      if (!id.endsWith('.md')) return
      if (/---\.*layout\s*:\s*home/ig.test(code)) return
      if (code.includes('layout: home')) return

      const componentId = path.basename(id, '.md')
      console.log('🚀 ~ file: markdown-transform.ts:36 ~ transform ~ componentId:', componentId)

      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `import { useData } from 'vitepress'`,
          `const demos = import.meta.glob('../examples/${componentId}/*.vue', { eager: true })`,
          `const { site, theme, page, frontmatter } = useData()`
        ],
      }

      code = transformVpScriptSetup(code, append)

      if (compPaths.some((compPath) => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append)
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers
      )
    },
  }
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`

const combineMarkdown = (
  code: string,
  headers: string[],
  footers: string[]
) => {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  code += footers.join('\n')

  return `${code}\n`
}

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE)
  if (matches) code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup) append.scriptSetups.push(scriptSetup)
  return code
}

const GITHUB_BLOB_URL = 'GITHUB_BLOB_URL' //`https://github.com/${REPO_PATH}/blob/${REPO_BRANCH}`
const GITHUB_TREE_URL = 'GITHUB_TREE_URL'//`https://github.com/${REPO_PATH}/tree/${REPO_BRANCH}`
const transformComponentMarkdown = (
  id: string,
  componentId: string,
  code: string,
  append: Append
) => {
  const lang = ''//getLang(id)
  const docUrl = ''//`${GITHUB_BLOB_URL}/${docsDirName}/en-US/component/${componentId}.md`
  const componentUrl = `${GITHUB_TREE_URL}/packages/components/${componentId}`
  const componentPath = path.resolve(
    root,
    `packages/components/${componentId}`
  )
  const isComponent = fs.existsSync(componentPath)

  const links = [[/*footerLocale[lang].docs,*/'', docUrl]]
  if (isComponent) links.unshift([/*footerLocale[lang].component*/'', componentUrl])
  const linksText = links
    .filter((i) => i)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ')

  const sourceSection = `
## footer source

${linksText}`

  const contributorsSection = `
## contributors

<Contributors id="${componentId}" />`

  append.footers.push(sourceSection, isComponent ? contributorsSection : '')

  return code
}
