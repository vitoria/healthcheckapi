import type { ReactElement, ReactNode } from "react"
import type { NextPage } from "next"

export interface MyBusinesses {
  role: string
  business: Business
}

export interface Business {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug?: string
  address?: string
  phone?: string
  instagram_url?: string
  description?: string
  avatar_url?: string
}

export interface User {
  id: string
  created_at: string
  updated_at: string
  username: string
  full_name: string
  avatar_url?: string
}

export interface Verify {
  logged: boolean
  message?: string
  user?: User
}

export interface Hour {
  weekday: number
}

interface StaffData {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  business_id: string
  role: "EMPLOYEE" | "OWNER"
}

export interface Staff extends StaffData {
  profile: User
  hours?: Hour[]
  business?: Business
}

export interface StaffNormalized extends StaffData {
  profile: string
  hours?: string[]
}

export interface Category {
  id: string
  created_at: string
  updated_at: string
  business_id: string
  name: string
}

export interface Service {
  id: string
  created_at: string
  updated_at: string
  name: string
  price: number
  images?: string
  duration: number
  category?: Category
  business_id: string
  category_id: string
  description: string
}

export type ScheduleStatus = "WAITING" | "CONFIRMED" | "DONE" | "CANCELED"

export interface Client {
  id: string
  created_at: Date
  updated_at: Date
  business_id: string
  name: string
  phone: string
}

export interface Appointment {
  id: string
  staff: Staff
  service: Service
  client: Client
  client_id: string
  client_name?: string
  datetime: string
  status: ScheduleStatus
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export interface StaffService {
  id: string
  created_at: string
  staff_id: string
  service_id: string
  business_id: string
  staff: Staff
}

export interface AvailableTime {
  date: string
  spots: string[]
}
