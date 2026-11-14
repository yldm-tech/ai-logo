package avatar

import (
	"bytes"
	"testing"
)

func TestAvatar(t *testing.T) {
	data, err := Read("OpenAI")
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.HasPrefix(data, []byte("RIFF")) || !bytes.Equal(data[8:12], []byte("WEBP")) {
		t.Fatal("avatar is not a WebP file")
	}
	source, err := Source("openai", 40)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(source.Data, data) || source.Size.Width != 40 || source.Size.Height != 40 {
		t.Fatalf("unexpected source size %v", source.Size)
	}
	if _, err := Read("../openai"); err == nil {
		t.Fatal("expected path traversal to be rejected")
	}
	if url, err := URL("Claude"); err != nil || url != "https://ailogo.yldm.ai/avatar/claude.webp" {
		t.Fatalf("unexpected CDN URL %q, %v", url, err)
	}
}
