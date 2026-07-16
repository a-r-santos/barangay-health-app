import React from 'react';
import { Text, View, TouchableOpacity, StatusBar } from 'react-native';
// 1. Import the Hook to handle physical notches and home indicator bars safely
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ onNavigate }) {
  // 2. Extract dynamic edge values
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 bg-blue-50/50"
      style={{
        paddingTop: insets.top, // Dynamic spacing for notches/islands at the top
        paddingBottom: insets.bottom, // Dynamic spacing for home swipe indicator at the bottom
      }}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* 
        Container centered vertically, now safely padded away from screen edges.
        Adjusted py-8 to py-4 to keep elements comfortably vertically centered on smaller screens.
      */}
      <View className="flex-1 justify-center px-6 py-4">
        
        {/* Main Welcome Hero Card */}
        <View className="bg-white p-7 rounded-3xl shadow-md shadow-blue-100 border border-blue-100/50 w-full items-center mb-8">
          <View className="bg-blue-100/60 p-4 rounded-2xl mb-4">
            <MaterialCommunityIcons name="hospital-building" size={40} color="#1e3a8a" />
          </View>
          <Text className="text-2xl font-black text-blue-950 text-center tracking-tight">
            Barangay Health Center
          </Text>
          <Text className="text-blue-700/80 mt-2 text-center text-sm font-medium leading-relaxed px-2">
            Welcome to your digital patient gateway. Easily book consultations or check schedule statuses.
          </Text>
        </View>

        {/* Menu Title */}
        <Text className="text-xs font-bold text-blue-900/60 tracking-widest uppercase mb-3 pl-1">
          Patient Services
        </Text>

        {/* List Menu Container */}
        <View className="gap-y-4">
          
          {/* 1. Book Online Appointment */}
          <TouchableOpacity 
            className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50/50 flex-row items-center active:bg-blue-50/30"
            onPress={() => onNavigate('booking')}
          >
            <View className="bg-sky-100/70 p-3 rounded-xl mr-4">
              <MaterialCommunityIcons name="clipboard-pulse-outline" size={26} color="#0284c7" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-950 font-bold text-base">Book Online Appointment</Text>
              <Text className="text-blue-600/70 text-xs mt-0.5">Reserve a health slot online</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#0284c7" />
          </TouchableOpacity>

          {/* 2. Check My Appointment */}
          <TouchableOpacity 
            className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50/50 flex-row items-center active:bg-blue-50/30"
            onPress={() => onNavigate('lookup')}
          >
            <View className="bg-emerald-100/70 p-3 rounded-xl mr-4">
              <MaterialCommunityIcons name="card-search-outline" size={26} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-950 font-bold text-base">Check My Appointment</Text>
              <Text className="text-blue-600/70 text-xs mt-0.5">Track your clinic status with your Patient ID</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#059669" />
          </TouchableOpacity>

          {/* 3. Help Desk */}
          <TouchableOpacity 
            className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50/50 flex-row items-center active:bg-blue-50/30"
            onPress={() => onNavigate('helpdesk')}
          >
            <View className="bg-indigo-100/70 p-3 rounded-xl mr-4">
              <MaterialCommunityIcons name="calendar-clock-outline" size={26} color="#4f46e5" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-950 font-bold text-base">Help Desk & Schedule</Text>
              <Text className="text-blue-600/70 text-xs mt-0.5">View medical rotations and clinical hours</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#4f46e5" />
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}