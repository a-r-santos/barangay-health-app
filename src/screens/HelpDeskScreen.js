import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HelpDeskScreen({ onGoBack }) {
  const insets = useSafeAreaInsets();

  // Dynamically calculate status bar height for iOS & Android
  const statusBarHeight = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) 
    : insets.top;

  return (
    <View 
      className="flex-1 bg-blue-50/50"
      style={{ paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header with adjusted spacing below the status bar */}
      <View 
        className="bg-blue-900 pb-5 px-4 flex-row items-center shadow-md"
        style={{ paddingTop: statusBarHeight + 12 }} 
      >
        <TouchableOpacity onPress={onGoBack} className="p-1">
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center mr-7 tracking-wide">
          Help Desk
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <Text className="text-xl font-black text-blue-950">Barangay Health Center</Text>
          <Text className="text-blue-600 font-semibold mt-1 text-sm tracking-wide">Show Medical Schedule</Text>
        </View>

        {/* Schedule Cards */}
        <View className="bg-white rounded-3xl shadow-sm border border-blue-100/50 overflow-hidden mb-8">
          {/* Monday */}
          <View className="flex-row items-start p-5 border-b border-blue-50">
            <View className="bg-blue-50 p-2.5 rounded-xl mr-4 mt-0.5">
              <MaterialCommunityIcons name="stethoscope" size={22} color="#1e3a8a" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-blue-950 text-base">Monday (AM / PM)</Text>
              <Text className="text-blue-800 font-semibold text-sm mt-0.5">General Medical Consultations</Text>
              <Text className="text-blue-600/70 text-xs mt-1 leading-relaxed">All standard checkups and health programs.</Text>
              <Text className="text-blue-900 font-bold text-xs mt-2.5">Attended by: Municipal Doctor & Nurses</Text>
            </View>
          </View>

          {/* Tuesday */}
          <View className="flex-row items-start p-5 border-b border-blue-50">
            <View className="bg-pink-50 p-2.5 rounded-xl mr-4 mt-0.5">
              <MaterialCommunityIcons name="mother-heart" size={22} color="#db2777" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-blue-950 text-base">Tuesday (AM / PM)</Text>
              <Text className="text-blue-800 font-semibold text-sm mt-0.5">Prenatal & Maternal Clinic</Text>
              <Text className="text-blue-600/70 text-xs mt-1 leading-relaxed">Prenatal consultations, vitamins distribution, and teen pregnancy checkups.</Text>
              <Text className="text-blue-900 font-bold text-xs mt-2.5">Attended by: Barangay Midwife</Text>
            </View>
          </View>

          {/* Wednesday */}
          <View className="flex-row items-start p-5 border-b border-blue-50">
            <View className="bg-sky-50 p-2.5 rounded-xl mr-4 mt-0.5">
              <MaterialCommunityIcons name="baby-face-outline" size={22} color="#0284c7" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-blue-950 text-base">Wednesday (AM Only)</Text>
              <Text className="text-blue-800 font-semibold text-sm mt-0.5">Child Care & Immunization</Text>
              <Text className="text-blue-600/70 text-xs mt-1 leading-relaxed">Infant immunizations, baby weighing, and nutritional health checks.</Text>
              <Text className="text-blue-900 font-bold text-xs mt-2.5">Attended by: Barangay Health Workers (BHW)</Text>
            </View>
          </View>

          {/* Thursday */}
          <View className="flex-row items-start p-5 border-b border-blue-50">
            <View className="bg-emerald-50 p-2.5 rounded-xl mr-4 mt-0.5">
              <MaterialCommunityIcons name="clipboard-text-play-outline" size={22} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-blue-950 text-base">Thursday (AM / PM)</Text>
              <Text className="text-blue-800 font-semibold text-sm mt-0.5">Maternal & Lab Works</Text>
              <Text className="text-blue-600/70 text-xs mt-1 leading-relaxed">General consults, prenatal checks, and basic laboratory services.</Text>
              <Text className="text-blue-900 font-bold text-xs mt-2.5">Attended by: Midwife & Lab Tech</Text>
            </View>
          </View>

          {/* Friday */}
          <View className="flex-row items-start p-5">
            <View className="bg-indigo-50 p-2.5 rounded-xl mr-4 mt-0.5">
              <MaterialCommunityIcons name="heart-pulse" size={22} color="#4f46e5" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-blue-950 text-base">Friday (AM Only)</Text>
              <Text className="text-blue-800 font-semibold text-sm mt-0.5">NCD Care & Senior Wellness</Text>
              <Text className="text-blue-600/70 text-xs mt-1 leading-relaxed">Non-Communicable Diseases clinic (Hypertension/Diabetes monitoring).</Text>
              <Text className="text-blue-900 font-bold text-xs mt-2.5">Attended by: Nurse Coordinator</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}