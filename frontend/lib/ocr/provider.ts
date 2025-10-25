import { TesseractAdapter } from "./adapters/tesseract";
import { VisionAdapter } from "./adapters/vision";
import { AzureAdapter } from "./adapters/azure";

export type OCRProviderName = "vision" | "azure" | "tesseract";

export function getOCR(): { name: OCRProviderName; impl: any } {
  const name = (process.env.OCR_PROVIDER as OCRProviderName) || "tesseract";
  switch (name) {
    case "vision":
      return {
        name,
        impl: new VisionAdapter({
          region: process.env.OCR_REGION,
          project: process.env.OCR_GOOGLE_PROJECT
        })
      };
    case "azure":
      return {
        name,
        impl: new AzureAdapter({
          endpoint: process.env.AZURE_EP || "",
          key: process.env.AZURE_KEY || ""
        })
      };
    default:
      return { name: "tesseract" as const, impl: new TesseractAdapter() };
  }
}
