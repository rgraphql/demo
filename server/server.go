package main

import (
	"github.com/rgraphql/demo/app"
	app_resolve "github.com/rgraphql/demo/app/resolve"
	app_service "github.com/rgraphql/demo/app/service"
	"github.com/rgraphql/rgraphql/resolver"
	"github.com/rgraphql/rgraphql/schema"
	server_rpc "github.com/rgraphql/rgraphql/server/rpc"
	"github.com/sirupsen/logrus"
)

// AppServer implements the app service.
type AppServer struct {
	le  *logrus.Entry
	scm *schema.Schema
}

// NewAppServer constructs a AppServer with a RpcStream mux.
func NewAppServer(le *logrus.Entry) (*AppServer, error) {
	// Parse the rgraphql schema.
	scm, err := app.ParseSchema()
	if err != nil {
		return nil, err
	}

	return &AppServer{le: le, scm: scm}, nil
}

// RgraphqlQuery opens a two-way rgraphql query tree stream.
func (s *AppServer) RgraphqlQuery(strm app_service.SRPCRgraphqlDemo_RgraphqlQueryStream) error {
	// Start the session.
	rootResolver := &app.RootResolver{}
	sess := server_rpc.NewSession(
		strm.Context(),
		s.le,
		s.scm,
		strm,
		func(r *resolver.Context) { app_resolve.ResolveRootQuery(r, rootResolver) },
	)
	defer strm.Close()

	return sess.Execute()
}

// _ is a type assertion
var _ app_service.SRPCRgraphqlDemoServer = ((*AppServer)(nil))
