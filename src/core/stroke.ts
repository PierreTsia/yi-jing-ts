export class Stroke {
  value: string

  constructor(draw: number) {
    const binary = draw % 2 === 0 ? '0' : '1'
    const change = [6, 9].includes(draw) ? '+' : ''
    this.value = binary + change
  }

  get binary() {
    return parseInt(this.value[0])
  }

  get oppositeBinary() {
    return this.binary === 0 ? 1 : 0
  }

  get isMutating() {
    return this.value[1] === '+'
  }

  get mutation() {
    return this.isMutating ? this.oppositeBinary : this.binary
  }
}
