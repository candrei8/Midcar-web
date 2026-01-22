import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatKilometers(km: number): string {
  return new Intl.NumberFormat('es-ES').format(km) + ' km'
}

export function calculateMonthlyPayment(price: number, months: number = 60, interestRate: number = 0.0799): number {
  const monthlyRate = interestRate / 12
  const payment = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(payment)
}
