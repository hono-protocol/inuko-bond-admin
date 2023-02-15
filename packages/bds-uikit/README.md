# BecoSwap UIkit

[![Version](https://img.shields.io/npm/v/@becoswap-libs/uikit)](https://www.npmjs.com/package/@becoswap-libs/uikit) [![Size](https://img.shields.io/bundlephobia/min/@becoswap-libs/uikit)](https://www.npmjs.com/package/@becoswap-libs/uikit)

BecoSwap UIkit is a set of React components and hooks used to build pages on BecoSwap's apps. It also contains a theme file for dark and light mode.

## Install

`yarn add @becoswap-libs/uikit`

## Setup

### Theme

Before using Becoswap UIkit, you need to provide the theme file to styled-component.

```
import { ThemeProvider } from 'styled-components'
import { light, dark } from '@becoswap-libs/uikit'
...
<ThemeProvider theme={isDark}>...</ThemeProvider>
```

### Reset

A reset CSS is available as a global styled component.

```
import { ResetCSS } from '@becoswap-libs/uikit'
...
<ResetCSS />
```

### Types

This project is built with Typescript and export all the relevant types.

## How to use the UIkit

If you want to use components from the UIkit, check the [Storybook documentation](https://becoswap.github.io/becoswap-uikit/)
