-- Drop table if exists to start fresh
DROP TABLE IF EXISTS bookings;

-- Create bookings table with all required columns
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    department VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    coordinator_name VARCHAR(255) NOT NULL,
    coordinator_email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    remarks TEXT,
    booking_date DATE NOT NULL,
    slot_type VARCHAR(20) NOT NULL CHECK (slot_type IN ('full-day', 'forenoon', 'afternoon')),
    arangam_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_date_slot ON bookings(booking_date, slot_type);
CREATE INDEX idx_bookings_coordinator ON bookings(coordinator_email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_arangam ON bookings(arangam_name);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);