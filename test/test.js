var request = require('supertest')
describe('loading express', function () {
  let LTIConsumer = require('../lti_consumer.js')
  let storage = require('../lib/storage/jfs.js')(null)
  beforeEach(function () {
    let ltiConsumer = new LTIConsumer(storage)
    server = ltiConsumer.app
  })

  it('responds to /tool_config', function testSlash(done) {
  request(server)
    .get('/tool_config')
    .set('Content-Type', 'application/json')
    .expect(200, done)
  })
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done)
  })
})
