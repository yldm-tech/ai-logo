# AI Logo for MyGo

The Go module for using [AI Logo](https://ailogo.yldm.ai) marks in [MyGo](https://github.com/egoist/mygo) native UI applications. It contains the vector SVG variants generated from the same source as the React package and parses them lazily with MyGo's `ui` package.

## Install

```bash
go get github.com/yldm-tech/ai-logo/mygo
```

The module follows the AI Logo release line. Pin the version together with `github.com/egoist/mygo` when reproducible builds matter.

## Use an icon

```go
package main

import (
	"log"

	"github.com/egoist/mygo"
	"github.com/egoist/mygo/ui"
	"github.com/yldm-tech/ai-logo/mygo"
)

var openAI = ailogo.MustParse("openai", ailogo.Mono)

type app struct{}

func (app) view(c *ui.Context) {
	ui.Row(c).Gap(8).Children(func() {
		ui.Icon(c, openAI).Size(24, 24).Label("OpenAI")
		ui.Text(c, "OpenAI")
	})
}

func main() {
	mygo.App.WhenReady(func() {
		mygo.NewWindow(mygo.WindowOptions{Title: "AI Logo", Content: ui.View((&app{}).view)})
	})
	if err := mygo.App.Run(); err != nil {
		log.Fatal(err)
	}
}
```

`Parse` returns an error for an unknown ID or unavailable variant. Use `IDs` and `Variants` to build a picker, or `URL` when a webview should load the CDN copy instead of embedding it.

```go
icon, err := ailogo.Parse("claude", ailogo.Color)
ids, err := ailogo.IDs()
variants, err := ailogo.Variants("claude")
cdnURL, err := ailogo.URL("gemini", ailogo.Color)
```

Available vector variants are `Mono`, `Color`, `Text`, `TextColor`, `TextCn`, `Brand` and `BrandColor`. The optional [`avatar`](./avatar) subpackage contains rendered WebP avatars and is kept separate so vector-only applications do not include the avatar archive.

```bash
go get github.com/yldm-tech/ai-logo/mygo/avatar
```

```go
avatar, err := avatar.Parse("openai")
if err != nil {
	log.Fatal(err)
}
ui.Image(c, avatar).Size(40, 40)
```

## Licence and sources

The Go module is MIT licensed ([`LICENSE`](./LICENSE)). AI Logo is a fork of [lobe-icons](https://github.com/lobehub/lobe-icons) by LobeHub, MIT licensed, from which the AI and LLM marks started; this module is the fork's addition for MyGo, built from the same SVGs as the React and static packages. The other service marks are ported from Simple Icons and the brand sources listed, with their licences, in [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md), which ships inside the module. Brand marks remain trademarks of their respective owners.
