package ailogo

import "testing"

func TestCollection(t *testing.T) {
	ids, err := IDs()
	if err != nil {
		t.Fatal(err)
	}
	if len(ids) < 1000 {
		t.Fatalf("expected the full icon collection, got %d IDs", len(ids))
	}
	for _, id := range ids {
		if id == "openai-color" {
			t.Fatal("variant suffix leaked into the icon ID list")
		}
	}

	icon, err := Parse("OpenAI", Mono)
	if err != nil {
		t.Fatal(err)
	}
	if icon == nil {
		t.Fatal("Parse returned a nil SVG")
	}

	variants, err := Variants("claude")
	if err != nil {
		t.Fatal(err)
	}
	if len(variants) < 3 {
		t.Fatalf("expected Claude to have several variants, got %v", variants)
	}
}

func TestRejectsPathTraversal(t *testing.T) {
	if _, err := Read("../openai", Mono); err == nil {
		t.Fatal("expected path traversal to be rejected")
	}
}
