// Package avatar provides the rendered avatar assets for MyGo native UI.
// Importing this package is optional; vector-only applications can use the
// parent ailogo package without embedding the avatar archive.
package avatar

import (
	"archive/zip"
	"bytes"
	_ "embed"
	"fmt"
	"io"
	"strings"
	"sync"

	"github.com/egoist/mygo/ui"
)

//go:embed avatars.zip
var archiveBytes []byte

var (
	once    sync.Once
	reader  *zip.Reader
	openErr error
)

func openArchive() (*zip.Reader, error) {
	once.Do(func() {
		reader, openErr = zip.NewReader(bytes.NewReader(archiveBytes), int64(len(archiveBytes)))
	})
	return reader, openErr
}

func read(id string) ([]byte, error) {
	slug := strings.ToLower(strings.TrimSpace(id))
	if slug == "" || slug == "." || slug == ".." || strings.ContainsAny(slug, `/\\`) || strings.Contains(slug, "..") {
		return nil, fmt.Errorf("ai-logo/avatar: invalid icon id")
	}
	name := slug + ".webp"
	archive, err := openArchive()
	if err != nil {
		return nil, fmt.Errorf("ai-logo/avatar: open archive: %w", err)
	}
	for _, file := range archive.File {
		if file.Name != name {
			continue
		}
		r, err := file.Open()
		if err != nil {
			return nil, fmt.Errorf("ai-logo/avatar: open %s: %w", name, err)
		}
		data, readErr := io.ReadAll(r)
		_ = r.Close()
		if readErr != nil {
			return nil, fmt.Errorf("ai-logo/avatar: read %s: %w", name, readErr)
		}
		return data, nil
	}
	return nil, fmt.Errorf("ai-logo/avatar: icon %q does not exist", id)
}

// Read returns the rendered WebP avatar bytes for id.
func Read(id string) ([]byte, error) { return read(id) }

// Parse decodes an avatar for use with ui.Image.
func Parse(id string) (*ui.Bitmap, error) {
	data, err := read(id)
	if err != nil {
		return nil, err
	}
	bitmap, err := ui.DecodeBitmap(data)
	if err != nil {
		return nil, fmt.Errorf("ai-logo/avatar: decode %s: %w", id, err)
	}
	return bitmap, nil
}

// URL returns the live avatar CDN URL for id.
func URL(id string) (string, error) {
	slug := strings.ToLower(strings.TrimSpace(id))
	if slug == "" || slug == "." || slug == ".." || strings.ContainsAny(slug, `/\\`) || strings.Contains(slug, "..") {
		return "", fmt.Errorf("ai-logo/avatar: invalid icon id")
	}
	return "https://ailogo.yldm.ai/avatar/" + slug + ".webp", nil
}
