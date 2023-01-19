import { searchCommunity } from '@mss/web/siren/siren'

describe.skip('siren', () => {
  it('Searches city', async () => {
    const query = 'lyon'
    const result = await searchCommunity(query)
    expect(result).toStrictEqual([
      {
        id: '98461-lyon',
        text: 'Lyon (Commune – 69001, 69002, 69003, 69004, 69005, 69006, 69007, 69008, 69009)',
        name: 'Lyon',
        scale: 'Commune',
        zipcodes: [
          '69001',
          '69002',
          '69003',
          '69004',
          '69005',
          '69006',
          '69007',
          '69008',
          '69009',
        ],
      },
    ])
  })
  it('Searches with multiple words', async () => {
    const query = 'lyon 1er'
    const result = await searchCommunity(query)
    expect(result).toStrictEqual([
      {
        id: '98461-lyon',
        text: 'Lyon (Commune – 69001, 69002, 69003, 69004, 69005, 69006, 69007, 69008, 69009)',
        name: 'Lyon',
        scale: 'Commune',
        zipcodes: [
          '69001',
          '69002',
          '69003',
          '69004',
          '69005',
          '69006',
          '69007',
          '69008',
          '69009',
        ],
      },
    ])
  })
})
