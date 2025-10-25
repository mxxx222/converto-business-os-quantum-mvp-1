export class VisionAdapter {
  constructor(private _opts: { region?: string; project?: string } = {}) {}

  async extractText(_buf: Buffer): Promise<string> {
    return `Päivä: 2024-09-10
Toimittaja: Prisma
Rivi: Banaani 3 0.99 ALV 14
Yhteensä: 3.39`;
  }
}
