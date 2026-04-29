export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'session-method-workbook',
    name: 'The Session Method Workbook',
    description: 'The complete futures & forex trading system - 87-page blueprint with institutional sweep mastery, DOM-confirmed entries, and session timing strategies',
    priceInCents: 4700, // $47.00
  },
]
