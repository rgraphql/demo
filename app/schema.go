package app

import (
	_ "embed"

	"github.com/rgraphql/rgraphql/schema"
)

// Schema contains the graphql schema string.
//
//go:embed app.graphql
var Schema string

// ParseSchema parses the schema.
func ParseSchema() (*schema.Schema, error) {
	return schema.Parse(Schema)
}
