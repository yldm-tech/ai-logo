// Package avatar provides the rendered avatar assets for NSGo native UI. Importing it is optional: vector-only applications use the parent ailogo package without embedding the avatar archive.
package avatar

import (
	"archive/zip"
	"bytes"
	_ "embed"
	"errors"
	"fmt"
	"io"
	"strings"
	"sync"

	"github.com/nsgo-dev/nsgo/core"
)

// The archive is generated from packages/static-avatar by scripts/goWorkflow.
//
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

func filename(id string) (string, error) {
	slug := strings.ToLower(strings.TrimSpace(id))
	if slug == "" || slug == "." || slug == ".." || strings.ContainsAny(slug, `/\\`) || strings.Contains(slug, "..") {
		return "", errors.New("ai-logo/avatar: invalid icon id")
	}
	return slug + ".webp", nil
}

// Read returns the rendered WebP avatar bytes for id.
func Read(id string) ([]byte, error) {
	name, err := filename(id)
	if err != nil {
		return nil, err
	}
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
		closeErr := r.Close()
		if readErr != nil {
			return nil, fmt.Errorf("ai-logo/avatar: read %s: %w", name, readErr)
		}
		if closeErr != nil {
			return nil, fmt.Errorf("ai-logo/avatar: close %s: %w", name, closeErr)
		}
		return data, nil
	}
	return nil, fmt.Errorf("ai-logo/avatar: icon %q does not exist", id)
}

// Source returns the avatar for id as a core.ImageSource for core.Image or ui.Image, a square of size points unless the image's style sizes it. The platform decodes the WebP off the main thread.
func Source(id string, size core.Points) (core.ImageSource, error) {
	data, err := Read(id)
	if err != nil {
		return core.ImageSource{}, err
	}
	return core.ImageSource{Data: data, Size: core.Size{Width: size, Height: size}}, nil
}

// URL returns the avatar's CDN URL, for core.Src when the app deliberately keeps assets remote.
func URL(id string) (string, error) {
	name, err := filename(id)
	if err != nil {
		return "", err
	}
	return "https://ailogo.yldm.ai/avatar/" + name, nil
}
