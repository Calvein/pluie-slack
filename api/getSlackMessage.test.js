const axios = require('axios')
const getSlackMessage = require('./getSlackMessage')

jest.mock('axios')

const CITY_URL = 'https://geo.api.gouv.fr/communes'
const WEATHER_URL = 'http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/'

test('pluie-slack api', async () => {
  // Unknown city
  axios.get.mockResolvedValue({ data: [] })
  let result = await getSlackMessage('xxx')
  expect(result).toBe("Il n'y a pas de ville existante avec le nom *xxx* 😔")

  // Unknown postcode
  result = await getSlackMessage('00000')
  expect(result).toBe(
    "Il n'y a pas de ville existante avec le code postal *00000* 😔"
  )

  // No data for the city
  axios.get.mockImplementation((url) => {
    if (url === 'https://geo.api.gouv.fr/communes') {
      return Promise.resolve({ data: [{ code: '44109', nom: 'Nantes' }] })
    }
    return { data: { hasData: false } }
  })
  result = await getSlackMessage('xxx')
  expect(result).toBe(
    "Il n'y a pas de données pour la ville avec le nom *xxx* 😔\nVous pouvez voir la couverture sur <http://www.meteofrance.com/previsions-meteo-france/previsions-pluie|le site de Météo france>"
  )

  // No data for the postcode
  result = await getSlackMessage('00000')
  expect(result).toBe(
    "Il n'y a pas de données pour la ville avec le code postal *00000* 😔\nVous pouvez voir la couverture sur <http://www.meteofrance.com/previsions-meteo-france/previsions-pluie|le site de Météo france>"
  )

  // Data with no rain
  axios.get.mockImplementation((url) => {
    if (url === 'https://geo.api.gouv.fr/communes') {
      return Promise.resolve({ data: [{ code: '44109', nom: 'Nantes' }] })
    }
    return {
      data: {
        echeance: '201910152205',
        hasData: true,
        dataCadran: [
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
        ],
      },
    }
  })
  result = await getSlackMessage('xxx')
  expect(result).toBe('à *Nantes* de 22h05 ☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️ à 23h05')

  // Data rain
  axios.get.mockImplementation((url) => {
    if (url === 'https://geo.api.gouv.fr/communes') {
      return Promise.resolve({ data: [{ code: '44109', nom: 'Nantes' }] })
    }
    return {
      data: {
        echeance: '201910152205',
        hasData: true,
        dataCadran: [
          {
            niveauPluie: 2,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
          {
            niveauPluie: 1,
          },
        ],
      },
    }
  })
  result = await getSlackMessage('xxx')
  expect(result).toBe(
    'à *Nantes* de 22h05 ☔☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️ à 23h05\nPrévoyez un parapluie ☂️'
  )
})
