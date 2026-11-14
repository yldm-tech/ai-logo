# AI Logo avatars for NSGo

This optional subpackage exposes the rendered WebP avatar assets for [NSGo](https://github.com/nsgo-dev/nsgo) apps.

```go
import "github.com/yldm-tech/ai-logo/nsgo/avatar"

source, err := avatar.Source("openai", 40)
if err != nil {
	return err
}
ui.Image{Source: source, Label: "OpenAI"}
```

`Source` returns a `core.ImageSource` holding the WebP bytes, a square of the given size in points unless the image's style sizes it; the platform decodes it off the main thread. `Read` returns the bytes and `URL` the CDN copy.

Use the parent `github.com/yldm-tech/ai-logo/nsgo` package for vector SVG icons. The avatar archive is separate so an app that only needs vectors does not include it in its binary.
