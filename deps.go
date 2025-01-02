//go:build deps_only
// +build deps_only

package demo

import (
	// _ imports common with the Makefile and tools
	_ "github.com/aperturerobotics/common"
	// _ imports rgraphql tool
	_ "github.com/rgraphql/rgraphql/cmd/rgraphql"
)
