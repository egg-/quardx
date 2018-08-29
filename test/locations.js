/* global it describe */

'use strict'

var assert = require('assert')

var Quardx = require('../')

var client = new Quardx({
  mode: Quardx.MODE.STAGING
})

var testCountryId = 'PH'
var testProvince = null
var testCity = null
var testDistrict = null

describe('location', function () {
  it('load countries', function (done) {
    client.loadCountries({
      page: 1
    }, function (err, result) {
      assert.strictEqual(err, null)

      assert.notStrictEqual(result.total, 0)
      assert.strictEqual(result.data[0].code, 'CN')

      done()
    })
  })

  it('load country by code', function (done) {
    client.loadCountry(testCountryId, function (err, result) {
      assert.strictEqual(err, null)

      assert.notStrictEqual(result.total, 0)
      assert.strictEqual(result.code, testCountryId)

      done()
    })
  })

  it('load provinces by country id', function (done) {
    client.loadProvincesByCountryId({
      id: testCountryId,
      page: 2,
      per_page: 10
    }, function (err, result) {
      assert.strictEqual(err, null)

      assert.notStrictEqual(result.total, 0)
      assert.strictEqual(result.current_page, 2)

      testProvince = result.data[0]

      done()
    })
  })

  it('load province by id', function (done) {
    client.loadProvince(testProvince.id, function (err, result) {
      assert.strictEqual(err, null)

      assert.strictEqual(result.id, testProvince.id)
      assert.strictEqual(result.name, testProvince.name)

      done()
    })
  })

  it('load cities by country id', function (done) {
    client.loadCitiesByCountryId({
      id: testCountryId,
      page: 2,
      per_page: 10
    }, function (err, result) {
      assert.strictEqual(err, null)

      assert.notStrictEqual(result.total, 0)
      assert.strictEqual(result.current_page, 2)

      testCity = result.data[0]

      done()
    })
  })

  it('load cities by province id', function (done) {
    client.loadCitiesByProvinceId({
      id: testProvince.id,
      page: 2,
      per_page: 1
    }, function (err, result) {
      assert.strictEqual(err, null)

      assert.notStrictEqual(result.total, 0)
      assert.strictEqual(result.current_page, 2)

      done()
    })
  })

  it('load city by id', function (done) {
    client.loadCity(testCity.id, function (err, result) {
      assert.strictEqual(err, null)

      assert.strictEqual(result.id, testCity.id)
      assert.strictEqual(result.name, testCity.name)

      done()
    })
  })

  it('load district by city id', function (done) {
    client.loadDistrictsByCityId({
      id: testCity.id,
      page: 2,
      per_page: 1
    }, function (err, result) {
      assert.strictEqual(err, null)

      assert.notStrictEqual(result.total, 0)
      assert.strictEqual(result.current_page, 2)

      testDistrict = result.data[0]

      done()
    })
  })

  it('load district by id', function (done) {
    client.loadDistrict(testDistrict.id, function (err, result) {
      assert.strictEqual(err, null)

      assert.strictEqual(result.id, testDistrict.id)
      assert.strictEqual(result.name, testDistrict.name)

      done()
    })
  })
})
