import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StatusBar, Modal, Alert, Keyboard } from 'react-native';
// 1. Import hook to safely fetch device physical boundaries
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MOCK_PATIENTS } from '../constants/mockPatients';
import { CLINIC_SERVICES } from '../constants/clinicServices';

export default function BookingScreen({ onGoBack }) {
  // Fetch boundary space values dynamically (safe area pad sizing)
  const insets = useSafeAreaInsets();

  const [selectedService, setSelectedService] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // Time Slot State
  
  // Real Today anchor: July 16, 2026
  const TODAY = new Date(2026, 6, 16); 

  // Dynamic calendar viewport state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 6 is July (0-indexed)

  // Step 2 Verification State
  const [step, setStep] = useState('calendar'); 
  const [patientIdInput, setPatientIdInput] = useState('');

  // Fast Navigation Picker State
  const [showFastPicker, setShowFastPicker] = useState(false);

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const availableYears = [2026, 2027, 2028]; // Multi-year range support

  // Generate dynamic grid array for selected Month / Year viewport
  const generateMonthDays = (year, month) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    // Pad preceding empty spots
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push({ day: null });
    }
    // Populate actual month days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const weekday = (firstDayIndex + dayNum - 1) % 7;
      daysArray.push({ day: dayNum, weekday });
    }
    return daysArray;
  };

  const currentMonthDays = generateMonthDays(currentYear, currentMonth);

  const getRemainingSlots = (service, year, month, day) => {
    if (!service || !day) return 10;
    const yearBookings = service.bookings?.[year] || {};
    const monthBookings = yearBookings[month] || {};
    const bookedCount = monthBookings[day] || 0;
    return Math.max(0, (service.maxSlotsPerDay || 10) - bookedCount);
  };

  const getTodayStatus = (service) => {
    const isAvailableDay = service?.availableDays?.includes(TODAY.getDay());
    if (!isAvailableDay) {
      return "No Clinic Scheduled Today";
    }
    const remaining = getRemainingSlots(service, TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    return remaining === 0 ? "Fully Booked Today" : `${remaining} of 10 slots left today`;
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTime(null);
    setPatientIdInput('');
    setStep('calendar');
    // Reset viewport to current real date when screen opens
    setCurrentYear(TODAY.getFullYear());
    setCurrentMonth(TODAY.getMonth());
    setShowCalendar(true);
  };

  const isPastDate = (dayNum) => {
    const checkDate = new Date(currentYear, currentMonth, dayNum);
    checkDate.setHours(0,0,0,0);
    const todayZero = new Date(TODAY);
    todayZero.setHours(0,0,0,0);
    return checkDate < todayZero;
  };

  const handleSelectDate = (dateObj) => {
    if (!dateObj.day || !selectedService) return;
    
    const availableDays = selectedService.availableDays || [];
    const isAvailableDay = availableDays.includes(dateObj.weekday);
    const remainingSlots = getRemainingSlots(selectedService, currentYear, currentMonth, dateObj.day);

    if (isPastDate(dateObj.day)) {
      Alert.alert("Date Passed", "You cannot reserve a consultation slot for a date that has already passed.");
      return;
    }

    if (!isAvailableDay) {
      Alert.alert("Clinic Closed", "This clinical service is not scheduled on this day of the week.");
      return;
    }

    if (remainingSlots === 0) {
      Alert.alert("Date Fully Booked", "Sorry, all 10 slots for this date are fully taken.");
      return;
    }

    setSelectedDate(dateObj.day);
  };

  const handleMonthChange = (direction) => {
    setSelectedDate(null); // Clear selected date upon month change
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    }
  };

  const handleFastSelect = (monthIndex, year) => {
    const lastDayOfSelectedMonth = new Date(year, monthIndex + 1, 0);
    lastDayOfSelectedMonth.setHours(23, 59, 59, 999);
    
    if (lastDayOfSelectedMonth < TODAY) {
      Alert.alert("Invalid Choice", "Cannot navigate to a month that has completely passed.");
      return;
    }

    setCurrentMonth(monthIndex);
    setCurrentYear(year);
    setSelectedDate(null);
    setShowFastPicker(false);
  };

  const handleProceedToVerify = () => {
    if (!selectedDate) return;
    // Automatically select the first available time slot as default
    if (selectedService && selectedService.timeSlots?.length > 0) {
      setSelectedTime(selectedService.timeSlots[0]);
    }
    setStep('verify');
  };

  const handleConfirmBooking = () => {
    Keyboard.dismiss();
    const cleanId = patientIdInput.trim().toUpperCase();

    if (!MOCK_PATIENTS[cleanId]) {
      Alert.alert(
        "Invalid Patient ID",
        "We couldn't find a record with that Patient ID. Please check your clinical card."
      );
      return;
    }

    if (!selectedTime) {
      Alert.alert("Select Time Slot", "Please pick an appointment time to complete your booking.");
      return;
    }

    const patientName = MOCK_PATIENTS[cleanId].name;
    const remaining = getRemainingSlots(selectedService, currentYear, currentMonth, selectedDate);
    const slotNumber = 11 - remaining;

    Alert.alert(
      "Confirm Reservation",
      `Book slot #${slotNumber} on ${monthsList[currentMonth]} ${selectedDate}, ${currentYear} at ${selectedTime} for: ${patientName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm & Book", 
          onPress: () => {
            if (selectedService) {
              if (!selectedService.bookings) selectedService.bookings = {};
              if (!selectedService.bookings[currentYear]) selectedService.bookings[currentYear] = {};
              if (!selectedService.bookings[currentYear][currentMonth]) selectedService.bookings[currentYear][currentMonth] = {};
              if (!selectedService.bookings[currentYear][currentMonth][selectedDate]) {
                selectedService.bookings[currentYear][currentMonth][selectedDate] = 0;
              }
              selectedService.bookings[currentYear][currentMonth][selectedDate] += 1;
            }

            setShowCalendar(false);
            Alert.alert(
              "Reservation Confirmed!", 
              `Successfully booked for ${patientName} on ${monthsList[currentMonth]} ${selectedDate} at ${selectedTime}.`
            );
          } 
        }
      ]
    );
  };

  return (
    <View 
      className="flex-1 bg-blue-50/50"
      style={{ paddingBottom: insets.bottom }} // Handle physical home indicators at the bottom smoothly
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header with dynamic safe area padding top to avoid screen notches */}
      <View 
        className="bg-blue-900 pb-5 px-4 flex-row items-center shadow-md"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <TouchableOpacity onPress={onGoBack} className="p-1">
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center mr-7 tracking-wide">
          Book Appointment
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        
        {/* Instruction */}
        <View className="mb-6 px-1">
          <Text className="text-xl font-black text-blue-950">Select a Help Desk Service</Text>
          <Text className="text-blue-600/70 font-medium text-sm mt-1">
            Choose from the active Barangay medical services to schedule your appointment.
          </Text>
        </View>

        {/* List Title */}
        <Text className="text-xs font-bold text-blue-900/50 tracking-widest uppercase mb-3 pl-1">
          Available Programs & Schedules
        </Text>

        {/* Service Cards */}
        <View className="bg-white rounded-3xl shadow-sm border border-blue-100/50 overflow-hidden mb-8">
          {CLINIC_SERVICES.map((service, index) => {
            const todayStatusText = getTodayStatus(service);
            const isFullyBookedToday = todayStatusText.includes("Fully Booked") || todayStatusText.includes("No Clinic");

            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => handleSelectService(service)}
                className={`flex-row items-center p-5 border-b border-blue-50 active:bg-blue-50/20 ${
                  index === CLINIC_SERVICES.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <View className={`${service.bgColor || 'bg-blue-50'} p-3 rounded-xl mr-4`}>
                  <MaterialCommunityIcons name={service.icon} size={22} color={service.color || '#1e3a8a'} />
                </View>

                <View className="flex-1 pr-2">
                  <Text className="font-extrabold text-blue-950 text-[15px]">
                    {service.name}
                  </Text>
                  <Text className="text-blue-800 font-semibold text-xs mt-0.5">
                    {service.schedule}
                  </Text>
                  <Text className="text-blue-900/50 font-bold text-[10px] mt-1">
                    Attended by: {service.attendedBy}
                  </Text>
                  <Text className={`text-[11px] font-extrabold mt-2 ${
                    isFullyBookedToday ? 'text-red-500' : 'text-emerald-600'
                  }`}>
                    {todayStatusText}
                  </Text>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={22} color="#1e3a8a" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* --- ACTION SLIDE-UP CALENDAR MODAL --- */}
      {selectedService && (
        <Modal
          visible={showCalendar}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCalendar(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-[36px] p-6 shadow-2xl">
              
              <View className="w-12 h-1.5 bg-blue-100 rounded-full align-center self-center mb-6" />

              {/* Modal Header */}
              <View className="flex-row justify-between items-center mb-5">
                <View className="flex-1 pr-4">
                  <Text className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                    {step === 'calendar' ? 'Step 1: Choose Date' : 'Step 2: Time & Patient Verification'}
                  </Text>
                  <Text className="text-base font-black text-blue-950 mt-0.5">{selectedService.name}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowCalendar(false)}
                  className="bg-blue-50 p-2.5 rounded-full"
                >
                  <MaterialCommunityIcons name="close" size={20} color="#1e3a8a" />
                </TouchableOpacity>
              </View>

              {/* STEP 1: CALENDAR LAYOUT */}
              {step === 'calendar' && (
                <View>
                  {/* Legend */}
                  <View className="flex-row gap-x-4 mb-5 px-1">
                    <View className="flex-row items-center gap-x-1.5">
                      <View className="w-3 h-3 rounded-full bg-emerald-500" />
                      <Text className="text-[11px] font-bold text-blue-900/60">Available</Text>
                    </View>
                    <View className="flex-row items-center gap-x-1.5">
                      <View className="w-3 h-3 rounded-full bg-slate-200" />
                      <Text className="text-[11px] font-bold text-blue-900/60">Unavailable / Passed</Text>
                    </View>
                  </View>

                  {/* Monthly Label Header with Fast-Navigation */}
                  <View className="flex-row justify-between items-center px-2 mb-4 bg-blue-50/50 py-2.5 rounded-xl border border-blue-100/30">
                    <TouchableOpacity onPress={() => handleMonthChange('prev')} className="p-1">
                      <MaterialCommunityIcons name="chevron-left" size={24} color="#1e3a8a" />
                    </TouchableOpacity>
                    
                    {/* Fast Picker Activation Trigger */}
                    <TouchableOpacity 
                      onPress={() => setShowFastPicker(true)} 
                      className="flex-row items-center gap-x-1 px-3 py-1 bg-blue-100/50 rounded-full border border-blue-200"
                    >
                      <Text className="text-sm font-black text-blue-950">
                        {monthsList[currentMonth]} {currentYear}
                      </Text>
                      <MaterialCommunityIcons name="menu-down" size={16} color="#1e3a8a" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleMonthChange('next')} className="p-1">
                      <MaterialCommunityIcons name="chevron-right" size={24} color="#1e3a8a" />
                    </TouchableOpacity>
                  </View>

                  {/* Weekday Row Labels */}
                  <View className="flex-row mb-2">
                    {daysOfWeek.map((day, idx) => (
                      <View key={idx} className="flex-1 items-center">
                        <Text className="text-xs font-extrabold text-blue-900/40">{day}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Dates Grid */}
                  <View className="flex-row flex-wrap mb-6">
                    {currentMonthDays.map((dateObj, idx) => {
                      if (!dateObj.day) {
                        return <View key={idx} className="w-[14.28%] aspect-square" />;
                      }

                      const availableDays = selectedService.availableDays || [];
                      const isAvailableDay = availableDays.includes(dateObj.weekday);
                      const remainingSlots = getRemainingSlots(selectedService, currentYear, currentMonth, dateObj.day);
                      const dateIsPassed = isPastDate(dateObj.day);
                      const isSelectable = isAvailableDay && remainingSlots > 0 && !dateIsPassed;
                      const isCurrentlySelected = selectedDate === dateObj.day;

                      return (
                        <TouchableOpacity
                          key={idx}
                          disabled={!isSelectable}
                          onPress={() => handleSelectDate(dateObj)}
                          className="w-[14.28%] aspect-square p-1 items-center justify-center"
                        >
                          <View className={`w-10 h-10 rounded-full items-center justify-center border relative ${
                            isCurrentlySelected
                              ? 'bg-blue-900 border-blue-900'
                              : isSelectable
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-slate-50 border-slate-100'
                          }`}>
                            <Text className={`text-xs font-extrabold ${
                              isCurrentlySelected
                                ? 'text-white'
                                : isSelectable
                                  ? 'text-emerald-700'
                                  : dateIsPassed
                                    ? 'text-slate-300 line-through italic'
                                    : 'text-slate-300 line-through'
                            }`}>
                              {dateObj.day}
                            </Text>

                            {isSelectable && !isCurrentlySelected && (
                              <View className="absolute bottom-1 w-4 h-2.5 items-center justify-center bg-emerald-500 rounded-full">
                                <Text className="text-[7px] text-white font-extrabold">{remainingSlots}</Text>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    disabled={!selectedDate}
                    onPress={handleProceedToVerify}
                    className={`py-4 rounded-2xl items-center ${
                      selectedDate ? 'bg-blue-900 shadow-md' : 'bg-blue-100'
                    }`}
                  >
                    <Text className={`font-bold text-base ${selectedDate ? 'text-white' : 'text-blue-300'}`}>
                      {selectedDate 
                        ? `Continue to Reservation (${getRemainingSlots(selectedService, currentYear, currentMonth, selectedDate)} slots left)` 
                        : 'Select an Active Day'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: VERIFICATION & TIME LAYOUT */}
              {step === 'verify' && (
                <View className="pb-4">
                  {/* Selected Date Summary */}
                  <View className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl flex-row items-center mb-5">
                    <MaterialCommunityIcons name="calendar-check" size={24} color="#1e3a8a" className="mr-3" />
                    <View className="flex-1">
                      <Text className="text-xs text-blue-600/80 font-bold">Target Reservation Date</Text>
                      <Text className="text-base font-extrabold text-blue-950">
                        {monthsList[currentMonth]} {selectedDate}, {currentYear}
                      </Text>
                    </View>
                  </View>

                  {/* NEW: Dynamic Appointment Time Slot Picker */}
                  <Text className="text-sm font-bold text-blue-900/80 mb-2">
                    Select Appointment Time
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mb-5">
                    {selectedService.timeSlots?.map((time) => {
                      const isSelectedTime = selectedTime === time;
                      return (
                        <TouchableOpacity
                          key={time}
                          onPress={() => setSelectedTime(time)}
                          className={`px-3 py-2.5 rounded-xl border flex-1 min-w-[22%] items-center ${
                            isSelectedTime 
                              ? 'bg-blue-950 border-blue-950' 
                              : 'bg-blue-50/30 border-blue-100'
                          }`}
                        >
                          <Text className={`text-xs font-black ${
                            isSelectedTime ? 'text-white' : 'text-blue-950'
                          }`}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Patient ID Input */}
                  <Text className="text-sm font-bold text-blue-900/80 mb-2">
                    Enter Patient ID Number
                  </Text>
                  
                  <View className="flex-row gap-x-2 mb-2">
                    <TextInput
                      className="flex-1 bg-blue-50/40 px-4 py-3.5 rounded-xl text-blue-950 font-bold border border-blue-100 focus:border-blue-500"
                      placeholder="e.g., PT-101"
                      placeholderTextColor="#94a3b8"
                      value={patientIdInput}
                      onChangeText={setPatientIdInput}
                      autoCapitalize="characters"
                      autoCorrect={false}
                    />
                  </View>
                  
                  <Text className="text-xs text-blue-600/70 font-semibold mb-6">
                    We'll match your Patient ID number against clinic database records to lock this reservation.
                  </Text>

                  {/* Bottom Navigation */}
                  <View className="flex-row gap-x-3">
                    <TouchableOpacity
                      onPress={() => setStep('calendar')}
                      className="flex-1 py-4 border border-blue-200 rounded-2xl items-center active:bg-blue-50"
                    >
                      <Text className="text-blue-700/80 font-bold text-base">Back to Calendar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      disabled={!patientIdInput.trim() || !selectedTime}
                      onPress={handleConfirmBooking}
                      className={`flex-1 py-4 rounded-2xl items-center justify-center ${
                        (patientIdInput.trim() && selectedTime) ? 'bg-emerald-600 shadow-md' : 'bg-slate-200'
                      }`}
                    >
                      <Text className={`font-bold text-base ${
                        (patientIdInput.trim() && selectedTime) ? 'text-white' : 'text-slate-400'
                      }`}>
                        Confirm & Reserve
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

            </View>
          </View>
        </Modal>
      )}

      {/* --- FAST SELECTION DROPDOWN MODAL --- */}
      <Modal
        visible={showFastPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowFastPicker(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white rounded-3xl w-full max-h-[80%] overflow-hidden p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-blue-100">
              <Text className="text-lg font-black text-blue-950">Jump to Month</Text>
              <TouchableOpacity onPress={() => setShowFastPicker(false)} className="bg-blue-50 p-2 rounded-full">
                <MaterialCommunityIcons name="close" size={18} color="#1e3a8a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {availableYears.map((year) => (
                <View key={year} className="mb-6">
                  <Text className="text-sm font-black text-blue-500 mb-2.5 tracking-wider px-1">
                    {year}
                  </Text>
                  
                  <View className="flex-row flex-wrap gap-2">
                    {monthsList.map((monthName, idx) => {
                      const isSelectedMonth = currentMonth === idx && currentYear === year;
                      
                      // Disable past months for the current year (2026)
                      const lastDay = new Date(year, idx + 1, 0);
                      lastDay.setHours(23, 59, 59, 999);
                      const isPast = lastDay < TODAY;

                      return (
                        <TouchableOpacity
                          key={idx}
                          disabled={isPast}
                          onPress={() => handleFastSelect(idx, year)}
                          className={`w-[31%] py-3 rounded-xl items-center border ${
                            isSelectedMonth
                              ? 'bg-blue-900 border-blue-900'
                              : isPast
                                ? 'bg-slate-50 border-slate-100 opacity-40'
                                : 'bg-blue-50/50 border-blue-100'
                          }`}
                        >
                          <Text className={`text-xs font-bold ${
                            isSelectedMonth 
                              ? 'text-white' 
                              : isPast 
                                ? 'text-slate-300 line-through' 
                                : 'text-blue-900'
                          }`}>
                            {monthName.substring(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}