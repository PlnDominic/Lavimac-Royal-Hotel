import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Printer, Check } from 'lucide-react';
import roomImage1 from './assets/standard single 1.jpg';
import roomImage2 from './assets/standard single 2.jpg';
import roomImage3 from './assets/standard deluxe 1.jpg';
import roomImage4 from './assets/standard deluxe 2.jpg';
import roomImage5 from './assets/The_Penthouse_1.jpg';
import roomImage6 from './assets/The_Penthouse_2.jpg';

// Custom CediSign icon component
const CediSign = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3v18" />
    <path d="M17 5H9.5a4.5 4.5 0 0 0 0 9h5a4.5 4.5 0 0 1 0 9H6" />
  </svg>
);

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Set to current date
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [selectedRoomCount, setSelectedRoomCount] = useState<number>(1);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [adultCount, setAdultCount] = useState<number>(1);
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<null | typeof roomTypes[0]>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const steps = [
    { number: 1, title: 'Select Date', icon: Calendar },
    { number: 2, title: 'Select Room', icon: User },
    { number: 3, title: 'Payment', icon: CediSign },
    { number: 4, title: 'Complete', icon: Check },
  ];

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDay = new Date(year, month, i);
      // Allow today's date
      if (currentDay.toDateString() === today.toDateString()) {
        days.push(i);
      } else {
        days.push(i);
      }
    }
    
    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  const nextMonthDays = generateCalendarDays(nextMonth.getFullYear(), nextMonth.getMonth());

  const nextMonthYear = nextMonth.getFullYear();
  const nextMonthMonth = nextMonth.getMonth();

  const nextNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1);

  const nextNextMonthDays = generateCalendarDays(nextNextMonth.getFullYear(), nextNextMonth.getMonth());

  const nextNextMonthYear = nextNextMonth.getFullYear();
  const nextNextMonthMonth = nextNextMonth.getMonth();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextNextMonthFunc = () => {
    setCurrentMonth(new Date(nextNextMonth.getFullYear(), nextNextMonth.getMonth()));
  };

  const handleDateClick = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    if (!checkInDate) {
        setCheckInDate(formattedDate);
    } else if (!checkOutDate && formattedDate !== checkInDate) {
        setCheckOutDate(formattedDate);
    } else {
        // Reset the dates if both are selected or the same date is clicked
        setCheckInDate(formattedDate);
        setCheckOutDate(null);
    }
    // Ensure that no active step change occurs here
};

  const isDateInRange = (date: number, month: number, year: number) => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const current = new Date(year, month, date);
      return current >= start && current <= end;
    }
    return false;
  };

  const today = new Date();

  const isPastDate = (day: number, month: number, year: number) => {
    const dateToCheck = new Date(year, month, day);
    return dateToCheck < today; // This allows today to be selectable
  };

  useEffect(() => {
    setActiveStep(1);
  }, []);

  // Add room types data
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
      images: [roomImage5, roomImage6],
      price: 250.00,
      currency: '₵'
    }
  ];

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

  const handleSearch = () => {
    if (checkInDate && checkOutDate) {
      setShowRoomSelection(true);
      setActiveStep(2); // Move to the next step
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
    // Hide the payment section
    setShowPayment(false);
    // Show the complete section
    setShowComplete(true);
    // Set active step to Complete
    setActiveStep(4);
    // Send email notification
    sendEmail('lavimacroyalhotels@gmail.com');
    // Send SMS notifications
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
                  <p><strong>Check-in:</strong> ${checkInDate && new Date(checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Check-out:</strong> ${checkOutDate && new Date(checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Room Type:</strong> ${selectedRoom?.type}</p>
                  <p><strong>Number of Nights:</strong> ${calculateNumberOfNights()}</p>
                  <p><strong>Total Amount:</strong> ${selectedRoom?.currency}${calculateTotalPrice().toFixed(2)}</p>
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
Total: ${selectedRoom?.currency}${calculateTotalPrice().toFixed(2)}
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
    const bookingDetails = {
      checkInDate,
      checkOutDate,
      roomType: selectedRoom?.type,
      totalAmount: calculateTotalPrice(),
    };

    try {
      // Sending email confirmation
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'lavimacroyalhotels@gmail.com',
          subject: 'Booking Confirmation',
          text: `Your booking details: ${JSON.stringify(bookingDetails)}`,
        }),
      });

      // Sending SMS notifications
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ['+233(0)248676262', '+233(0)551390039'],
          message: `Your booking details: ${JSON.stringify(bookingDetails)}`,
        }),
      });

      alert('Confirmation sent!');
    } catch (error) {
      console.error('Error sending confirmation:', error);
      alert('Failed to send confirmation.');
    }
  };

  const renderCompleteSection = () => {
    if (!showComplete) return null;

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 font-georgia">Booking Complete</h2>
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600 flex items-center font-georgia"><Calendar className="mr-2" />Check-in Date: <strong className="text-gray-800 font-georgia">{checkInDate && new Date(checkInDate).toLocaleDateString()}</strong></p>
          <p className="text-gray-600 flex items-center font-georgia"><Calendar className="mr-2" />Check-out Date: <strong className="text-gray-800 font-georgia">{checkOutDate && new Date(checkOutDate).toLocaleDateString()}</strong></p>
          <p className="text-gray-600 flex items-center font-georgia"><User className="mr-2" />Room Type: <strong className="text-gray-800 font-georgia">{selectedRoom?.type}</strong></p>
          <p className="text-gray-600 flex items-center font-georgia"><CediSign className="mr-2" />Total Amount: <strong className="text-gray-800 font-georgia">{selectedRoom?.currency} {calculateTotalPrice().toFixed(2)}</strong></p>
        </div>
        <div className="flex justify-center">
          <button onClick={printReceipt} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300">Print Receipt</button>
        </div>
      </div>
    );
  };

  const FeedbackMessage = () => {
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

  const ConfirmationModal = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Add Feedback Message */}
      <FeedbackMessage />
      
      {/* Add Confirmation Modal */}
      <ConfirmationModal />
      
      {/* Add loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
            <p className="mt-6 text-center text-lg font-semibold text-gray-800">Processing your booking...</p>
          </div>
        </div>
      )}
      
      {/* Rest of the component */}
      {/* Add spacing for fixed navbar */}
      <div className="h-16"></div>
      <div className="h-12"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="max-w-5xl mx-auto bg-black rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 relative">
                <div className={`flex flex-col items-center ${index !== steps.length - 1 ? 'after:content-[""] after:absolute after:top-7 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-700' : ''}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    activeStep === step.number
                      ? 'bg-blue-500 text-white ring-4 ring-blue-900'
                      : activeStep > step.number
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  } transition-all duration-300 ease-in-out`}>
                    {React.createElement(step.icon, { size: 24 })}
                  </div>
                  <span className={`mt-2 font-medium ${
                    activeStep === step.number ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
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
                        <p className="text-gray-400 text-sm mb-1">Hotel</p>
                        <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white">
                          <option value="lavimac">Lavimac Royal Hotel</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Adults</p>
                        <select 
                          value={adultCount} 
                          onChange={(e) => setAdultCount(parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          {[1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Children</p>
                        <select 
                          value={0} 
                          onChange={(e) => {}}
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
                          onChange={(e) => setRoomCount(parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          {[1, 2, 3].map(num => (
                            <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
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
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })} / {nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-white hover:bg-gray-800 rounded-full">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* First Month Calendar */}
                      <div>
                        <div className="grid grid-cols-7 gap-2">
                          {weekDays.map((day) => (
                            <div key={day} className="text-center py-2 font-bold text-gray-400">
                              {day}
                            </div>
                          ))}
                          {monthDays.map((day, index) => (
                            <div
                              key={index}
                              className={`text-center py-2 rounded-lg transition-colors duration-200 ${
                                day ? 'hover:bg-gray-800 cursor-pointer' : ''
                              } ${
                                checkInDate === `${day}` ? 'bg-blue-500 text-white' : ''
                              } ${
                                checkOutDate === `${day}` ? 'bg-blue-500 text-white' : ''
                              } ${
                                isDateInRange(day, currentMonth.getMonth(), currentMonth.getFullYear()) 
                                  ? 'bg-blue-900 bg-opacity-50 text-white' 
                                  : 'text-white'
                              } ${
                                isPastDate(day, currentMonth.getMonth(), currentMonth.getFullYear()) 
                                  ? 'cursor-not-allowed text-gray-600 hover:bg-transparent' 
                                  : ''
                              }`}
                              onClick={() => day && !isPastDate(day, currentMonth.getMonth(), currentMonth.getFullYear()) && handleDateClick(day, currentMonth.getMonth(), currentMonth.getFullYear())}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Second Month Calendar */}
                      <div>
                        <div className="grid grid-cols-7 gap-2">
                          {weekDays.map((day) => (
                            <div key={day} className="text-center py-2 font-bold text-gray-400">
                              {day}
                            </div>
                          ))}
                          {nextMonthDays.map((day, index) => (
                            <div
                              key={index}
                              className={`text-center py-2 rounded-lg transition-colors duration-200 ${
                                day ? 'hover:bg-gray-800 cursor-pointer' : ''
                              } ${
                                checkInDate === `${day}` ? 'bg-blue-500 text-white' : ''
                              } ${
                                checkOutDate === `${day}` ? 'bg-blue-500 text-white' : ''
                              } ${
                                isDateInRange(day, nextMonth.getMonth(), nextMonth.getFullYear()) 
                                  ? 'bg-blue-900 bg-opacity-50 text-white' 
                                  : 'text-white'
                              } ${
                                isPastDate(day, nextMonth.getMonth(), nextMonth.getFullYear()) 
                                  ? 'cursor-not-allowed text-gray-600 hover:bg-transparent' 
                                  : ''
                              }`}
                              onClick={() => day && !isPastDate(day, nextMonth.getMonth(), nextMonth.getFullYear()) && handleDateClick(day, nextMonth.getMonth(), nextMonth.getFullYear())}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
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
                    onClick={() => handleSubmit()}
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
