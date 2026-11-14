package ailogo_test

import (
	"github.com/nsgo-dev/nsgo/core"
	"github.com/nsgo-dev/nsgo/ui"
	ailogo "github.com/yldm-tech/ai-logo/nsgo"
	"github.com/yldm-tech/ai-logo/nsgo/avatar"
)

// The README's sample, compiled so a change in NSGo's API breaks the build here rather than in a reader's app.
func Example() {
	root := func(cx *core.Scope) core.Node {
		source, err := avatar.Source("openai", 40)
		if err != nil {
			panic(err)
		}
		return core.View{
			Style: core.Style{Direction: core.Row, AlignItems: core.AlignCenter, Gap: 8},
			Children: []core.Node{
				core.Icon{SVG: ailogo.MustParse("openai", ailogo.Mono), Style: core.Style{FontSize: 24}, Label: "OpenAI"},
				core.Icon{SVG: ailogo.MustParse("claude", ailogo.Color), Style: core.Style{FontSize: 24}, Label: "Claude"},
				ui.IconButton{Icon: ailogo.Func("gemini", ailogo.Color), Label: "Gemini"},
				ui.Image{Source: source, Label: "OpenAI"},
			},
		}
	}
	_ = root
}
