const axios = require('axios')
const { parse, stringify } = require('querystring')

module.exports = async (req, res) => {
  // Extract code received on the request url
  const urlQueryString = req.url.replace(/^.*\?/, '')
  const code = parse(urlQueryString).code

  const client_id = process.env.SLACK_CLIENT_ID
  const client_secret = process.env.SLACK_CLIENT_SECRET

  // Hit oauth.access for access_token
  const { access_token } = (await axios({
    url: 'https://slack.com/api/oauth.access',
    method: 'post',
    data: stringify({
      code,
      client_id,
      client_secret,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })).data

  // Hit auth.test for slack domain
  const { url: slackUrl } = (await axios({
    url: 'https://slack.com/api/auth.test',
    method: 'post',
    headers: {
      authorization: `Bearer ${access_token}`,
      'content-type': 'application/json',
    },
  })).data

  // Send redirect response to slack domain
  res.writeHead(302, 'Redirect', { location: slackUrl })
  res.end()
}
