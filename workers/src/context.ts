import { Env } from './index'

export interface Context {
  env: Env
  ctx: ExecutionContext
  request: Request
}

export function createContext({ env, ctx, request }: {
  env: Env
  ctx: ExecutionContext
  request: Request
}): Context {
  return {
    env,
    ctx,
    request,
  }
}
