import { trigrams as TRIGRAMS, hexagrams as HEXAGRAMS } from './../data/index'
import { Stroke } from '~/core/stroke'
import { Envelop, HexagramRecord, TrigramRecord } from '~/types/index.type'

const ALLOWED_VALUES = [6, 7, 8, 9]
const EMPTY_HEXAGRAMS = {
  situation: null,
  opposite: null,
  nucleus: null,
  perspective: null,
}

type Hexagrams = {
  situation: HexagramRecord | null
  opposite: HexagramRecord | null
  nucleus: HexagramRecord | null
  perspective: HexagramRecord | null
}

type RawTrigramsType = 'situation' | 'opposite' | 'nucleus' | 'perspective'

const ALL_HEXAGRAMS_TYPES: RawTrigramsType[] = ['situation', 'opposite', 'nucleus', 'perspective']

export class YiJing {
  draw: number[] = []
  strokes: Stroke[] = []
  trigrams: TrigramRecord[] = []
  oppositeTrigrams: TrigramRecord[] = []
  nucleusTrigrams: TrigramRecord[] = []
  perspectiveTrigrams: TrigramRecord[] = []
  hexagrams: Hexagrams = EMPTY_HEXAGRAMS

  constructor(rolls?: number[]) {
    this.reset()
    this.init(rolls)
    this.assignTrigrams()
    this.findHexagrams()
  }

  get envelop(): Envelop | null {
    if (!this.hexagrams.situation) return null
    const [bottom, top] = [this.hexagrams.situation.lines[0], this.hexagrams.situation.lines[5]]
    let result = Envelop.Winter
    switch (bottom) {
      case 1:
        result = top === 0 ? Envelop.Spring : Envelop.Summer
        break
      case 0:
        result = top === 0 ? Envelop.Winter : Envelop.Autumn
        break
    }
    return result
  }

  reset() {
    this.draw = []
    this.strokes = []
    this.trigrams = []
    this.oppositeTrigrams = []
    this.nucleusTrigrams = []
    this.perspectiveTrigrams = []

    this.hexagrams = EMPTY_HEXAGRAMS
  }

  private init(rolls?: number[]): void {
    if (rolls?.length !== 6) {
      throw new Error('must be 6 numbers')
    } else if (!areAllAllowed(rolls)) {
      throw new Error('must be either a 6,7,8 or 9')
    }
    this.draw = rolls
    this.strokes = rolls.map((r) => new Stroke(r))
  }

  private assignTrigrams(): void {
    const situationalTrigramString = this.getRawTrigrams()
    this.trigrams = situationalTrigramString.map((tg) => this.findTrigram(tg))

    const oppositeTrigramsString = this.getRawTrigrams('opposite')
    this.oppositeTrigrams = oppositeTrigramsString.map((tg) => this.findTrigram(tg))

    const nucleusTrigramString = this.getRawTrigrams('nucleus')
    this.nucleusTrigrams = nucleusTrigramString.map((tg) => this.findTrigram(tg))

    const perspectiveTrigramString = this.getRawTrigrams('perspective')
    this.perspectiveTrigrams = perspectiveTrigramString.map((tg) => this.findTrigram(tg))
  }

  private findTrigram(tg: string): TrigramRecord {
    const t = TRIGRAMS.find((t) => {
      return t.binary.split('').reverse().join('') === tg
    })
    if (!t) {
      throw new Error(`Trigram not found with binary ${tg}`)
    }
    return t
  }

  private findHexagrams(): void {
    const [situation, opposite, nucleus, perspective] = ALL_HEXAGRAMS_TYPES.map((type) => this.getHexagram(type))
    this.hexagrams = { situation, opposite, nucleus, perspective }
  }

  getHexagram(param: RawTrigramsType): HexagramRecord {
    let trigrams: TrigramRecord[] = [...this.trigrams]
    if (param === 'nucleus') {
      trigrams = [...this.nucleusTrigrams]
    } else if (param === 'opposite') {
      trigrams = [...this.oppositeTrigrams]
    } else if (param === 'perspective') {
      trigrams = [...this.perspectiveTrigrams]
    }

    const h = HEXAGRAMS.find(
      (h: HexagramRecord) => h.bottomTrigram === trigrams[0].number && h.topTrigram === trigrams[1].number
    )
    if (!h) {
      throw new Error(`hexagram not found with lines ${JSON.stringify(trigrams)}`)
    }
    return h
  }

  private getRawTrigrams(type: RawTrigramsType = 'situation'): string[] {
    let trigramString: string[] = []
    switch (type) {
      case 'nucleus':
        trigramString = this.createNucleusTrigrams()
        break
      case 'perspective':
        trigramString = this.createPerspectiveTrigrams()
        break
      default:
        trigramString = this.reverseBinaries(type)
        break
    }
    return trigramString
  }
  createPerspectiveTrigrams(): string[] {
    return this.strokes.reduce(
      ([bottom, top], stroke, index) => {
        let value = `${stroke.binary}`
        if (stroke.isYang || stroke.isYing) {
          value = `${stroke.oppositeBinary}`
        }
        index > 2 ? (top += value) : (bottom += value)
        return [bottom, top]
      },
      ['', '']
    )
  }

  createNucleusTrigrams(): string[] {
    return this.strokes.reduce(
      ([bottom, top], stroke, index) => {
        switch (index) {
          case 1:
            bottom += `${stroke.binary}`
            break
          case 2:
            bottom += `${stroke.binary}`
            top += `${stroke.binary}`
            break
          case 3:
            bottom += `${stroke.binary}`
            top += `${stroke.binary}`
            break
          case 4:
            top += `${stroke.binary}`
            break
        }
        return [bottom, top]
      },
      ['', '']
    )
  }

  private reverseBinaries(type: 'situation' | 'opposite' | 'nucleus') {
    let prop: 'binary' | 'oppositeBinary' = 'binary'
    return this.strokes.reduce(
      (acc, s, i) => {
        const index = i <= 2 ? 0 : 1
        if (type === 'opposite') {
          prop = 'oppositeBinary'
        }
        acc[index] += s[prop]
        return acc
      },
      ['', '']
    )
  }
}

const isAllowed = (r: number) => ALLOWED_VALUES.includes(r)
const areAllAllowed = (rolls?: number[]) => rolls?.every(isAllowed)
