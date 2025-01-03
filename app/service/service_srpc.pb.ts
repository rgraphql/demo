// @generated by protoc-gen-es-starpc none with parameter "target=ts,ts_nocheck=false"
// @generated from file github.com/rgraphql/demo/app/service/service.proto (package app.service, syntax proto3)
/* eslint-disable */

import {
  RGQLClientMessage,
  RGQLServerMessage,
} from '@go/github.com/rgraphql/rgraphql/rgraphql.pb.js'
import { MethodKind } from '@aptre/protobuf-es-lite'
import {
  buildDecodeMessageTransform,
  buildEncodeMessageTransform,
  MessageStream,
  ProtoRpc,
} from 'starpc'

/**
 * RgraphqlDemo is the demo service.
 *
 * @generated from service app.service.RgraphqlDemo
 */
export const RgraphqlDemoDefinition = {
  typeName: 'app.service.RgraphqlDemo',
  methods: {
    /**
     * RgraphqlQuery opens a two-way rgraphql query tree stream.
     *
     * @generated from rpc app.service.RgraphqlDemo.RgraphqlQuery
     */
    RgraphqlQuery: {
      name: 'RgraphqlQuery',
      I: RGQLClientMessage,
      O: RGQLServerMessage,
      kind: MethodKind.BiDiStreaming,
    },
  },
} as const

/**
 * RgraphqlDemo is the demo service.
 *
 * @generated from service app.service.RgraphqlDemo
 */
export interface RgraphqlDemo {
  /**
   * RgraphqlQuery opens a two-way rgraphql query tree stream.
   *
   * @generated from rpc app.service.RgraphqlDemo.RgraphqlQuery
   */
  RgraphqlQuery(
    request: MessageStream<RGQLClientMessage>,
    abortSignal?: AbortSignal,
  ): MessageStream<RGQLServerMessage>
}

export const RgraphqlDemoServiceName = RgraphqlDemoDefinition.typeName

export class RgraphqlDemoClient implements RgraphqlDemo {
  private readonly rpc: ProtoRpc
  private readonly service: string
  constructor(rpc: ProtoRpc, opts?: { service?: string }) {
    this.service = opts?.service || RgraphqlDemoServiceName
    this.rpc = rpc
    this.RgraphqlQuery = this.RgraphqlQuery.bind(this)
  }
  /**
   * RgraphqlQuery opens a two-way rgraphql query tree stream.
   *
   * @generated from rpc app.service.RgraphqlDemo.RgraphqlQuery
   */
  RgraphqlQuery(
    request: MessageStream<RGQLClientMessage>,
    abortSignal?: AbortSignal,
  ): MessageStream<RGQLServerMessage> {
    const result = this.rpc.bidirectionalStreamingRequest(
      this.service,
      RgraphqlDemoDefinition.methods.RgraphqlQuery.name,
      buildEncodeMessageTransform(RGQLClientMessage)(request),
      abortSignal || undefined,
    )
    return buildDecodeMessageTransform(RGQLServerMessage)(result)
  }
}