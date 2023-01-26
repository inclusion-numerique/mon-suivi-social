const kilo = 1_000
const mega = 1_000_000
const giga = 1_000_000_000

const withUnit = (value: number, unit: string) =>
  `${value.toFixed(2).replace('.', ',')} ${unit}`

export const formatByteSize = (sizeInBytes: number): string => {
  if (sizeInBytes < kilo) {
    return `${sizeInBytes} o`
  }

  if (sizeInBytes < mega) {
    return withUnit(sizeInBytes / kilo, 'ko')
  }

  if (sizeInBytes < giga) {
    return withUnit(sizeInBytes / mega, 'Mo')
  }

  return withUnit(sizeInBytes / giga, 'Go')
}