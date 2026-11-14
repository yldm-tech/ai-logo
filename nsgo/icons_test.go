package ailogo

import (
	"slices"
	"testing"
)

func TestCollection(t *testing.T) {
	ids, err := IDs()
	if err != nil {
		t.Fatal(err)
	}
	if len(ids) < 1000 {
		t.Fatalf("expected the full icon collection, got %d IDs", len(ids))
	}
	if slices.Contains(ids, "openai-color") {
		t.Fatal("variant suffix leaked into the icon ID list")
	}

	icon, err := Parse("OpenAI", Mono)
	if err != nil {
		t.Fatal(err)
	}
	if again := MustParse("openai", Mono); again != icon {
		t.Fatal("Parse did not share the parsed SVG between callers")
	}
	if Func("openai", Mono)() != icon {
		t.Fatal("Func did not return the shared SVG")
	}

	variants, err := Variants("claude")
	if err != nil {
		t.Fatal(err)
	}
	if len(variants) < 3 || variants[0] != Mono || variants[1] != Color {
		t.Fatalf("expected Claude's variants in display order starting with mono and color, got %v", variants)
	}
}

// Every mark the archive ships has to survive NSGo's SVG parser, since an app that lists the collection in a picker parses all of them.
func TestEveryMarkParses(t *testing.T) {
	ids, err := IDs()
	if err != nil {
		t.Fatal(err)
	}
	for _, id := range ids {
		variants, err := Variants(id)
		if err != nil {
			t.Fatal(err)
		}
		for _, variant := range variants {
			svg, err := Parse(id, variant)
			if err != nil {
				t.Errorf("%s %s: %v", id, variant, err)
				continue
			}
			if w, h := svg.Size(); w <= 0 || h <= 0 {
				t.Errorf("%s %s: parsed to an empty %vx%v document", id, variant, w, h)
			}
		}
	}
}

func TestRejectsInvalidInput(t *testing.T) {
	if _, err := Read("../openai", Mono); err == nil {
		t.Fatal("expected path traversal to be rejected")
	}
	if _, err := Parse("openai", Variant("huge")); err == nil {
		t.Fatal("expected an unknown variant to be rejected")
	}
	if _, err := Parse("no-such-brand", Mono); err == nil {
		t.Fatal("expected an unknown icon to be rejected")
	}
	url, err := URL("Claude", Color)
	if err != nil || url != "https://ailogo.yldm.ai/svg/claude-color.svg" {
		t.Fatalf("unexpected CDN URL %q, %v", url, err)
	}
}
