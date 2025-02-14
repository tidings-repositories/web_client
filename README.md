# Tidings Web Client

## Tech

| <h3> Tool </h3> |      |
| --------------- | ---- |
| Npm             | Vite |

| <h3> Library </h3> |              |         |              |
| ------------------ | ------------ | ------- | ------------ |
| React              | Tailwind CSS | Zustand | React-router |

---

## Development procedure

### Start procjet

<details>
<summary>detail</summary>
<div markdown="1">

#### install vite & Create react project

```bash
npm create vite@latest
```

```bash
√ Project name: ... tidings-web-client
√ Select a framework: » React
√ Select a variant: » TypeScript
```

#### Add react router package

```bash
npm install react-router-dom
```

#### Add zustand package

```bash
npm install zustand
```

#### Add tailwind package

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], //Add tailwindcss() plugin
});
```

</div>
</details>

### Theme

<details>
<summary>detail</summary>
<div markdown="1">

#### Add font family

```html
<!-- index.html -->
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

```css
/* index.css */
@import "tailwindcss";

@theme {
  --font-sans: InterVariable, sans-serif;
}
```

</div>
</details>

### Component

<details>
<summary>detail</summary>
<div markdown="1">

</div>
</details>
