export class Stroke {
  readonly draw: number
  value: string

  constructor(draw: number) {
    this.draw = draw
    this.value = draw % 2 === 0 ? '0' : '1'
  }

  get binary() {
    return parseInt(this.value[0])
  }

  get oppositeBinary() {
    return this.binary === 0 ? 1 : 0
  }

  get isYing() {
    return this.draw === 6
  }

  get isYang() {
    return this.draw === 9
  }
}
