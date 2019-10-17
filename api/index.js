const { text } = require('micro')
const { parse } = require('querystring')
const getSlackMessage = require('./getSlackMessage')

module.exports = async (req, res) => {
  const body = parse(await text(req)).text

  const result = await getSlackMessage(body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: result,
          },
        },
      ],
    })
  )
}
