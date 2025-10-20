export const DEBUG_REDIS = process.env.DEBUG_REDIS === 'true'
export const DEBUG_SESSION = process.env.DEBUG_SESSION === 'true'
export const DEBUG_METRICS = process.env.DEBUG_METRICS === 'true'
export const DEBUG_CACHE =
  DEBUG_REDIS || DEBUG_SESSION || DEBUG_METRICS || process.env.DEBUG_CACHE === 'true'
export const DEBUG_REDIS_LOCKS = DEBUG_REDIS || process.env.DEBUG_REDIS_LOCKS === 'true'


