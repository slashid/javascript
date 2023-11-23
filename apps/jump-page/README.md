# /id - SDK Jump page

WIP jump page implementation for the SDK. SSG + client side rendering.

## Running the app via CLI

This package comes with CLI support so you can run it locally:

```bash
npm install -g @slashid/jump-page
sid-jump-cli
```

## Astro gotchas

### React hydration

Astro renders a static site by default, meaning the even when using React components they won't hydrate out of the box - it is required to explicitly tell Astro which components should be hydrated by [creating an island](https://docs.astro.build/en/concepts/islands/#creating-an-island).

Another gotcha is that when rendering multiple React components from an Astro component, it is not enough to create an island for the parent component, but for each of the children as well. Example:

```jsx
// Page.astro
---
import { Parent, Child } from './components';
---

<Parent client:load>
    <Child client:load />
</Parent>
```

Notice how the `Child` component also needs the `client:load` attribute. Otherwise it would only be rendered when generating the site.

To prevent issues like these, encapsulate the whole client side app in a single parent component and create an island for it.

```jsx
// app.tsx
import { Parent, Child } from "./components";

export function App() {
  return (
    <Parent>
      <Child client:load />
    </Parent>
  );
}

// Page.astro
---
import { App } from './app';
---

<App client:load />
```
