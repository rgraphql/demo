import { useEffect, useState } from 'react'
import { WebSocketConn } from 'starpc'
import { useWebSocket } from './useWebSocket.js'
import { RgraphqlDemoClient } from '../app/service/service_srpc.pb.js'
import { RGQLClientMessage, Client as RGraphQLClient } from 'rgraphql'
import { pushable } from 'it-pushable'

import './App.css'
import { buildAppSchema } from './schema.js'

const serverAddr = 'ws://localhost:8093/demo.ws'
const schema = buildAppSchema()

function App() {
  const [count, setCount] = useState(0)
  const { ws, getStatusMessage } = useWebSocket(serverAddr)
  const [rgqlClient, setRgqlClient] = useState<RGraphQLClient | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!ws) return

    // abort signal
    const abortController = new AbortController()
    const abortSignal = abortController.signal

    console.log('Initializing srpc client with WebSocket...', ws)
    const conn = new WebSocketConn(ws, 'outbound')
    const client = conn.buildClient()
    const serviceClient = new RgraphqlDemoClient(client)

    // build the message source for outgoing msgs
    const txMessages = pushable<RGQLClientMessage>({
      objectMode: true,
    })

    // start the rpc
    console.log('Initializing rgraphql with srpc...')
    const rxMessages = serviceClient.RgraphqlQuery(txMessages, abortSignal)

    // initialize the rgraphql client
    const rgqlClient = new RGraphQLClient(schema, (msg) => txMessages.push(msg))

    // read incoming messages
    const rxFunc = async () => {
      for await (const msg of rxMessages) {
        if (Array.isArray(msg)) {
          rgqlClient.handleMessages(msg)
        } else {
          rgqlClient.handleMessages([msg])
        }
      }
    }
    queueMicrotask(() => {
      rxFunc()
        .catch((err) => console.warn('error in rpc stream', err))
        .finally(() => rgqlClient.dispose())
    })

    // client ready
    setRgqlClient(rgqlClient)

    return () => {
      abortController.abort()
    }
  }, [ws])

  if (!ws) {
    return (
      <div>
        <h1>{getStatusMessage()}</h1>
        <h4>Server: {serverAddr}</h4>
      </div>
    )
  }

  if (!rgqlClient) {
    return (
      <div>
        <h1>rGraphQL initializing...</h1>
        <h4>Server: {serverAddr}</h4>
      </div>
    )
  }

  return (
    <>
      <h1>Vite + React + starpc</h1>
      <h3>Connected to {serverAddr}</h3>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
