import { Snippet } from "./modules/Snippet.js"

// helper to create elements
const createElement = (className, content, parent) => {
  // create element by type
  const element = document.createElement("div")
  // set element class name
  element.className = className
  // set element inner content
  element.innerHTML = content
  // append into parent if given
  if (parent) { parent.appendChild(element) }
  // return created element
  return element
}

// get snippet view elements
const tabsElement = document.querySelector(".snippet-tabs")
const codeElement = document.querySelector(".snippet-code")
const linesElement = document.querySelector(".snippet-lines")

// method to initiate
const init = async inputs => {
  // get inputs as an array
  inputs = Array.isArray(inputs) ? inputs : [inputs]
  // create snippet
  const snippet = new Snippet(inputs)
  // load contents
  const contents = await snippet.load()
  // clear all tabs
  tabsElement.innerHTML = ""
  // method to select tab
  const onSelect = (data, index) => {
    // clear content elements
    codeElement.innerHTML = ""
    linesElement.innerHTML = ""
    // set as current content
    codeElement.innerHTML = data.content
    // get previously selected tab
    const previous = document.querySelector("[data-selected]")
    // remove selected tab
    if (previous) { previous.removeAttribute("data-selected") }
    // get tab elements
    const tabs = document.querySelectorAll(".snippet-tab-item")
    // set current tab as selected
    tabs[index].setAttribute("data-selected", true)
    // get lines count
    const lines = data.content.split("\n").length
    // get start line number
    const start = inputs[index].from ?? 1
    // for each line
    for (let n = 0; n < lines; n++) {
      // create and append line element
      createElement("snippet-line-item", start + n, linesElement)
    }
  }
  // for each content tab
  for (let i = 0; i < contents.length; i++) {
    // get current content
    const content = contents[i]
    // get tab title
    const title = content.title ?? content.url?.split("/").pop()
    // create tab item
    const item = createElement("snippet-tab-item", title, tabsElement)
    // set tab title if url given
    if (content.url) { item.setAttribute("title", content.url) }
    // add tab item event
    item.addEventListener("click", () => onSelect(content, i))
  }
  // select first item initially
  onSelect(contents[0], 0)
  // check if no title for only input
  if (inputs.length === 1 && !inputs[0].title) {
    // hide tabs element
    tabsElement.remove()
    // flag as no tabs element
    document.body.setAttribute("data-tabs", false)
  }
  // set as ready
  document.body.setAttribute("data-ready", true)
}

// get url search params
const params = new URLSearchParams(location.search)

// check for source param
if (params.has("source")) {
  // initiate with search params 
  init({
    source: params.get("source"),
    language: params.get("language"),
    from: parseInt(params.get("from")) || null,
    to: parseInt(params.get("to")) || null,
    title: params.get("title")
  })
}

// check for source param
if (params.has("source_1")) {
  // inputs array
  const inputs = []
  // while source given
  while (params.has("source_" + (inputs.length + 1))) {
    // get current input index
    const index = inputs.length + 1
    // push options to inputs
    inputs.push({
      source: params.get("source_" + index),
      language: params.get("language_" + index),
      from: parseInt(params.get("from_" + index)) || null,
      to: parseInt(params.get("to_" + index)) || null,
      title: params.get("title_" + index)
    })
  }
  // initiate multiple inputs
  init(inputs)
}

// listen to post messages
window.addEventListener("message", event => {
  // return if not snippet data
  if (!event.data || !event.data.isSnippet) { return }
  // initiate with post message data
  init(event.data.data)
})

// initiation delay
setTimeout(() => {
  // return if embed
  if (window.parent != window) { return }
  // initiate readme file
  init({
    title: "Snippet.js",
    source: "https://github.com/deshan-nawanjana/snippet/blob/main/README.md",
    to: 116
  })
}, 800)
