export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'session-method-workbook',
    name: 'The Session Blueprint',
    description: 'Complete 15-Module Trading Workbook - PDF Download',
    priceInCents: 4700, // $47.00
  },
]
