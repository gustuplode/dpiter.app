import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

export function getCollectionUrl(id: string, title: string): string {
  const slug = generateSlug(title)
  return `/collections/${id}/${slug}`
}

export function getProductUrl(id: string, title: string, type: 'collection' | 'category'): string {
  const slug = generateSlug(title)
  if (type === 'collection') {
    return `/products/collection/${id}/${slug}`
  }
  return `/products/${id}/${slug}`
}
