# AI Logo for NSGo

The Go module for using [AI Logo](https://ailogo.yldm.ai) marks in [NSGo](https://github.com/nsgo-dev/nsgo) apps on iOS, Android, macOS, Windows, Linux, the web and mini programs. It embeds the vector SVG variants generated from the same source as the React package and parses them lazily with NSGo's `core.ParseSVG`.

## Install

```bash
go get github.com/yldm-tech/ai-logo/nsgo
```

The module follows the AI Logo release line. NSGo has no tagged releases yet, so this module pins an `nsgo` pseudo-version; your app's `go.mod` resolves to whichever is newer, yours or this one.

## Use an icon

```go
package main

import (
	"github.com/nsgo-dev/nsgo"
	"github.com/nsgo-dev/nsgo/core"
	"github.com/nsgo-dev/nsgo/ui"
	ailogo "github.com/yldm-tech/ai-logo/nsgo"
)

func Root(cx *core.Scope) core.Node {
	return core.View{
		Style: core.Style{Direction: core.Row, AlignItems: core.AlignCenter, Gap: 8},
		Children: []core.Node{
			core.Icon{SVG: ailogo.MustParse("openai", ailogo.Mono), Style: core.Style{FontSize: 24}, Label: "OpenAI"},
			core.Icon{SVG: ailogo.MustParse("claude", ailogo.Color), Style: core.Style{FontSize: 24}, Label: "Claude"},
			ui.IconButton{Icon: ailogo.Func("gemini", ailogo.Color), Label: "Gemini"},
		},
	}
}

func main() { nsgo.Run(Root) }
```

`core.Icon` draws a mark in the text color it inherits, so a mono mark follows the theme; colored variants keep their own colors. `core.SVGView` draws one at its authored size. `Parse` returns an error for an unknown ID or unavailable variant, and parsed marks are cached and shared, so calling it while rendering costs nothing after the first time. `Func` returns the `func() *core.SVG` accessor that props such as `ui.IconButton.Icon` take.

```go
icon, err := ailogo.Parse("claude", ailogo.Color)
ids, err := ailogo.IDs()
variants, err := ailogo.Variants("claude")
cdnURL, err := ailogo.URL("gemini", ailogo.Color)
```

Available vector variants are `Mono`, `Color`, `Text`, `TextColor`, `TextCn`, `Brand` and `BrandColor`. Every mark parses with NSGo; the few that use SVG masks or filters (Poolside, Nova, Antigravity's and LobeHub's colored marks) are drawn without those effects, which [NSGo's SVG reader](https://github.com/nsgo-dev/nsgo/blob/main/docs/architecture/icons.md) does not support.

## Avatars

The optional [`avatar`](./avatar) subpackage contains the rendered WebP avatars and is kept separate so vector-only apps do not embed the avatar archive.

```bash
go get github.com/yldm-tech/ai-logo/nsgo/avatar
```

```go
source, err := avatar.Source("openai", 40)
if err != nil {
	return err
}
ui.Image{Source: source, Label: "OpenAI"}
```

The Go module is MIT licensed. Brand marks remain trademarks of their respective owners; third-party notices for ported assets are in the repository's [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md).
