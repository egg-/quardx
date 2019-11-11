const run = require('iterator-runner')
const fs = require('fs')
const Quardx = require('./lib')

var client = new Quardx({})
var MAX_PAGE = 100
var PER_PAGE = 1000

run(function * () {
  try {
    for (var i = 1; i < MAX_PAGE; i++) {
      var provinces = yield client.loadProvincesByCountryId.bind(client, {
        id: 'PH',
        page: i,
        per_page: PER_PAGE
      })

      if (provinces.data.length === 0) {
        break
      }

      for (var pi = 0; pi < provinces.data.length; pi++) {
        var province = provinces.data[pi]
        fs.appendFile('result.txt', JSON.stringify(province) + '\n')

        // load cities by province id
        for (var cpage = 1; cpage < MAX_PAGE; cpage++) {
          var cities = yield client.loadCitiesByProvinceId.bind(client, {
            id: province.id,
            page: cpage,
            per_page: PER_PAGE
          })
          if (cities.data.length === 0) {
            break
          }
          for (var ci = 0; ci < cities.data.length; ci++) {
            var city = cities.data[ci]
            fs.appendFile('result.txt', JSON.stringify(city) + '\n')

            // load districts by city id
            for (var dpage = 1; dpage < MAX_PAGE; dpage++) {
              var districts = yield client.loadDistrictsByCityId.bind(client, {
                id: city.id,
                page: dpage,
                per_page: PER_PAGE
              })

              if (districts.data.length === 0) {
                break
              }

              for (var di = 0; di < districts.data.length; di++) {
                fs.appendFile('result.txt', JSON.stringify(districts.data[di]) + '\n')
              }
            }
          }
        }
      }
    }

    console.log('Complete')
  } catch (err) {
    console.error(err)
  }
})
