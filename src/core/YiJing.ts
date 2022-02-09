import { trigrams as TRIGRAMS, hexagrams as HEXAGRAMS } from './../data/index'
import { Stroke } from '~/core/stroke'
import { Envelop, HexagramRecord, TrigramRecord } from '~/types/index.type'

const ALLOWED_VALUES = [6, 7, 8, 9]

export class YiJing {
  draw: number[] = []
  strokes: Stroke[] = []
  trigrams: TrigramRecord[] = []
  mutatingTrigrams: TrigramRecord[] = []
  hexagrams: { situation: HexagramRecord | null; opposite: HexagramRecord | null } = {
    situation: null,
    opposite: null,
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
    this.mutatingTrigrams = []
    this.hexagrams = {
      situation: null,
      opposite: null,
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
    const situationalTrigrams = this.getRawTrigrams()
    this.trigrams = situationalTrigrams.map((tg) => this.findTrigram(tg))
    const mutatedTrigrams = this.getRawTrigrams('mutate')
    this.mutatingTrigrams = mutatedTrigrams.map((tg) => this.findTrigram(tg))
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
    const verbs: Array<'situation' | 'opposite'> = ['situation', 'opposite']

    const [situation, opposite] = verbs.map((type) => this.getHexagram(type))

    if (!situation) {
      throw new Error('No situational hexagram found')
    }
    if (!opposite) {
      throw new Error('No mutating hexagram found')
    }
    this.hexagrams = { situation, opposite }
  }

  getHexagram(param: 'situation' | 'opposite'): HexagramRecord {
    const trigrams = param === 'situation' ? this.trigrams : this.mutatingTrigrams
    const h = HEXAGRAMS.find(
      (h: HexagramRecord) => h.bottomTrigram === trigrams[0].number && h.topTrigram === trigrams[1].number
    )
    if (!h) {
      throw new Error(`hexagram not found with lines ${JSON.stringify(this.trigrams)}`)
    }
    return h
  }

  private getRawTrigrams(type: 'default' | 'mutate' = 'default'): string[] {
    let prop: 'binary' | 'oppositeBinary' = 'binary'
    return this.strokes.reduce(
      (acc, s, i) => {
        const index = i <= 2 ? 0 : 1
        if (type === 'mutate' && s.isMutating) {
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
