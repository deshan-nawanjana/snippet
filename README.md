# Snippet - Embedding Code Into Websites

This code will give you an idea how to use Snippet
to embed clean, formatted code blocks anywhere!

There are several approaches to embed code using Snippet.js

## 1. Embed using an iframe element

Simply embed snippet tool using an iframe element in your website.

```html
<iframe href="https://deshan-nawanjana.github.io/snippet/?[QUERY_STRING]"></iframe>
```

`QUERY_STRING` should contain inputs as follows

- *source* - Code Segment or public URL to the file (ex: GitHub)
- *language* - Written language to highlight syntax using Prism.js
- *title* - Title text to display on tab item
- *from* - Starting line if only segment is required
- *to* - Ending line if only segment is required

Multiple files can be displayed in one embed by numbering the query inputs

```
?source_1=url_1&language_1=js&source_2=url_2&language_1=css
```

If you provide a URL for *source*, file name title will be `automatically detected`
Unless you provide a *title* option.

Make sure the given url is `public` and has `no cross origin issues`

## 2. Create an embed using Snippet module

You can import Snippet module from GitHub and use `createSnippet` method.

```js
import { Snippet } from "https://deshan-nawanjana.github.io/snippet/modules/Snippet.js"

// create a single file snippet
const embed_1 = Snippet.createSnippet({
  source: "path/to/file.html",
  from: 5,
  to: 25
})

// create multi file snippet
const embed_2 = Snippet.createSnippet([
  {
    source: "path/to/home.html",
    title: "Home Page"
  },
  {
    source: "path/to/about.html",
    title: "About Page"
  }
])

// append embed iframes into body
document.body.appendChild(embed_1)
document.body.appendChild(embed_2)
```

## 3. Post message into iframes

You also can post messages into Snippet tool and load to content dynamically

```html
<iframe href="https://deshan-nawanjana.github.io/snippet/"></iframe>
```

```js
// get iframe element
const iframe = document.querySelector("iframe")
// post message to load snippet
iframe.contentWindow.postMessage({
  isSnippet: true,
  data: {
    source: "path/to/file.html",
    from: 5,
    to: 25
  }
})
```

### Developed by Deshan Nawanjana

[Deshan.lk](https://deshan.lk/)
&ensp;|&ensp;
[DNJS](https://dnjs.lk/)
&ensp;|&ensp;
[LinkedIn](https://www.linkedin.com/in/deshan-nawanjana/)
&ensp;|&ensp;
[GitHub](https://github.com/deshan-nawanjana)
&ensp;|&ensp;
[YouTube](https://www.youtube.com/@deshan-nawanjana)
&ensp;|&ensp;
[Blogger](https://dn-w.blogspot.com/)
&ensp;|&ensp;
[Facebook](https://www.fb.com/mr.dnjs)
&ensp;|&ensp;
[Gmail](mailto:deshan.uok@gmail.com)
