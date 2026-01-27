import { supabase, BookingRecord } from '@/lib/supabase'
import { BookingData } from '@/components/BookingForm'

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData: BookingData): Promise<{ success: boolean; data?: BookingRecord; error?: string }> {
    try {
      const bookingRecord = {
        event_name: bookingData.eventName,
        event_type: bookingData.eventType,
        department: bookingData.department,
        year: bookingData.year,
        coordinator_name: bookingData.coordinatorName,
        coordinator_email: bookingData.coordinatorEmail,
        contact_number: bookingData.contactNumber,
        remarks: bookingData.remarks || '',
        booking_date: bookingData.date.toISOString().split('T')[0],
        slot_type: bookingData.slotType,
        arangam_name: bookingData.arangamName || null,
        status: 'approved'
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingRecord])
        .select()
        .single()

      if (error) {
        console.error('Booking creation error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get all bookings
  static async getAllBookings(): Promise<{ success: boolean; data?: BookingRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('Database table not found, returning empty results')
          return { success: true, data: [] }
        }
        console.error('Fetch bookings error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: true, data: [] } // Return empty array for better UX
    }
  }

  // Get bookings by date and slot to check availability
  static async getBookingsByDateAndSlot(date: string, slot: string, arangamName?: string): Promise<{ success: boolean; data?: BookingRecord[]; error?: string }> {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', date)
        .eq('slot_type', slot)
        .in('status', ['pending', 'approved'])

      if (arangamName) {
        query = query.eq('arangam_name', arangamName)
      }

      const { data, error } = await query

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return { success: true, data: [] }
        }
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: true, data: [] }
    }
  }

  // Check if a slot is available
  static async isSlotAvailable(date: string, slot: string, arangamName?: string): Promise<{ available: boolean; error?: string }> {
    try {
      const result = await this.getBookingsByDateAndSlot(date, slot, arangamName)
      
      if (!result.success) {
        // If there's an error but it's due to missing table, assume available
        if (result.error?.includes('relation') || result.error?.includes('does not exist')) {
          return { available: true }
        }
        return { available: false, error: result.error }
      }

      return { available: (result.data?.length || 0) === 0 }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { available: true } // Default to available if there's an error
    }
  }

  // Update booking status
  static async updateBookingStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Update booking status error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Delete booking
  static async deleteBooking(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete booking error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get bookings by coordinator email
  static async getBookingsByCoordinator(email: string): Promise<{ success: boolean; data?: BookingRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('coordinator_email', email)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch bookings by coordinator error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
}