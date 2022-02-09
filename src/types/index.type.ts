type CommonProps = {
  number: number
  names: string[]
  chineseName: string
  pinyinName: string
  character: string
  binary: string
  lines: number[]
}

export type TrigramRecord = CommonProps & {
  attribute: string
  images: string[]
  chineseImage: string
  pinyinImage: string
  familyRelationship: string
}

export type HexagramRecord = CommonProps & {
  topTrigram: number
  bottomTrigram: number
}

export enum Envelop {
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
  Winter = 'winter',
}
