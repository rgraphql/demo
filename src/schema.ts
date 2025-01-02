import { buildSchema as buildGraphqlSchema } from 'graphql'
import schemaText from '../app/app.graphql?raw'

export function buildAppSchema() {
  return buildGraphqlSchema(schemaText)
}
