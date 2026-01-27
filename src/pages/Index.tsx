import { useState } from "react";
import { Calendar, Users, Clock, Building2, CheckCircle2, Shield, Eye } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import SlotSelector from "@/components/SlotSelector";
import BookingForm, { BookingData } from "@/components/BookingForm";
import FeatureCard from "@/components/FeatureCard";
import ViewBookedDetails from "@/pages/ViewBookedDetails";
import mecLogo from "@/assets/mec-logo.png";

interface IndexProps {
  onShowDatabaseSetup?: () => void;
}

const Index = ({ onShowDatabaseSetup }: IndexProps = {}) => {
  const [showBookingPage, setShowBookingPage] = useState(false);
  const [showMGBookingPage, setShowMGBookingPage] = useState(false);
  const [showViewBookedDetails, setShowViewBookedDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedArangam, setSelectedArangam] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Mock booked slots for demonstration
  const bookedSlots: { date: string; slot: string }[] = [];

  const handleBookingSubmit = (data: BookingData) => {
    setBookings([...bookings, data]);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSelectedArangam(null);
  };

  const handleMGBookingSubmit = (data: BookingData) => {
    setBookings([...bookings, data]);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Select your preferred date and time slot with our intuitive booking calendar.",
    },
    {
      icon: Shield,
      title: "Faculty Access Only",
      description: "Secure booking system exclusively for verified faculty members.",
    },
    {
      icon: Clock,
      title: "Flexible Slots",
      description: "Choose from full day, forenoon, or afternoon sessions.",
    },
    {
      icon: CheckCircle2,
      title: "Instant Confirmation",
      description: "Get immediate booking confirmation via email.",
    },
  ];

  // Show View Booked Details page
  if (showViewBookedDetails) {
    return (
      <ViewBookedDetails onBack={() => setShowViewBookedDetails(false)} />
    );
  }

  // MG Auditorium Booking Page
  if (showMGBookingPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header logoSrc="/MEC-NKL1_logo.png" />
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setShowMGBookingPage(false)}
              className="mb-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              ← Back to Home
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="animate-slide-in-up">
                <SlotSelector
                  selectedDate={selectedDate}
                  onDateChange={(date) => setSelectedDate(date || null)}
                  selectedSlot={selectedSlot}
                  onSlotChange={setSelectedSlot}
                  bookedSlots={bookedSlots}
                  showArangam={false}
                />
              </div>
              <div className="animate-slide-in-up">
                <div className="bg-card p-6 lg:p-8 rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-gray-300">
                  <h3 className="font-display text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                    <Building2 className="w-6 h-6" />
                    MG Auditorium Booking
                  </h3>
                  <div className="w-16 h-1 bg-accent rounded-full mb-6" />
                  <BookingForm
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onSubmit={handleMGBookingSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Contact Details */}
        <footer className="bg-green-800 text-white py-6 px-4 mt-8">
          <div className="max-w-7xl mx-auto text-center">
            <h4 className="font-bold text-lg mb-2">Contact Details</h4>
            <div className="grid grid-cols-3 gap-1 md:gap-4 text-[10px] md:text-sm">
              <div>
                <p className="font-semibold">Phone</p>
                <p>+91 12345 67890</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="break-all">auditorium@mahendra.info</p>
              </div>
              <div>
                <p className="font-semibold">Office Hours</p>
                <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header logoSrc="/MEC-NKL1_logo.png" />

      {/* Hero Section */}
      <section className="relative py-12 px-4 md:px-8 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              <span className="underline-animate">Welcome to Auditorium booking Portal</span>
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Reserve the college auditorium for your department events, seminars,
              workshops, and cultural programs with just a few clicks.
            </p>
          </div>

          {/* MG AUDITORIUM Display */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowMGBookingPage(true)}
              className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-bold shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border-2 border-blue-500 hover:border-blue-300"
            >
              {/* Ripple effect background */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-200 rounded-lg"></div>
              
              {/* Side accent bars */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-l-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              
              <span className="relative z-10">
                BOOK MG AUDITORIUM
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Slot Selector */}
            <div className="animate-slide-in-up" style={{ animationDelay: "100ms" }}>
              <SlotSelector
                selectedDate={selectedDate}
                onDateChange={(date) => setSelectedDate(date || null)}
                selectedSlot={selectedSlot}
                onSlotChange={setSelectedSlot}
                selectedArangam={selectedArangam}
                onArangamChange={setSelectedArangam}
                bookedSlots={bookedSlots}
              />
            </div>

            {/* Right Side - Booking Form */}
            <div className="animate-slide-in-up space-y-6">
              <div className="bg-card p-6 lg:p-8 rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 border-gray-300">
                <h3 className="font-display text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  Booking Details
                </h3>
                <div className="w-16 h-1 bg-accent rounded-full mb-6" />

                <BookingForm
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedArangam={selectedArangam}
                  onSubmit={handleBookingSubmit}
                />
              </div>
              
              {/* View Booked Details Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowViewBookedDetails(true)}
                  className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-bold shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border-2 border-blue-500 hover:border-blue-300"
                >
                  {/* Ripple effect background */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-200 rounded-lg"></div>
                  
                  {/* Side accent bars */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-l-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    View Booked Details
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 px-4 md:px-8 border-4 border-orange-500 hover:border-orange-600 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="font-bold text-lg mb-4">Contact Details</h4>
          <div className="grid grid-cols-3 gap-1 md:gap-4 text-[10px] md:text-sm mb-6">
            <div>
              <p className="font-semibold">Phone</p>
              <p>+91 12345 67890</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="break-all">auditorium@mahendra.info</p>
            </div>
            <div>
              <p className="font-semibold">Office Hours</p>
              <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
            </div>
          </div>
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Mahendra Engineering College. All rights reserved.
          </p>
          <p className="text-xs opacity-50 mt-2">
            For technical support, contact administrator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
