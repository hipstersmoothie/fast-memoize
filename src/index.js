'use strict'

const CacheDefault = require('./cache')
const serializerDefault = require('./serializer')

function memoize (fn, Cache, serializer) {
  if (!Cache) {
    Cache = CacheDefault
  }
  if (!serializer) {
    serializer = serializerDefault
  }

  const apply = function (fn, thisArg, ...args) {
    let cacheKey

    if (args.length === 1) {
      cacheKey = args[0]
    } else {
      cacheKey = serializer(args)
    }

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(thisArg, args))
    }

    return memoized._cache.get(cacheKey)
  }

  const memoized = new Proxy(fn, {
    apply,
    construct: apply
  })

  memoized._cache = new Cache()

  return memoized
}

module.exports = memoize
