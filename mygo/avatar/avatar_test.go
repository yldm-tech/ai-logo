package avatar

import "testing"

func TestAvatar(t *testing.T) {
	data, err := Read("OpenAI")
	if err != nil {
		t.Fatal(err)
	}
	if len(data) == 0 {
		t.Fatal("avatar is empty")
	}
	if _, err := Parse("OpenAI"); err != nil {
		t.Fatal(err)
	}
}
