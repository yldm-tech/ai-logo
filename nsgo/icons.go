// Package ailogo provides the AI Logo collection for NSGo native UI.
//
// The package embeds the vector SVG variants generated from this repository's React sources and parses them lazily with core.ParseSVG, so an application pays only for the marks it draws. core.Icon draws a mark in the text color it inherits, which themes a mono mark; colored variants keep their own colors:
//
//	logo, err := ailogo.Parse("openai", ailogo.Mono)
//	if err != nil {
//		log.Fatal(err)
//	}
//	core.Icon{SVG: logo, Style: core.Style{FontSize: 24}, Label: "OpenAI"}
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

	"github.com/nsgo-dev/nsgo/core"
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

// The archive is generated from packages/static-svg by scripts/goWorkflow. Keeping it compressed makes the module substantially smaller than a copy of the individual SVG files while retaining offline native-app support.
//
//go:embed icons.zip
var iconsArchive []byte

var (
	archiveOnce sync.Once
	archiveErr  error
	archive     *zip.Reader
	parsed      sync.Map // map[string]*core.SVG
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

// Filename returns the archive filename for an icon and variant, which is also its name on the CDN.
func Filename(id string, variant Variant) (string, error) {
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

// Read returns the raw SVG bytes for an icon and variant.
func Read(id string, variant Variant) ([]byte, error) {
	name, err := Filename(id, variant)
	if err != nil {
		return nil, err
	}
	archive, err := openArchive()
	if err != nil {
		return nil, fmt.Errorf("ai-logo: open SVG archive: %w", err)
	}
	file := find(archive, name)
	if file == nil {
		return nil, fmt.Errorf("ai-logo: icon %q with variant %q does not exist", id, variant)
	}
	r, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("ai-logo: open %s: %w", name, err)
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

func find(archive *zip.Reader, name string) *zip.File {
	for _, file := range archive.File {
		if file.Name == name {
			return file
		}
	}
	return nil
}

// Parse reads and parses an SVG for core.Icon, core.SVGView or ui.Icon. Parsed SVGs are cached for the lifetime of the process and shared between callers, so calling it from a component's render is cheap after the first time.
func Parse(id string, variant Variant) (*core.SVG, error) {
	name, err := Filename(id, variant)
	if err != nil {
		return nil, err
	}
	if value, ok := parsed.Load(name); ok {
		return value.(*core.SVG), nil
	}
	data, err := Read(id, variant)
	if err != nil {
		return nil, err
	}
	icon, err := core.ParseSVG(data)
	if err != nil {
		return nil, fmt.Errorf("ai-logo: parse %s: %w", name, err)
	}
	actual, _ := parsed.LoadOrStore(name, icon)
	return actual.(*core.SVG), nil
}

// MustParse is Parse for an icon that is known to be present. It panics when the ID or variant is invalid.
func MustParse(id string, variant Variant) *core.SVG {
	icon, err := Parse(id, variant)
	if err != nil {
		panic(err)
	}
	return icon
}

// Func returns an accessor in the shape NSGo's icon props take, such as ui.IconButton's Icon. The mark is parsed on the first call; it panics there when the ID or variant is invalid, as MustParse does.
func Func(id string, variant Variant) func() *core.SVG {
	return func() *core.SVG { return MustParse(id, variant) }
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

// Variants returns the vector variants available for id in stable display order. The mono mark is included when present.
func Variants(id string) ([]Variant, error) {
	slug, err := slug(id)
	if err != nil {
		return nil, err
	}
	archive, err := openArchive()
	if err != nil {
		return nil, fmt.Errorf("ai-logo: open SVG archive: %w", err)
	}
	var result []Variant
	for _, variant := range []Variant{Mono, Color, Text, TextColor, TextCn, Brand, BrandColor} {
		suffix, _ := suffix(variant)
		if find(archive, slug+suffix+".svg") != nil {
			result = append(result, variant)
		}
	}
	return result, nil
}

// URL returns the CDN URL of an icon and variant, for core.Image when the app deliberately keeps assets remote.
func URL(id string, variant Variant) (string, error) {
	name, err := Filename(id, variant)
	if err != nil {
		return "", err
	}
	return "https://ailogo.yldm.ai/svg/" + name, nil
}
