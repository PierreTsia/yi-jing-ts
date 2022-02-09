import { trigrams as TRIGRAMS, hexagrams as HEXAGRAMS } from './../data/index'
import { Stroke } from '~/core/stroke'
import { Envelop, HexagramRecord, TrigramRecord } from '~/types/index.type'

const ALLOWED_VALUES = [6, 7, 8, 9]

type Hexagrams = { situation: HexagramRecord | null; opposite: HexagramRecord | null; nucleus: HexagramRecord | null }

export class YiJing {
  draw: number[] = []
  strokes: Stroke[] = []
  trigrams: TrigramRecord[] = []
  oppositeTrigrams: TrigramRecord[] = []
  nucleusTrigrams: TrigramRecord[] = []
  hexagrams: Hexagrams = {
    situation: null,
    opposite: null,
    nucleus: null,
  }

  constructor(rolls?: number[]) {
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
    this.hexagrams = {
      situation: null,
      opposite: null,
      nucleus: null,
    }
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
    const verbs: Array<'situation' | 'opposite' | 'nucleus'> = ['situation', 'opposite', 'nucleus']

    const [situation, opposite, nucleus] = verbs.map((type) => this.getHexagram(type))

    if (!situation) {
      throw new Error('No situational hexagram found')
    }
    if (!opposite) {
      throw new Error('No mutating hexagram found')
    }
    if (!nucleus) {
      throw new Error('No nucleus hexagram found')
    }
    this.hexagrams = { situation, opposite, nucleus }
  }

  getHexagram(param: 'situation' | 'opposite' | 'nucleus'): HexagramRecord {
    let trigrams: TrigramRecord[] = [...this.trigrams]
    if (param === 'nucleus') {
      trigrams = [...this.nucleusTrigrams]
    }
    if (param === 'opposite') {
      trigrams = [...this.oppositeTrigrams]
    }

    const h = HEXAGRAMS.find(
      (h: HexagramRecord) => h.bottomTrigram === trigrams[0].number && h.topTrigram === trigrams[1].number
    )
    if (!h) {
      throw new Error(`hexagram not found with lines ${JSON.stringify(this.trigrams)}`)
    }
    return h
  }

  private getRawTrigrams(type: 'default' | 'opposite' | 'nucleus' = 'default'): string[] {
    let trigramString: string[] = []
    switch (type) {
      case 'nucleus':
        trigramString = this.createNucleusTrigrams()
        break
      default:
        trigramString = this.reverseBinaries(type)
        break
    }
    return trigramString
  }

  createNucleusTrigrams(): string[] {
    return this.strokes
      .reduce(
        ([bottom, top], stroke, index) => {
          switch (index) {
            case 1:
              bottom[0] = `${stroke.binary}`
              break
            case 2:
              bottom[1] = `${stroke.binary}`
              top[0] = `${stroke.binary}`
              break
            case 3:
              bottom[2] = `${stroke.binary}`
              top[1] = `${stroke.binary}`
              break
            case 4:
              top[2] = `${stroke.binary}`
              break
          }
          return [bottom, top]
        },
        [
          ['', '', ''],
          ['', '', ''],
        ]
      )
      .map((trigram) => trigram.join(''))
  }

  private reverseBinaries(type: 'default' | 'opposite' | 'nucleus') {
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
      ['', ''] as [string, string]
    )
  }
}

const isAllowed = (r: number) => ALLOWED_VALUES.includes(r)
const areAllAllowed = (rolls?: number[]) => rolls?.every(isAllowed)
