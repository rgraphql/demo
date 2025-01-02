# rGraphQL Demo

> Demonstration of Go and TypeScript two-way graphql over WebSockets.

## Introduction

This is a demonstration of [rgraphql] communicating over a WebSocket. It uses
React and Vite to demonstrate a minimal example.

[rgraphql]: https://github.com/rgraphql/rgraphql

## Usage

Start by downloading the dependencies:

```bash
# if you don't have yarn: npm i -g yarn
yarn
```

Run the web app with vite:

```
yarn dev
```

Run the go server:

```
cd ./server
go run -v ./
```

## License

MIT
