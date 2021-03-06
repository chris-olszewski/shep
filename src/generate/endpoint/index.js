import { mapping } from './templates'
import generateFunction from '../function'
import fs from 'fs-extra-promise'
import { set } from 'lodash'

module.exports = function(opts){
  const api = fs.readJSONSync('api.json')

  if (opts.createFunction) { generateFunction(opts) }

  set(api, ['paths', opts.path, opts.method], buildEndpoint(opts) )

  return fs.writeJSONAsync('api.json', api)
}

function buildEndpoint(opts){
  let endpoint = {}

  endpoint.consumes = endpoint.consumes || []
  endpoint.produces = endpoint.produces || []
  endpoint.responses = endpoint.responses || {}

  endpoint.consumes.push(opts.contentType)
  endpoint.produces.push(opts.contentType)

  endpoint.responses = endpoint.responses || {}

  endpoint.responses[opts.responseCode] = { description: `${opts.responseCode} response` }

  endpoint['x-amazon-apigateway-integration'] = {
    responses : {
      default: {
        statusCode: opts.statusCode
      }
    },
    requestTemplates : {
      [opts.contentType]: mapping
    },
    uri : `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:{AWS_ACCOUNT_ID}:function:${opts.functionName}:\${stageVariables.functionAlias}/invocations`,
    passthroughBehavior : 'when_no_match',
    httpMethod : 'POST',
    type : 'aws'
  }

  return endpoint
}
