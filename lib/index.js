/**
 * index.js quardx
 */
'use strict'

const request = require('request')
const _ = require('lodash')
const qs = require('querystring')

const _MODE = {
  STAGING: 'staging',
  REAL: 'real'
}

const _HOST = {
  real: 'https://api.lbcx.ph',
  staging: 'https://api.staging.lbcx.ph'
}

/**
 * @param {object} config
 * @param {string} apikey
 * @param {string} secret
 * @param {string} [mode] real or staging (default value is real)
 */
function Quardx (config) {
  this._config = {
    apikey: config.apikey || '',
    secret: config.secret || '',
    mode: config.mode || _MODE.REAL
  }
}

Quardx.MODE = _MODE

/**
 * @param {object} param
 * @param {string} path
 * @param {string} [method]
 * @param {object} [data]
 * @param {object} [headers]
 * @param {object} [params]
 */
Quardx.prototype.request = function (param, cb) {
  var opts = {
    url: _HOST[this._config.mode] + param.path,
    method: param.method || 'GET',
    data: param.data || {},
    headers: param.headers || {},
    json: true
  }
  if (typeof param.params === 'object') {
    _.each(param.params, function (val, key) {
      opts.url = opts.url.replace(':' + key, val)
    })
  }
  if (opts.method === 'GET') {
    opts.url += (opts.url.indexOf('?') === -1 ? '?' : '&') + qs.stringify(opts.data)
  }
  return request(opts, function (err, res, body) {
    if (err) {
      return cb(err)
    }
    cb(res.statusCode !== 200 ? body : null, body)
  })
}

/**
 * Load countries
 * @param {object} param
 * @param {number} [param.page]
 */
Quardx.prototype.loadCountries = function (param, cb) {
  return this.request({
    path: '/v1/locations/countries'
  }, cb)
}

/**
 * Load country by ID
 * @param {string} id
 */
Quardx.prototype.loadCountry = function (id, cb) {
  return this.request({
    path: '/v1/locations/countries/:id',
    params: {
      id: id
    }
  }, cb)
}

/**
 * Load provinces by country ID
 * @param {object} param
 * @param {string} param.id
 * @param {number} param.page
 */
Quardx.prototype.loadProvincesByCountryId = function (param, cb) {
  return this.request({
    path: '/v1/locations/countries/:id/provinces',
    params: {
      id: param.id
    },
    data: param
  }, cb)
}

Quardx.prototype.loadProvince = function (id, cb) {
  return this.request({
    path: '/v1/locations/provinces/:id',
    params: {
      id: id
    }
  }, cb)
}

/**
 * Load cities by country ID
 * @param {object} param
 * @param {string} param.id
 * @param {number} param.page
 */
Quardx.prototype.loadCitiesByCountryId = function (param, cb) {
  return this.request({
    path: '/v1/locations/countries/:id/cities',
    params: {
      id: param.id
    },
    data: param
  }, cb)
}

/**
 * Load cities by province ID
 * @param {object} param
 * @param {string} param.id
 * @param {number} param.page
 */
Quardx.prototype.loadCitiesByProvinceId = function (param, cb) {
  return this.request({
    path: '/v1/locations/provinces/:id/cities',
    params: {
      id: param.id
    },
    data: param
  }, cb)
}

/**
 * Load city by id
 * @param {string} id
 */
Quardx.prototype.loadCity = function (id, cb) {
  return this.request({
    path: '/v1/locations/cities/:id',
    params: {
      id: id
    }
  }, cb)
}

/**
 * Load districts by city id
 * @param {object} param
 * @param {string} param.id
 * @param {number} param.page
 */
Quardx.prototype.loadDistrictsByCityId = function (param, cb) {
  return this.request({
    path: '/v1/locations/cities/:id/districts',
    params: {
      id: param.id
    },
    data: param
  }, cb)
}

/**
 * Load district by id
 * @param {string} id
 */
Quardx.prototype.loadDistrict = function (id, cb) {
  return this.request({
    path: '/v1/locations/district/:id',
    params: {
      id: id
    }
  }, cb)
}

module.exports = Quardx
