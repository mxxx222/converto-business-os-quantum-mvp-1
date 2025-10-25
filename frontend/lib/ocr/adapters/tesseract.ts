export class TesseractAdapter {
  async extractText(_buf: Buffer): Promise<string> {
    return `Päivä: 2024-09-12
Toimittaja: K-Market Keskusta
Rivi: Maito 2 1.60 ALV 14
Rivi: Kahvi 1 4.50 ALV 24
Yhteensä: 7.70`;
  }
}
