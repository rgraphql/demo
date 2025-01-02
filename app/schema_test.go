package app

import "testing"

func TestParseSchema(t *testing.T) {
	schema, err := ParseSchema()
	if err != nil {
		t.Fatalf("failed to parse schema: %v", err)
	}
	if schema == nil {
		t.Fatal("expected schema to not be nil")
	}
}
