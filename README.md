<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i>Feature create-react-app/type-route/gh-pages compatibility</i>
    <br>
    <br>
    <img src="https://github.com/garronej/github-pages-plugin-for-typeroute/workflows/ci/badge.svg?branch=master">
    <img src="https://img.shields.io/bundlephobia/minzip/github-pages-plugin-for-typeroute">
    <img src="https://img.shields.io/npm/dw/github-pages-plugin-for-typeroute">
    <img src="https://img.shields.io/npm/l/github-pages-plugin-for-typeroute">
</p>
<p align="center">
  <a href="https://github.com/garronej/github-pages-plugin-for-typeroute">Home</a>
  -
  <a href="https://github.com/garronej/github-pages-plugin-for-typeroute">Documentation</a>
</p>

# Install / Import

```bash
$ npm install --save github-pages-plugin-for-typeroute
```

```typescript
import { myFunction, myObject } from "github-pages-plugin-for-typeroute";
```

Specific imports:

```typescript
import { myFunction } from "github-pages-plugin-for-typeroute/myFunction";
import { myObject } from "github-pages-plugin-for-typeroute/myObject";
```

## Import from HTML, with CDN

Import it via a bundle that creates a global ( wider browser support ):

```html
<script src="//unpkg.com/github-pages-plugin-for-typeroute/bundle.min.js"></script>
<script>
    const { myFunction, myObject } = github_pages_plugin_for_typeroute;
</script>
```

Or import it as an ES module:

```html
<script type="module">
    import {
        myFunction,
        myObject,
    } from "//unpkg.com/github-pages-plugin-for-typeroute/zz_esm/index.js";
</script>
```

_You can specify the version you wish to import:_ [unpkg.com](https://unpkg.com)

## Contribute

```bash
npm install
npm run build
npm test
```
