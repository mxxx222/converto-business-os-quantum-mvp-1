export class AzureAdapter {
  constructor(private _opts: { endpoint: string; key: string }) {}

  async extractText(_buf: Buffer): Promise<string> {
    return `Päivä: 2024-09-08
Toimittaja: Lidl
Rivi: Leipä 1 2.20 ALV 14
Yhteensä: 2.51`;
  }
}
