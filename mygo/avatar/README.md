# AI Logo avatars for MyGo

This optional subpackage exposes the rendered WebP avatar assets for [MyGo](https://github.com/egoist/mygo) native UI.

```go
import "github.com/yldm-tech/ai-logo/mygo/avatar"

mark, err := avatar.Parse("openai")
if err != nil {
	return err
}
ui.Image(c, mark).Size(40, 40)
```

Use the parent `github.com/yldm-tech/ai-logo/mygo` package for vector SVG icons. The avatar archive is separate so an app that only needs vectors does not include it in its binary.
