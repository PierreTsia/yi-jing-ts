import { YiJing } from '~/core/YiJing'
import { Stroke } from '~/core/stroke'

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

  it('should get the correct trigrams', () => {
    const y = new YiJing([6, 8, 8, 9, 8, 9])
    expect(y.trigrams[0].number).toEqual(2)
    expect(y.trigrams[1].number).toEqual(7)

    const y2 = new YiJing([8, 9, 8, 6, 6, 6])
    expect(y2.trigrams[0].number).toEqual(4)
    expect(y2.trigrams[1].number).toEqual(2)
  })

  const hexaFindTestCases: [number[], number, number][] = [
    [[6, 8, 8, 9, 8, 9], 35, 5],
    [[9, 9, 9, 9, 9, 9], 1, 2],
    [[6, 6, 6, 6, 6, 6], 2, 1],
    [[6, 7, 7, 6, 9, 6], 48, 21],
  ]

  it('should get situational and opposite trigrams', () => {
    hexaFindTestCases.forEach(([rolls, expectedSituation, expectedOpposite]) => {
      const y = new YiJing(rolls)
      expect(y.hexagrams.situation?.number).toEqual(expectedSituation)
      expect(y.hexagrams.opposite?.number).toEqual(expectedOpposite)
      // 💡 hexagrams binary are lines.reverse()
      expect(y.hexagrams.situation?.binary).toEqual(`${y.trigrams[1].binary}${y.trigrams[0].binary}`)
    })
  })
})

describe('|->Stroke Class', () => {
  it('should instantiate Stroke assigning correct string value', () => {
    const s1 = new Stroke(6)
    expect(s1.value).toEqual('0+')
    const s2 = new Stroke(7)
    expect(s2.value).toEqual('1')
    const s3 = new Stroke(9)
    expect(s3.value).toEqual('1+')
    const s4 = new Stroke(8)
    expect(s4.value).toEqual('0')
  })

  it('should have a binary and mutation property', () => {
    const s1 = new Stroke(6)
    expect(s1.binary).toEqual(0)
    expect(s1.mutation).toEqual(1)

    const s2 = new Stroke(7)
    expect(s2.binary).toEqual(1)
    expect(s2.mutation).toEqual(1)

    const s3 = new Stroke(8)
    expect(s3.binary).toEqual(0)
    expect(s3.mutation).toEqual(0)

    const s4 = new Stroke(9)
    expect(s4.binary).toEqual(1)
    expect(s4.mutation).toEqual(0)
  })

  it('should have a isMutating boolean property', () => {
    const s1 = new Stroke(6)
    expect(s1.isMutating).toEqual(true)
    const s2 = new Stroke(7)
    expect(s2.isMutating).toEqual(false)
    const s3 = new Stroke(8)
    expect(s3.isMutating).toEqual(false)
    const s4 = new Stroke(9)
    expect(s4.isMutating).toEqual(true)
  })
})
