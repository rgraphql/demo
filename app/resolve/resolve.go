package app_resolve

//go:generate go run github.com/rgraphql/rgraphql/cmd/rgraphql analyze --schema ../app.graphql --go-pkg github.com/rgraphql/demo/app --go-query-type RootResolver --go-output-pkg app_resolve --go-output ./resolve.rgql.go
