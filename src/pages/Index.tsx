import { useState } from "react";
import { Calendar, Users, Clock, Building2, CheckCircle2, Shield, Eye, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import SlotSelector from "@/components/SlotSelector";
import BookingForm, { BookingData } from "@/components/BookingForm";
import BookingWorkflowDialog from "@/components/BookingWorkflowDialog";
import FeatureCard from "@/components/FeatureCard";
import ViewBookedDetails from "@/pages/ViewBookedDetails";
import mecLogo from "@/assets/mec-logo.png";
import { BookingService } from "@/services/bookingService";
import { toast } from "@/hooks/use-toast";

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

  // Workflow dialog state
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [workflowArangam, setWorkflowArangam] = useState<string | null>(null);
  const [isMGWorkflow, setIsMGWorkflow] = useState(false);

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

  const handleArangamSelect = (arangamId: string) => {
    setWorkflowArangam(arangamId);
    setIsMGWorkflow(false);
    setWorkflowDialogOpen(true);
  };

  const handleMGAuditoriumClick = () => {
    setWorkflowArangam(null);
    setIsMGWorkflow(true);
    setWorkflowDialogOpen(true);
  };

  const handleWorkflowComplete = (data: BookingData) => {
    setBookings([...bookings, data]);
  };

  const downloadAllBookings = async () => {
    try {
      const result = await BookingService.getAllBookingsCombined();

      if (!result.success || !result.data || result.data.length === 0) {
        toast({
          title: "No Data",
          description: "No booking records found to download.",
          variant: "destructive"
        });
        return;
      }

      // Format data for Excel
      const excelData = result.data.map((booking) => ({
        'Booking ID': booking.id,
        'Event Name': booking.event_name,
        'Event Type': booking.event_type,
        'Department': booking.department,
        'Year': booking.year,
        'Arangam': booking.arangam_name || 'MG Auditorium',
        'Booking Date': new Date(booking.booking_date).toLocaleDateString('en-IN'),
        'Time Slot': booking.slot_type,
        'Coordinator Name': booking.coordinator_name,
        'Coordinator Email': booking.coordinator_email,
        'Contact Number': booking.contact_number,
        'Remarks': booking.remarks || '',
        'Status': booking.status || 'pending',
        'Booked On': new Date(booking.created_at || '').toLocaleString('en-IN')
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 10 },  // Booking ID
        { wch: 25 },  // Event Name
        { wch: 20 },  // Event Type
        { wch: 30 },  // Department
        { wch: 12 },  // Year
        { wch: 25 },  // Arangam
        { wch: 15 },  // Booking Date
        { wch: 15 },  // Time Slot
        { wch: 25 },  // Coordinator Name
        { wch: 30 },  // Coordinator Email
        { wch: 15 },  // Contact Number
        { wch: 40 },  // Remarks
        { wch: 12 },  // Status
        { wch: 20 },  // Booked On
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0];
      const filename = `Auditorium_Bookings_${today}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Download Successful",
        description: `${result.data.length} booking(s) downloaded as ${filename}`,
      });
    } catch (error) {
      console.error('Error downloading bookings:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download booking data. Please try again.",
        variant: "destructive"
      });
    }
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
              onClick={() => {
                setShowMGBookingPage(false);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm md:text-base">
              <div className="bg-green-700 p-3 rounded-lg">
                <p className="font-semibold mb-1">Phone</p>
                <p>+91 9865584709</p>
              </div>
              <div className="bg-green-700 p-3 rounded-lg">
                <p className="font-semibold mb-1">Email</p>
                <p className="break-all">auditorium@mahendra.info</p>
              </div>
              <div className="bg-green-700 p-3 rounded-lg sm:col-span-2 lg:col-span-1">
                <p className="font-semibold mb-1">Office Hours</p>
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
              <span className="underline-animate">Welcome to Arangam booking Portal</span>
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Reserve the college arangam for your Department events, Seminars,
              Workshops, and Cultural programs with just a few click.
            </p>
          </div>

          {/* MG AUDITORIUM Display */}
          <div className="flex justify-center">
            <button
              onClick={handleMGAuditoriumClick}
              className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-bold shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
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
          {/* Arangam Selection */}
          <div className="animate-slide-in-up mb-8">
            <SlotSelector
              selectedDate={selectedDate}
              onDateChange={(date) => setSelectedDate(date || null)}
              selectedSlot={selectedSlot}
              onSlotChange={setSelectedSlot}
              selectedArangam={selectedArangam}
              onArangamChange={setSelectedArangam}
              onArangamSelect={handleArangamSelect}
              bookedSlots={bookedSlots}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
            <button
              onClick={() => window.location.href = '/view-bookings'}
              className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-bold shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border-2 border-blue-500 hover:border-blue-300"
            >
              {/* Ripple effect background */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-200 rounded-lg"></div>

              {/* Side accent bars */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-l-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

              <span className="relative z-10 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Booked Details
              </span>
            </button>

            <button
              onClick={downloadAllBookings}
              className="group relative px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-bold shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border-2 border-green-500 hover:border-green-300"
            >
              {/* Ripple effect background */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity duration-200 rounded-lg"></div>

              {/* Side accent bars */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-r-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-l-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

              <span className="relative z-10 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Booking Workflow Dialog */}
      <BookingWorkflowDialog
        open={workflowDialogOpen}
        onOpenChange={setWorkflowDialogOpen}
        selectedArangam={workflowArangam}
        isMGAuditorium={isMGWorkflow}
        onBookingComplete={handleWorkflowComplete}
      />

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 px-4 md:px-8 border-4 border-orange-500 hover:border-orange-600 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="font-bold text-lg mb-4">Contact Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-sm md:text-base mb-6">
            <div className="bg-green-700 p-4 rounded-lg">
              <p className="font-semibold mb-2">Phone</p>
              <p>+91  9865584709</p>
            </div>
            <div className="bg-green-700 p-4 rounded-lg">
              <p className="font-semibold mb-2">Email</p>
              <p className="break-all">mecarangambooking@gmail.com</p>
            </div>
            <div className="bg-green-700 p-4 rounded-lg sm:col-span-2 lg:col-span-1">
              <h4 className="font-bold text-base mb-2">Developed By</h4>
              <p className="text-sm">M Adithya</p>
              <p className="text-sm">V Akash</p>
              <p className="text-sm">K GaneshWar</p>
              <p className="text-xs mt-1">Department of Artificial Intelligence <br /> & <br /> Data Science</p>
            </div>
          </div>
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Mahendra Engineering College. <br /> All rights reserved.
          </p>
          <p className="text-xs opacity-50 mt-2">
            For technical support contact us
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
