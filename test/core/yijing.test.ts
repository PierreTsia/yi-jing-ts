import { YiJing } from '~/core/YiJing'
import { Stroke } from '~/core/stroke'
import { Envelop } from '~/types/index.type'
import { describe } from 'vitest'

describe('|-> Yi Jing class', () => {
  it('should be instantiated with correct params types and length', () => {
    expect(() => new YiJing([6, 7, 7, 9, 8, 9])).not.toThrow()
    expect(() => new YiJing([1])).toThrow()
    expect(() => new YiJing()).toThrow()
  })
  it('should only accept 6, 7, 8 or, 9', () => {
    expect(() => new YiJing([6, 1, 7, 9, 8, 0])).toThrow()
  })
  it('should convert rolls to strokes', () => {
    const y = new YiJing([6, 7, 7, 9, 8, 9])
    expect(y.strokes).toBeDefined()
    y.strokes.forEach((s: unknown) => {
      expect(s).toBeInstanceOf(Stroke)
    })
  })
  it("should get trigrams from the 'strokes' property", () => {
    const y = new YiJing([6, 8, 8, 9, 8, 9])
    expect(y.trigrams).toBeDefined()
    expect(y.trigrams.length).toBe(2)
  })

  describe('|->Trigrams', () => {
    it('should get the correct trigrams', () => {
      const y = new YiJing([6, 8, 8, 9, 8, 9])
      expect(y.trigrams[0].number).toEqual(2)
      expect(y.trigrams[1].number).toEqual(7)

      const y2 = new YiJing([8, 9, 8, 6, 6, 6])
      expect(y2.trigrams[0].number).toEqual(4)
      expect(y2.trigrams[1].number).toEqual(2)
    })
  })
  describe('|-> Hexagrams', () => {
    const hexaFindTestCases: [number[], number, number][] = [
      [[6, 8, 8, 9, 8, 9], 35, 5],
      [[9, 9, 9, 9, 9, 9], 1, 2],
      [[6, 6, 6, 6, 6, 6], 2, 1],
      [[6, 7, 7, 6, 9, 6], 48, 21],
      [[8, 9, 9, 8, 7, 8], 48, 21],
    ]

    it('should get situational and opposite hexagrames', () => {
      hexaFindTestCases.forEach(([rolls, expectedSituation, expectedOpposite]) => {
        const y = new YiJing(rolls)
        expect(y.hexagrams.situation?.number).toEqual(expectedSituation)
        expect(y.hexagrams.opposite?.number).toEqual(expectedOpposite)
        // 💡 hexagrams binary are lines.reverse()
        expect(y.hexagrams.situation?.binary).toEqual(`${y.trigrams[1].binary}${y.trigrams[0].binary}`)
      })
    })
  })
  describe('|-> Nucleus Hexagram', () => {
    it('should have a nucleus hexagram', () => {
      const y = new YiJing([7, 6, 9, 8, 8, 6])
      expect(y.hexagrams.nucleus).toBeDefined()
      expect(y.hexagrams.situation?.number).toEqual(36)
      expect(y.hexagrams.nucleus?.number).toEqual(40)
    })
  })

  describe('|-> Perspective Hexagram', () => {
    it('should have a perspective hexagram', () => {
      const y = new YiJing([7, 6, 9, 8, 8, 6])
      expect(y.hexagrams.perspective).toBeDefined()
      expect(y.hexagrams.situation?.number).toEqual(36)
      expect(y.hexagrams.perspective?.number).toEqual(41)
    })
  })
  describe('|-> Envelop', () => {
    it('should have an envelop property', () => {
      const y = new YiJing([6, 7, 7, 9, 8, 9])
      expect(y.envelop).toBeDefined()
      expect(Object.values(Envelop).includes(y.envelop as never)).toBe(true)
    })

    it('should return Winter', () => {
      const y = new YiJing([6, 7, 7, 9, 8, 8])
      const y2 = new YiJing([8, 7, 7, 9, 8, 6])
      //trait Yin en 1 et en 6
      expect(y.envelop).toEqual(Envelop.Winter)
      expect(y2.envelop).toEqual(Envelop.Winter)
    })

    it('should return Summer', () => {
      const y = new YiJing([7, 7, 7, 9, 8, 9])
      const y2 = new YiJing([9, 7, 7, 9, 8, 7])
      //trait Yin en 1 et en 6
      expect(y.envelop).toEqual(Envelop.Summer)
      expect(y2.envelop).toEqual(Envelop.Summer)
    })

    it('should return Spring', () => {
      const y = new YiJing([7, 7, 7, 9, 8, 8])
      const y2 = new YiJing([9, 7, 7, 9, 8, 6])
      //trait Yin en 1 et en 6
      expect(y.envelop).toEqual(Envelop.Spring)
      expect(y2.envelop).toEqual(Envelop.Spring)
    })

    it('should return Autumn', () => {
      const y = new YiJing([6, 7, 7, 9, 8, 9])
      const y2 = new YiJing([8, 7, 7, 9, 8, 7])
      //trait Yin en 1 et en 6
      expect(y.envelop).toEqual(Envelop.Autumn)
      expect(y2.envelop).toEqual(Envelop.Autumn)
    })
  })
})

describe('|-> Stroke Class', () => {
  it('should instantiate Stroke assigning correct string value', () => {
    const s1 = new Stroke(6)
    expect(s1.value).toEqual('0')
    const s2 = new Stroke(7)
    expect(s2.value).toEqual('1')
    const s3 = new Stroke(9)
    expect(s3.value).toEqual('1')
    const s4 = new Stroke(8)
    expect(s4.value).toEqual('0')
  })

  it('should have a binary and opposite property', () => {
    const s1 = new Stroke(6)
    expect(s1.binary).toEqual(0)
    expect(s1.oppositeBinary).toEqual(1)

    const s2 = new Stroke(7)
    expect(s2.binary).toEqual(1)
    expect(s2.oppositeBinary).toEqual(0)

    const s3 = new Stroke(8)
    expect(s3.binary).toEqual(0)
    expect(s3.oppositeBinary).toEqual(1)

    const s4 = new Stroke(9)
    expect(s4.binary).toEqual(1)
    expect(s4.oppositeBinary).toEqual(0)
  })

  it('should have a ying / yang boolean property', () => {
    const s1 = new Stroke(6)
    expect(s1.isYing).toEqual(true)
    expect(s1.isYang).toEqual(false)
    const s2 = new Stroke(7)
    expect(s2.isYing).toEqual(false)
    expect(s2.isYang).toEqual(false)
    const s3 = new Stroke(8)
    expect(s3.isYang).toEqual(false)
    const s4 = new Stroke(9)
    expect(s4.isYang).toEqual(true)
  })
})
