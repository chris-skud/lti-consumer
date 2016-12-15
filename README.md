# Drop-in LTI Consumer Express App
### Use it (work-in-progress)

```
const express = require('express')
const app = express()
const LTIConsumer = require('lti-consumer')
const storage = require('jfs')(null)
const ltiConsumerApp = new LTIConsumer(storage).app

app.use(ltiConsumerApp)
```

### TODO
Support user provided:
* storage
* logger
* authentication (passport compatible or just a func?)

Potential LTI2 model here: https://source.sakaiproject.org/svn/basiclti/trunk/basiclti-util/src/java/org/imsglobal/lti2/LTI2Servlet.java
