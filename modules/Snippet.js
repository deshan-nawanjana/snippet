/** @typedef {{ source: string, language?: string, from?: number, to?: number, title?: string }} SnippetInput */
/** @typedef {{ title: string | null, content: string, url?: string }} SnippetContent */

/** @type {Object.<string, string>} Cache directory */
const cache = {}

/**
 * Creates raw source url if available
 * @param {string} source Source URL
 */
const toSourceURL = source => {
  // parse source as url
  const url = new URL(source)
  // switch by origin
  if (url.hostname === "github.com") {
    // split source into parts
    const parts = source.split("/")
    // get url segments
    const repo = parts.slice(3, 5).join("/")
    const head = parts[6]
    const file = parts.slice(7).join("/")
    // return github raw url
    return `https://raw.githubusercontent.com/${repo}/refs/heads/${head}/${file}`
  } else if (url.hostname === "gitlab.com" && url.pathname.includes("/-/blob/")) {
    // return gitlab raw url
    return source.replace("/-/blob/", "/-/raw/")
  }
  // return same source
  return source
}

/**
 * Converts text content into snippet content
 * @param {string} text Text content
 * @param {SnippetInput} input Source input
 */
const toSnippetContent = (text, input, url) => {
  // split content into lines
  const lines = text.split("\n")
  // remove last line if empty
  if (!lines[lines.length - 1].trim()) { lines.pop() }
  // get segment range
  const from = input.from ?? 1
  const to = input.to ?? lines.length
  // get text segment content from options
  const segment = lines.slice(from - 1, to).join("\n")
  // get language from input options
  const lang = input.language ?? url?.split(".").pop() ?? "plain"
  // get highlighted content if prism library available
  const content = typeof Prism === "object"
    ? Prism.highlight(segment, Prism.languages[lang], lang)
    : segment
  // get title by input options
  const title = "title" in input ? input.title : url?.split("/").pop() ?? null
  // return content output
  return { title, content, url }
}

/** Snippet Module */
export class Snippet {
  /**
   * Snippet Module
   * @param {SnippetInput | SnippetInput[]} inputs Source inputs
   */
  constructor(inputs) {
    /** @type {SnippetInput | SnippetInput[]} Source inputs */
    this.inputs = inputs ?? []
  }
  /**
   * Loads snippet content
   * @returns {Promise<SnippetContent | SnippetContent[]>}
   */
  async load() {
    // get inputs as an array
    const inputs = Array.isArray(this.inputs) ? this.inputs : [this.inputs]
    // contents array
    const contents = []
    // for each source input
    for (let i = 0; i < inputs.length; i++) {
      // current input
      const input = inputs[i]
      // check if input source is an url
      if (input.source.startsWith("https://") && !input.source.includes("\n")) {
        // get source url
        const url = toSourceURL(input.source)
        // check for cache directory
        if (url in cache) {
          // create snippet from cache content
          contents.push(toSnippetContent(cache[url], input, url))
        } else {
          const content = await fetch(url).then(resp => resp.text())
          // store in cache
          cache[url] = content
          // create snippet content
          contents.push(toSnippetContent(content, input, url))
        }
      } else {
        // create snippet from text content
        contents.push(toSnippetContent(input.source, input))
      }
    }
    // return output
    return Array.isArray(this.inputs) ? contents : contents[0]
  }
}

// get embed host url
const host = import.meta.url.replace("modules/Snippet.js", "")

/**
 * Creates a Snippet embed frame
 * @param {SnippetInput | SnippetInput[]} inputs Source inputs
 */
export const createSnippet = inputs => {
  // create frame element
  const element = document.createElement("iframe")
  // frame load listener
  element.addEventListener("load", () => {
    // post message source inputs
    element.contentWindow.postMessage({
      isSnippet: true,
      data: inputs
    }, "*")
  })
  // set embed host url
  element.src = host
  // return frame element
  return element
}

// global accessibility
window.Snippet = Snippet
window.Snippet.createSnippet = createSnippet
