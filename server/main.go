package main

import (
	"net/http"
	"os"
	"time"

	"github.com/aperturerobotics/starpc/srpc"
	"github.com/coder/websocket"
	app_service "github.com/rgraphql/demo/app/service"
	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

var listen = "localhost:8093"

func main() {
	app := cli.NewApp()
	app.Name = "server"
	app.Usage = "rgraphql-demo server"
	app.HideVersion = true
	app.Action = runServer
	app.Flags = []cli.Flag{
		&cli.StringFlag{
			Name:        "listen",
			EnvVars:     []string{"LISTEN"},
			Usage:       "listen string, default `LISTEN`",
			Value:       listen,
			Destination: &listen,
		},
	}

	if err := app.Run(os.Args); err != nil {
		logrus.Fatal(err.Error())
	}
}

func runServer(_ *cli.Context) error {
	// Construct the websocket server.
	log := logrus.New()
	log.SetLevel(logrus.DebugLevel)
	le := logrus.NewEntry(log)

	// Construct the server.
	appServer, err := NewAppServer(le)
	if err != nil {
		return err
	}

	// Construct the rpc mux.
	mux := srpc.NewMux()
	_ = app_service.SRPCRegisterRgraphqlDemo(mux, appServer)

	// Construct the http server.
	httpServer, err := srpc.NewHTTPServer(mux, "/demo.ws", &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		return err
	}

	// Listen on http port.
	le.Infof("listening on %s", listen)
	return (&http.Server{
		Addr:              listen,
		Handler:           httpServer,
		ReadHeaderTimeout: time.Second * 10,
	}).ListenAndServe()
}
