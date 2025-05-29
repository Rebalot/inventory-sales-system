import { PaymentMethod } from "@prisma/client"

export interface CreateOrderInput {
  customerId: string
  paymentMethod: PaymentMethod
  items: Array<{
    productId: string
    quantity: number
  }>
}