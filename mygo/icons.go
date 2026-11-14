// Package ailogo provides the AI Logo collection for MyGo's native UI.
//
// The package contains the vector SVG variants generated from this repository's
// React sources. SVGs are parsed lazily, so an application pays only for the
// marks it asks for:
//
//	logo, err := ailogo.Parse("openai", ailogo.Mono)
//	if err != nil {
//		log.Fatal(err)
//	}
//	ui.Icon(c, logo).Size(24, 24)
package ailogo

import (
	"archive/zip"
	"bytes"
	_ "embed"
	"errors"
	"fmt"
	"io"
	"path"
	"sort"
	"strings"
	"sync"

	"github.com/egoist/mygo/ui"
)

// Variant identifies a vector variant exported by the collection.
type Variant string

const (
	Mono       Variant = "mono"
	Color      Variant = "color"
	Text       Variant = "text"
	TextColor  Variant = "text-color"
	TextCn     Variant = "text-cn"
	Brand      Variant = "brand"
	BrandColor Variant = "brand-color"
)

var variantSuffixes = []struct {
	variant Variant
	suffix  string
}{
	{BrandColor, "-brand-color"},
	{TextColor, "-text-color"},
	{TextCn, "-text-cn"},
	{Color, "-color"},
	{Brand, "-brand"},
	{Text, "-text"},
	{Mono, ""},
}

// The archive is generated from packages/static-svg by scripts/goWorkflow.
// Keeping it compressed makes the Go module substantially smaller than a copy
// of the individual SVG files while retaining offline native-app support.
//
//go:embed icons.zip
var iconsArchive []byte

var (
	archiveOnce sync.Once
	archiveErr  error
	archive     *zip.Reader
	parsed      sync.Map // map[string]*ui.SVG
)

func openArchive() (*zip.Reader, error) {
	archiveOnce.Do(func() {
		archive, archiveErr = zip.NewReader(bytes.NewReader(iconsArchive), int64(len(iconsArchive)))
	})
	return archive, archiveErr
}

func slug(id string) (string, error) {
	slug := strings.ToLower(strings.TrimSpace(id))
	if slug == "" || slug == "." || slug == ".." || strings.ContainsAny(slug, `/\\`) || strings.Contains(slug, "..") {
		return "", errors.New("ai-logo: invalid icon id")
	}
	return slug, nil
}

func suffix(variant Variant) (string, error) {
	for _, item := range variantSuffixes {
		if item.variant == variant {
			return item.suffix, nil
		}
	}
	return "", fmt.Errorf("ai-logo: unsupported SVG variant %q", variant)
}

func filename(id string, variant Variant) (string, error) {
	slug, err := slug(id)
	if err != nil {
		return "", err
	}
	suffix, err := suffix(variant)
	if err != nil {
		return "", err
	}
	return slug + suffix + ".svg", nil
}

// Filename returns the generated archive filename for an icon and variant.
func Filename(id string, variant Variant) (string, error) {
	return filename(id, variant)
}

// Read returns the raw SVG bytes for an icon and variant.
func Read(id string, variant Variant) ([]byte, error) {
	name, err := filename(id, variant)
	if err != nil {
		return nil, err
	}
	archive, err := openArchive()
	if err != nil {
		return nil, fmt.Errorf("ai-logo: open SVG archive: %w", err)
	}
	for _, file := range archive.File {
		if file.Name != name {
			continue
		}
		r, openErr := file.Open()
		if openErr != nil {
			return nil, fmt.Errorf("ai-logo: open %s: %w", name, openErr)
		}
		data, readErr := io.ReadAll(r)
		closeErr := r.Close()
		if readErr != nil {
			return nil, fmt.Errorf("ai-logo: read %s: %w", name, readErr)
		}
		if closeErr != nil {
			return nil, fmt.Errorf("ai-logo: close %s: %w", name, closeErr)
		}
		return data, nil
	}
	return nil, fmt.Errorf("ai-logo: icon %q with variant %q does not exist", id, variant)
}

// Parse reads and parses an SVG for use with ui.Icon or ui.Image. Parsed SVGs
// are cached for the lifetime of the process; call it once during app setup or
// lazily when a mark first becomes visible.
func Parse(id string, variant Variant) (*ui.SVG, error) {
	name, err := filename(id, variant)
	if err != nil {
		return nil, err
	}
	if value, ok := parsed.Load(name); ok {
		return value.(*ui.SVG), nil
	}
	data, err := Read(id, variant)
	if err != nil {
		return nil, err
	}
	icon, err := ui.ParseSVG(data)
	if err != nil {
		return nil, fmt.Errorf("ai-logo: parse %s: %w", name, err)
	}
	actual, _ := parsed.LoadOrStore(name, icon)
	return actual.(*ui.SVG), nil
}

// MustParse is Parse for an icon that is known to be present. It panics when
// the ID or variant is invalid, which is useful for package-level app assets.
func MustParse(id string, variant Variant) *ui.SVG {
	icon, err := Parse(id, variant)
	if err != nil {
		panic(err)
	}
	return icon
}

// IDs returns every icon ID in the vector archive, sorted by slug.
func IDs() ([]string, error) {
	archive, err := openArchive()
	if err != nil {
		return nil, fmt.Errorf("ai-logo: open SVG archive: %w", err)
	}
	seen := make(map[string]struct{})
	for _, file := range archive.File {
		name := strings.TrimSuffix(path.Base(file.Name), ".svg")
		for _, item := range variantSuffixes {
			if item.suffix != "" && strings.HasSuffix(name, item.suffix) {
				name = strings.TrimSuffix(name, item.suffix)
				break
			}
		}
		seen[name] = struct{}{}
	}
	ids := make([]string, 0, len(seen))
	for id := range seen {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids, nil
}

// Variants returns the vector variants available for id in stable display
// order. The mono mark is included when present.
func Variants(id string) ([]Variant, error) {
	slug, err := slug(id)
	if err != nil {
		return nil, err
	}
	archive, err := openArchive()
	if err != nil {
		return nil, fmt.Errorf("ai-logo: open SVG archive: %w", err)
	}
	available := make(map[Variant]bool)
	for _, item := range variantSuffixes {
		name := slug + item.suffix + ".svg"
		for _, file := range archive.File {
			if file.Name == name {
				available[item.variant] = true
				break
			}
		}
	}
	result := make([]Variant, 0, len(available))
	for _, item := range variantSuffixes {
		if available[item.variant] {
			result = append(result, item.variant)
		}
	}
	return result, nil
}

// URL returns the live SVG CDN URL for an icon and variant. It is useful for a
// MyGo webview frontend or when the app deliberately keeps assets remote.
func URL(id string, variant Variant) (string, error) {
	name, err := filename(id, variant)
	if err != nil {
		return "", err
	}
	return "https://ailogo.yldm.ai/svg/" + name, nil
}
