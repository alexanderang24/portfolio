import { Marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import properties from 'highlight.js/lib/languages/properties'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'

hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('properties', properties)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('python', python)

function postProcess(html) {
  // Wrap string literals inside hljs-meta (annotation args) as hljs-string
  html = html.replace(
    /(<span class="hljs-meta">[^<]*?)(&quot;[^&]*?&quot;)(.*?<\/span>)/g,
    (match, before, str, after) =>
      `${before}<span class="hljs-string">${str}</span>${after}`
  )

  // Tag identifiers immediately before a dot call as hljs-field (e.g. idempotencyService.)
  // Only operates on bare text nodes to avoid corrupting content inside existing spans (comments, strings, etc.)
  html = html.replace(/(<span[^>]*>[^<]*<\/span>)|([^<]+)/g, (_, span, text) => {
    if (span !== undefined) return span
    return text.replace(
      /(?<![a-zA-Z0-9_$])([a-z][a-zA-Z0-9_]*)(?=\.)/g,
      '<span class="hljs-field">$1</span>'
    )
  })

  return html
}

const _instance = new Marked()
_instance.use({
  renderer: {
    code({ text, lang }) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      const highlighted = hljs.highlight(text, { language }).value
      return `<pre><code class="hljs language-${language}">${postProcess(highlighted)}</code></pre>`
    }
  }
})

export const marked = (text) => _instance.parse(text)
