const axios = require('axios')
const { text } = require('micro')
const { parse } = require('querystring')

module.exports = async (req, res) => {
  const query = parse(await text(req)).text
  const message = (await axios(`https://pdh.now.sh/?text=${query}`)).data

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
      ],
    })
  )
}
