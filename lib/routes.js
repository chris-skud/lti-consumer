var morgan = require('morgan')
var bodyParser = require('body-parser')

var declare = function declare (expressApp, storage) {
  var app = expressApp || require('express')()

  app.use(morgan('dev'))
  app.set('views', __dirname + '/../views')
  app.set('view engine', 'html')
  app.engine('html', require('ejs').renderFile)
  app.use(require('express').static('static'))
  app.use(require('body-parser').urlencoded({ extended: true }))

  app.route('/config.xml')
    .get(function (req, res) {
      // headers don't seem to get set
      res.sendFile(__dirname + '/../views/config.xml', {'headers': {'Content-Type': 'text/xml'}})
    })
  app.route('/lti')
    .get(function (req, res) {
      res.json('yo')
    })

  app.route('/')
    .get(function (req, res) {
      res.render('index', {'you': 'are'})
    })

  app.route('/launch')
    .get(function (req, res) {
      res.render('redirect', {'launchData': JSON.stringify(launchParams)})
    })

  app.route('/tool_config')
    .get(function (req, res) {
      var tool_config = {username: 'it is me'}

      console.log(expectsJson(req))
      if (expectsJson(req)) {
        res.json('tool_config', tool_config)
      } else {
        res.render('tool_config', tool_config)
      }
    })
    .post(bodyParser.urlencoded({ extended: true }), function (req, res) {
      console.log(req.body)
      storage.providers.save(req.body, function (err, provider_data) {
        if (err) {
          console.log(err)
        } else {
          console.log(provider_data)
        }
      })
    })
}

function expectsJson (req) {
  var contype = req.headers['content-type']
  return (!contype || contype.indexOf('application/json') !== -1)
}

var launchParams = {
  /* (Required) This indicates that this is a basic launch message.  This allows a TP to accept a number of different LTI message types at the same launch URL. */
  lti_message_type: 'basic-lti-launch-request',

  /* (Required) This indicates which version of the specification is being used for this particular message.  Since launches for version 1.1 are upwards compatible with 1.0 launches, this value is not advanced for LTI 1.1. */
  lti_version: 'LTI-1p0',

  /* (Required) This is an opaque unique identifier that the TC guarantees will be unique within the TC for every placement of the link.   If the tool / activity is placed multiple times in the same context, each of those placements will be distinct. This value will also change if the item is exported from one system or context and imported into another system or context. */
  resource_link_id: '88391-e1919-bb3456',

  /* (Recommended) A plain text[1] title for the resource. This is the clickable text that appears in the link. */
  resource_link_title: 'My Weekly Wiki',

  /* (Optional) A plain text description of the link’s destination, suitable for display alongside the link. Typically no more than a few lines long. */
  resource_link_description: '',

  /* (Recommended) Uniquely identifies the user.  This should not contain any identifying information for the user.  Best practice is that this field should be a TC-generated long-term “primary key” to the user record – not the “logical key".  At a minimum, this value needs to be unique within a TC. */
  user_id: '0ae836b9-7fc9-4060-006f-27b2066ac545',

  /* (Optional) This attribute specifies the URI for an image of the user who launches this request.  This image is suitable for use as a "profile picture" or an avatar representing the user.  It is expected to be a relatively small graphic image file using a widely supported image format (i.e., PNG, JPG, or GIF) with a square aspect ratio. */
  user_image: 'http://....',

  /* (Recommended) A comma-separated list of URN values for roles.  If this list is non-empty, it should contain at least one role from the LIS System Role, LIS Institution Role, or LIS Context Role vocabularies (see Appendix A).  The assumed namespace of these URNs is the LIS vocabulary of LIS Context Roles so TCs can use the handles when the intent is to refer to an LIS context role.  If the TC wants to include a role from another namespace, a fully-qualified URN should be used.  Usage of roles from non-LIS vocabularies is discouraged as it may limit interoperability. */
  roles: 'Instructor, Student',

  /* (Recommended) These fields contain information about the user account that is performing this launch.  The names of these data items are taken from LIS [LIS, 11].  The precise meaning of the content in these fields is defined by LIS. These parameters are recommended unless they are suppressed because of privacy settings. */
  lis_person_name_given: 'Jane',
  lis_person_name_family: 'Public',
  lis_person_name_full: 'Jane Q. Public',
  lis_person_contact_email_primary: 'user@school.edu',

  /* (Optional) A comma separated list of the user_id values which the current user can access as a mentor.  The typical use case for this parameter is where the Mentor role represents a parent, guardian or auditor.  It may be used in different ways by each TP, but the general expectation is that the mentor will be provided with access to tracking and summary information, but not necessarily the user’s personal content or assignment submissions.  In order to accommodate user_id values which contain a comma, each user_id should be url-encoded. This also means that each user_id from the comma separated list should url-decoded before a TP uses it.  This parameter is optional and should only be used when one of the roles passed for the current user is for urn:lti:role:ims/lis/Mentor. */
  role_scope_mentor: 'f5b2cc6c-8c5c-24e8-75cc-fac504df920f,dc19e42c-b0fe-68b8-167e-4b1a8f2b367e',

  /* (Recommended) This is an opaque identifier that uniquely identifies the context that contains the link being launched. */
  context_id: '8213060-006f-27b2066ac545',

  /* (Optional) This string is a comma-separated list of URN values that identify the type of context.  At a minimum, the list MUST include a URN value drawn from the LIS vocabulary (see Appendix A). The assumed namespace of these URNs is the LIS vocabulary so TCs can use the handles when the intent is to refer to an LIS context type.  If the TC wants to include a context type from another namespace, a fully-qualified URN should be used. */
  context_type: 'CourseSection',

  /* (Recommended) A plain text title of the context – it should be about the length of a line. */
  context_title: 'Design of Personal Environments',

  /* (Recommended) A plain text label for the context – intended to fit in a column. */
  context_label: 'SI182',

  /* (Optional) Language, country and variant as represented using the IETF Best Practices for Tags for Identifying Languages (BCP-47) available at http://www.rfc-editor.org/rfc/bcp/bcp47.txt. */
  launch_presentation_locale: 'en-US',

  /* (Recommended) This field communicates the kind of browser container into which the TC has launched the tool.  The TP can ignore this parameter and try to detect its environment through JavaScript, but this parameter gives the TP the information without requiring the use of JavaScript if the tool prefers.  The possible values for this parameter are:
    frame – opened in the same frame as the resource link;
    iframe –  opened within an iframe placed inside the same page/frame as the resource link;
    window – opened in a new window (or tab);
    popup – opened in a popup window;
    overlay – opened over the top of the page where the link exists (for example, using a lightbox);
    embed – the TP page is inserted directly into the TC page; this option is not expected to be a common use case but could be used, for example, when the launch request is performed on behalf of the user by the TC (server-to-server) and the response rendered within its page (e.g. within a portal-like interface). */
  launch_presentation_document_target: 'window',

  /* (Optional) This is a URL to an LMS-specific CSS URL.  There are no standards that describe exactly what CSS classes, etc. should be in this CSS.  The TC could send its standard CSS URL that it would apply to its local tools.  The TC should include styling for HTML tags to set font, color, etc. and also include its proprietary tags used to style its internal tools.  This parameter is optional.
  Someday perhaps we will come up with a cross-LMS standard for CSS classes to allow a tool to look "built-in" with only one set of markup, but until that happens, the launch_presentation_css_url  allows tools a chance to adapt their look and feel across LMS systems to some degree. */
  launch_presentation_css_url: '',

  /* (Recommended) The width of the window or frame where the content from the tool will be displayed. The tool can ignore this parameter and detect its environment through JavaScript, but this parameter gives the TP the information without requiring the use of JavaScript if the tool prefers. */
  launch_presentation_width: 320,

  /* (Recommended) The height of the window or frame where the content from the tool will be displayed. The tool can ignore this parameter and detect its environment through JavaScript, but this parameter gives the TP the information without requiring the use of JavaScript if the tool prefers. */
  launch_presentation_height: 240,

  /* (Recommended) Fully qualified URL where the TP can redirect the user back to the TC interface.  This URL can be used once the TP is finished or if the TP cannot start or has some technical difficulty.  In the case of an error, the TP may add a parameter called lti_errormsg that includes some detail as to the nature of the error.  The lti_errormsg value should make sense if displayed to the user.  If the tool has displayed a message to the end user and only wants to give the TC a message to log, use the parameter lti_errorlog instead of lti_errormsg. If the tool is terminating normally, and wants a message displayed to the user it can include a text message as the lti_msg parameter to the return URL. If the tool is terminating normally and wants to give the TC a message to log, use the parameter lti_log. This data should be sent on the URL as a GET – so the TP should take care to keep the overall length of the parameters small enough to fit within the limitations of a GET request. */
  launch_presentation_return_url: 'http://lmsng.school.edu/portal/123/page/988/',

  /* (Recommended) In order to better assist tools in using extensions and also making their user interface fit into the TC's user interface that they are being called from, each TC is encouraged to include the this parameter. Possible example values for this field might be: */
  tool_consumer_info_product_family_code: 'desire2learn',

  /* (Recommended) This field should have a major release number followed by a period.  The format of the minor release is flexible.  Possible values for this field might be:
  The TP should be flexible when parsing this field. */
  tool_consumer_info_version: '9.2.4',

  /* (Strongly recommended for systems supporting multi-tenancy) This is a unique identifier for the TC.  A common practice is to use the DNS of the organization or the DNS of the TC instance.  If the organization has multiple TC instances, then the best practice is to prefix the domain name with a locally unique identifier for the TC instance.  In the single-tenancy case, the tool consumer data can be often be derived from the oauth_consumer_key. In a multi-tenancy case this can be used to differentiate between the multiple tenants within a single installation of a Tool Consumer. This parameter is strongly recommended in systems capable of multi-tenancy. */
  tool_consumer_instance_guid: 'lmsng.school.edu',

  /* (Recommended) This is a plain text user visible field – it should be about the length of a column. */
  tool_consumer_instance_name: 'SchoolU',

  /* (Optional) This is a plain text user visible field – it should be about the length of a line. */
  tool_consumer_instance_description: 'University of School (LMSng)',

  /* (Optional) This is the URL of the consumer instance. */
  tool_consumer_instance_url: 'http://lmsng.school.edu',

  /* (Recommended) An email contact for the TC instance. */
  tool_consumer_instance_contact_email: 'System.Admin@school.edu'

  /*
  custom_keyname=value
  The creator of an LTI link can add custom key/value parameters to a launch which are to be included with the launch of the LTI link. The Common Cartridge section below describes how these parameters are represented when storing custom parameters in a Common Cartridge.

  When there are custom name / value parameters in the launch, a POST parameter is included for each custom parameter.  The parameter names are mapped to lower case and any character that is neither a number nor letter in a parameter name is replaced with an "underscore".  So if a custom entry was as follows:
  */
}

module.exports.declare = declare
