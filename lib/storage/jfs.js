var Store = require('jfs')

module.exports = function(config) {

    if (!config) {
        config = {
            path: './',
        }
    }

    var providers_db = new Store(config.path + '/providers', {saveId: 'id'})

    var objectsToList = function(cb) {
        return function(err, data) {
            if (err) {
                cb(err, data)
            } else {
                cb(err, Object.keys(data).map(function(key) {
                    return data[key]
                }))
            }
        }
    }

    var storage = {
        providers: {
            get: function(provider_id, cb) {
                providers_db.get(provider_id, cb)
            },
            save: function(provider_data, cb) {
                providers_db.save(provider_data.id, provider_data, cb)
            },
            all: function(cb) {
                providers_db.all(objectsToList(cb))
            }
        }
    }

    return storage
}
