import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Printer, Check, LucideProps } from 'lucide-react';
import roomImage1 from './assets/standard single 1.jpg';
import roomImage2 from './assets/standard single 2.jpg';
import roomImage3 from './assets/standard deluxe 1.jpg';
import roomImage4 from './assets/standard deluxe 2.jpg';

// Custom CediSign icon component
const CediSign = React.forwardRef<SVGSVGElement, LucideProps>((props, ref) => {
  const { size = 24, className = "", ...rest } = props;
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M4 18h6" />
    </svg>
  );
});

CediSign.displayName = 'CediSign';

interface BookingStep {
  number: number;
  title: string;
  icon: React.ComponentType<LucideProps>;
}

const steps: BookingStep[] = [
  { number: 1, title: 'Select Date', icon: Calendar },
  { number: 2, title: 'Select Room', icon: User },
  { number: 3, title: 'Payment', icon: CediSign },
  { number: 4, title: 'Complete', icon: Check },
];

// Date utility functions
const isDateInPast = (day: number, month: number, year: number): boolean => {
  const today = new Date();
  const date = new Date(year, month, day);
  return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const generateCalendarDays = (year: number, month: number): (number | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  
  // Add the days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(i);
  }
  
  return days;
};

// Room Types
const roomTypes = [
  {
    type: 'Standard Single Room',
    images: [roomImage1, roomImage2],
    price: 220.00,
    currency: '₵'
  },
  {
    type: 'Standard Deluxe Room',
    images: [roomImage3, roomImage4],
    price: 250.00,
    currency: '₵'
  },
  {
    type: 'Penthouse Room',
    images: [], // Removed unused images
    price: 250.00,
    currency: '₵'
  }
];

// Feedback Message Component
const FeedbackMessage: React.FC<{ feedback: { type: 'success' | 'error'; message: string } | null }> = ({ feedback }) => {
  if (!feedback) return null;
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-md z-50 animate-fade-in`}>
      <p className="flex items-center">
        {feedback.type === 'success' ? '✓' : '⚠'} {feedback.message}
      </p>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  showConfirmModal: boolean;
  checkInDate: string | null;
  checkOutDate: string | null;
  selectedRoom: { type: string; currency: string } | null;
  calculateTotalPrice: () => number;
  setShowConfirmModal: (show: boolean) => void;
  handleCompleteBooking: () => void;
}> = ({
  showConfirmModal,
  checkInDate,
  checkOutDate,
  selectedRoom,
  calculateTotalPrice,
  setShowConfirmModal,
  handleCompleteBooking
}) => {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
        <p className="mb-4">Please confirm your booking details:</p>
        <div className="space-y-2 mb-6">
          <p><strong>Check-in:</strong> {checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
          <p><strong>Room:</strong> {selectedRoom?.type}</p>
          <p><strong>Total:</strong> {selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              handleCompleteBooking();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

const Booking: React.FC = () => {
  // State declarations
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [selectedRoomCount, setSelectedRoomCount] = useState(1);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<null | typeof roomTypes[0]>(null);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Utility functions that depend on state
  const isDateInRange = (day: number | null, month: number, year: number): boolean => {
    if (day === null || !checkInDate || !checkOutDate) return false;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const current = new Date(year, month, day);
    return current >= start && current <= end;
  };

  const calculateNumberOfNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    const numberOfNights = calculateNumberOfNights();
    return selectedRoom.price * numberOfNights * selectedRoomCount;
  };

  // Event handlers
  const handleDateSelection = (day: number) => {
    if (!isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear())) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  const handleSelectChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  const handleDateClick = (day: number | null, month: number, year: number) => {
    if (day === null) return;
    
    const date = new Date(year, month, day);
    const formattedDate = date.toISOString().split('T')[0];
    if (!checkInDate) {
      setCheckInDate(formattedDate);
    } else if (!checkOutDate && formattedDate !== checkInDate) {
      setCheckOutDate(formattedDate);
    } else {
      setCheckInDate(formattedDate);
      setCheckOutDate(null);
    }
  };

  const handleSearch = () => {
    if (checkInDate && checkOutDate) {
      setShowRoomSelection(true);
      setActiveStep(2);
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    if (method !== 'momo') {
      setPaymentProof(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleCompleteBooking = () => {
    setShowPayment(false);
    setShowComplete(true);
    setActiveStep(4);
    sendEmail('lavimacroyalhotels@gmail.com');
    sendSMS(['+233248676262', '+233551390039']);
  };

  const sendEmail = async (email: string) => {
    try {
      setIsLoading(true);
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Booking Confirmation - Lavimac Royal Hotels',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d; text-align: center; padding: 20px;">Booking Confirmation</h1>
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px;">
                <h2 style="color: #2d3748;">Thank you for booking with Lavimac Royal Hotels!</h2>
                <div style="margin: 20px 0;">
                  <h3 style="color: #4a5568;">Booking Details:</h3>
                  <p><strong>Check-in:</strong> ${checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> ${checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
                  <p><strong>Room:</strong> ${selectedRoom?.type}</p>
                  <p><strong>Number of Nights:</strong> ${calculateNumberOfNights()}</p>
                  <p><strong>Total Amount:</strong> ${selectedRoom?.currency} ${calculateTotalPrice().toFixed(2)}</p>
                </div>
                <div style="background-color: #e2e8f0; padding: 15px; border-radius: 4px; margin-top: 20px;">
                  <p style="margin: 0;"><strong>Need assistance?</strong></p>
                  <p style="margin: 5px 0;">Contact us at: support@lavimacroyal.com</p>
                  <p style="margin: 5px 0;">Phone: +233 248676262</p>
                </div>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #718096; font-size: 0.875rem;">
                <p>Lavimac Royal Hotels</p>
                <p>123 Main Street, Accra, Ghana</p>
              </div>
            </div>
          `
        }),
      });
      setFeedback({ type: 'success', message: 'Booking confirmation email sent successfully!' });
    } catch (error) {
      console.error('Failed to send email:', error);
      setFeedback({ type: 'error', message: 'Failed to send confirmation email. Please contact support.' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMS = async (numbers: string[]) => {
    try {
      setIsLoading(true);
      await Promise.all(numbers.map(number => 
        fetch('/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: number,
            message: `New booking at Lavimac Royal Hotels:
Room: ${selectedRoom?.type}
Check-in: ${checkInDate && new Date(checkInDate).toLocaleDateString()}
Check-out: ${checkOutDate && new Date(checkOutDate).toLocaleDateString()}
Nights: ${calculateNumberOfNights()}
Total: ${selectedRoom?.currency} ${calculateTotalPrice().toFixed(2)}
Guest Contact: [Guest Phone Number]
Thank you for choosing Lavimac Royal!`
          }),
        })
      ));
      setFeedback({ type: 'success', message: 'Booking notifications sent successfully!' });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      setFeedback({ type: 'error', message: 'Failed to send SMS notifications. Please contact support.' });
    } finally {
      setIsLoading(false);
    }
  };

  const printReceipt = () => {
    const receiptContent = document.createElement('div');
    receiptContent.innerHTML = `
      <div style="padding: 20px; max-width: 400px; margin: 0 auto;">
        <h2 style="text-align: center;">Lavimac Royal Hotels</h2>
        <h3 style="text-align: center;">Booking Receipt</h3>
        <hr />
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Check-in:</strong> ${checkInDate}</p>
        <p><strong>Check-out:</strong> ${checkOutDate}</p>
        <p><strong>Room Type:</strong> ${selectedRoom?.type}</p>
        <p><strong>Number of Nights:</strong> ${calculateNumberOfNights()}</p>
        <p><strong>Total Amount:</strong> ${selectedRoom?.currency} ${calculateTotalPrice()}</p>
        <hr />
        <p style="text-align: center; font-size: 12px;">Thank you for choosing Lavimac Royal Hotels!</p>
      </div>
    `;

    const printWindow = window.open('', '', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt</title>
          </head>
          <body>
            ${receiptContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) {
      setFeedback({ type: 'error', message: 'Please complete all required booking information.' });
      return;
    }

    try {
      setIsLoading(true);
      // Send notifications
      await Promise.all([
        // Email confirmation
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'lavimacroyalhotels@gmail.com',
            subject: 'New Booking - Lavimac Royal Hotels',
            text: `New booking details:
Room: ${selectedRoom.type}
Check-in: ${new Date(checkInDate).toLocaleDateString()}
Check-out: ${new Date(checkOutDate).toLocaleDateString()}
Nights: ${calculateNumberOfNights()}
Total: ${selectedRoom.currency} ${calculateTotalPrice().toFixed(2)}`,
          }),
        }),
        // SMS notifications
        fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: ['+233248676262', '+233551390039'],
            message: `New booking at Lavimac Royal:
Room: ${selectedRoom.type}
Check-in: ${new Date(checkInDate).toLocaleDateString()}
Check-out: ${new Date(checkOutDate).toLocaleDateString()}
Nights: ${calculateNumberOfNights()}
Total: ${selectedRoom.currency} ${calculateTotalPrice().toFixed(2)}`,
          }),
        }),
      ]);

      setFeedback({ type: 'success', message: 'Booking submitted successfully!' });
      setShowConfirmModal(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setFeedback({ type: 'error', message: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveStep(1);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <FeedbackMessage feedback={feedback} />
      <ConfirmationModal 
        showConfirmModal={showConfirmModal}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        selectedRoom={selectedRoom}
        calculateTotalPrice={calculateTotalPrice}
        setShowConfirmModal={setShowConfirmModal}
        handleCompleteBooking={handleCompleteBooking}
      />
      
      {/* Add loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="max-w-5xl mx-auto bg-black rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center ${
                  activeStep >= step.number ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    activeStep >= step.number
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-400'
                  }`}
                >
                  <step.icon size={16} />
                </div>
                <span className="ml-2 text-sm font-medium">{step.title}</span>
                {step.number < steps.length && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      activeStep > step.number ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300">
            {/* Date Selection Step */}
            {activeStep === 1 && (
              <div className="space-y-8">                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Panel - Hotel Selection */}
                  <div className="bg-black p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-white mb-6">Booking Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Adults</p>
                        <select 
                          value={adultCount} 
                          onChange={(e) => handleSelectChange(e.target.value, setAdultCount)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          {[1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Children</p>
                        <select 
                          value={childCount} 
                          onChange={(e) => handleSelectChange(e.target.value, setChildCount)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          {[0, 1, 2, 3].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Rooms</p>
                        <select 
                          value={roomCount} 
                          onChange={(e) => handleSelectChange(e.target.value, setRoomCount)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          {[1, 2, 3].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        className="mt-6 w-full bg-black text-white py-3 rounded border border-white hover:bg-gray-800"
                        onClick={handleSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="md:col-span-2 bg-black p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-white hover:bg-gray-800 rounded-full">
                        <ChevronLeft size={24} />
                      </button>
                      <div className="text-xl mx-4 text-white font-semibold">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-white hover:bg-gray-800 rounded-full">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center py-2 text-gray-400">
                          {day}
                        </div>
                      ))}
                      {generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((day, index) => (
                        <div
                          key={index}
                          className={`text-center py-2 ${
                            day === null
                              ? ''
                              : isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear())
                              ? 'text-gray-600 cursor-not-allowed'
                              : isDateInRange(day, currentMonth.getMonth(), currentMonth.getFullYear())
                              ? 'bg-blue-900 bg-opacity-50 text-white cursor-pointer'
                              : 'text-white cursor-pointer hover:bg-gray-800'
                          }`}
                          onClick={() => {
                            if (day !== null && !isDateInPast(day, currentMonth.getMonth(), currentMonth.getFullYear())) {
                              handleDateClick(day, currentMonth.getMonth(), currentMonth.getFullYear());
                            }
                          }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-center text-gray-400">
                      Select your dates by clicking on the calendar above
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-white">Check-in: {checkInDate ? new Date(checkInDate).toLocaleDateString() : 'Not selected'}</p>
                      <p className="text-white">Check-out: {checkOutDate ? new Date(checkOutDate).toLocaleDateString() : 'Not selected'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Room Selection Step */}
            {activeStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8 bg-black p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-white mb-4">Select Your Room</h2>
                  <p className="text-gray-400">Choose from our luxurious room options</p>
                </div>

                <div className="grid gap-8">
                  {roomTypes.map((room, index) => (
                    <div key={index} 
                      className={`bg-black rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
                        selectedRoom?.type === room.type ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-96 h-64">
                          <img 
                            src={room.images[0]}
                            alt={room.type}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <h3 className="text-2xl font-bold text-white mb-4">{room.type}</h3>
                          <div className="space-y-4">
                            <p className="text-gray-400">Experience luxury and comfort in our carefully designed rooms</p>
                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-white">
                                {room.currency}{room.price.toFixed(2)}
                                <span className="text-sm text-gray-400">/night</span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedRoom(room);
                                  setShowPayment(true);
                                  setActiveStep(3);
                                }}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                              >
                                Select Room
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Step */}
            {activeStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8 bg-black p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
                  <p className="text-gray-400">Complete your booking with secure payment</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Booking Summary */}
                  <div className="bg-black p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-white mb-6">Booking Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 mb-2">Check-in Date</p>
                        <p className="text-xl font-bold text-white">{checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2">Check-out Date</p>
                        <p className="text-xl font-bold text-white">{checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2">Room Type</p>
                        <p className="text-xl font-bold text-white">{selectedRoom?.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2">Total Amount</p>
                        <p className="text-xl font-bold text-white">{selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="md:col-span-2 bg-black p-6 rounded-xl shadow-md">
                    <form className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">First Name</label>
                          <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">Last Name</label>
                          <input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Email Address</label>
                        <input type="email" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                        <input type="tel" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">Apply Coupon</label>
                        <div className="flex gap-2">
                          <input type="text" className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" />
                          <button
                            onClick={() => {}}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                          >
                            Apply Coupon
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-lg font-semibold mb-2 text-white">Select Payment Method</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="payment" 
                              value="momo" 
                              className="form-radio"
                              onChange={() => handlePaymentMethodChange('momo')}
                              checked={selectedPaymentMethod === 'momo'}
                            />
                            <span className="text-white">Mobile Money</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="payment" 
                              value="arrival" 
                              className="form-radio"
                              onChange={() => handlePaymentMethodChange('arrival')}
                              checked={selectedPaymentMethod === 'arrival'}
                            />
                            <span className="text-white">Pay On Arrival</span>
                          </label>
                        </div>
                      </div>

                      {/* Mobile Money Upload Section */}
                      {selectedPaymentMethod === 'momo' && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                          <p className="text-sm text-white mb-3">Please upload a screenshot of your Mobile Money payment confirmation message</p>
                          <div className="flex flex-col space-y-2">
                            <label className="relative cursor-pointer bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-center transition-colors">
                              <span>{paymentProof ? paymentProof.name : 'Choose Screenshot'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                required={selectedPaymentMethod === 'momo'}
                              />
                            </label>
                            {paymentProof && (
                              <div className="text-sm text-green-500">
                                ✓ Screenshot uploaded successfully
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500"
                        disabled={selectedPaymentMethod === 'momo' && !paymentProof}
                        onClick={handleCompleteBooking}
                      >
                        {selectedPaymentMethod === 'momo' ? 'Complete Booking' : 'Proceed To Payment'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Step */}
            {activeStep === 4 && (
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="bg-green-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
                  <Check size={48} className="text-white" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-8">Thank you for choosing Lavimac Royal Hotels</p>
                </div>

                <div className="bg-black p-8 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-white mb-6">Booking Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 mb-2">Check-in Date</p>
                      <p className="text-xl font-bold text-white">{checkInDate && new Date(checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">Check-out Date</p>
                      <p className="text-xl font-bold text-white">{checkOutDate && new Date(checkOutDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">Room Type</p>
                      <p className="text-xl font-bold text-white">{selectedRoom?.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">Total Amount</p>
                      <p className="text-xl font-bold text-white">{selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={printReceipt}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
                  >
                    <Printer className="mr-2" size={20} />
                    Print Receipt
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors duration-300"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
