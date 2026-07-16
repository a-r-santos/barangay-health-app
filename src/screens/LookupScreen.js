import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StatusBar, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MOCK_PATIENTS } from '../constants/mockPatients';

export default function LookupScreen({ onGoBack }) {
  const [searchId, setSearchId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) 
    : insets.top;

  const handleLookup = () => {
    Keyboard.dismiss();
    const cleanId = searchId.trim().toUpperCase();
    if (MOCK_PATIENTS[cleanId]) {
      setPatientData(MOCK_PATIENTS[cleanId]);
    } else {
      setPatientData(null);
    }
    setHasSearched(true);
  };

  return (
    <View 
      className="flex-1 bg-blue-50/50"
      style={{ paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header with adjusted spacing below status bar */}
      <View 
        className="bg-blue-900 pb-5 px-4 flex-row items-center shadow-md"
        style={{ paddingTop: statusBarHeight + 12 }} 
      >
        <TouchableOpacity onPress={onGoBack} className="p-1">
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center mr-7 tracking-wide">
          Appointment Status
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100/50 mb-6">
          <Text className="text-sm font-bold text-blue-900/80 mb-2">
            Enter Patient ID Number
          </Text>
          <View className="flex-row gap-x-2">
            <TextInput
              className="flex-1 bg-blue-50/40 px-4 py-3 rounded-xl text-blue-950 font-bold border border-blue-100/50 focus:border-blue-500"
              placeholder="e.g., PT-101"
              placeholderTextColor="#94a3b8"
              value={searchId}
              onChangeText={setSearchId}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity 
              className="bg-blue-900 px-5 rounded-xl justify-center items-center active:bg-blue-800"
              onPress={handleLookup}
            >
              <MaterialCommunityIcons name="magnify" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-blue-600/70 mt-2 font-medium">
            Tip: Type "PT-101" or "PT-102" to test clinical status tracking.
          </Text>
        </View>

        {hasSearched && (
          patientData ? (
            <View>
              <View className="mb-4 pl-1">
                <Text className="text-xs font-bold text-blue-900/50 tracking-widest uppercase">Patient Name</Text>
                <Text className="text-2xl font-black text-blue-950 mt-0.5">{patientData.name}</Text>
              </View>

              <Text className="text-xs font-bold text-blue-900/50 tracking-widest uppercase mb-2 pl-1">Upcoming Appointment</Text>
              <View className="bg-white p-5 rounded-3xl shadow-sm border border-blue-100/50 mb-6">
                <View className="flex-row justify-between items-start border-b border-blue-50 pb-4 mb-4">
                  <View>
                    <Text className="font-extrabold text-blue-950 text-base">{patientData.activeAppointment.service}</Text>
                    <Text className="text-blue-600 font-semibold text-xs mt-0.5">Clinical Consultation</Text>
                  </View>
                  <View className={`px-4 py-1.5 rounded-full ${
                    patientData.activeAppointment.status === "Approved" ? "bg-emerald-100/80" : "bg-amber-100/80"
                  }`}>
                    <Text className={`text-xs font-extrabold ${
                      patientData.activeAppointment.status === "Approved" ? "text-emerald-700" : "text-amber-700"
                    }`}>
                      {patientData.activeAppointment.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="calendar" size={18} color="#2563eb" className="mr-1.5" />
                    <Text className="text-blue-950 font-semibold text-sm">{patientData.activeAppointment.date}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="clock-outline" size={18} color="#2563eb" className="mr-1.5" />
                    <Text className="text-blue-950 font-semibold text-sm">{patientData.activeAppointment.time}</Text>
                  </View>
                </View>
              </View>

              <Text className="text-xs font-bold text-blue-900/50 tracking-widest uppercase mb-2 pl-1">Past Records ({patientData.history.length})</Text>
              <View className="bg-white rounded-3xl shadow-sm border border-blue-100/50 overflow-hidden mb-8">
                {patientData.history.map((record) => (
                  <View key={record.id} className="flex-row items-center p-5 border-b border-blue-50 last:border-b-0">
                    <View className="bg-blue-50 p-2.5 rounded-full mr-4">
                      <MaterialCommunityIcons name="history" size={20} color="#1e3a8a" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-blue-950 text-sm">{record.service}</Text>
                      <Text className="text-xs text-blue-600/70 font-semibold mt-0.5">Attended by {record.doctor}</Text>
                    </View>
                    <Text className="text-xs font-extrabold text-blue-900/60">{record.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="bg-red-50 p-6 rounded-3xl border border-red-100 items-center justify-center py-8">
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ef4444" className="mb-2" />
              <Text className="font-extrabold text-red-950 text-lg">No Patient Record Found</Text>
              <Text className="text-red-700 text-center text-sm mt-1.5 px-4 leading-relaxed font-semibold">
                We couldn't find any appointment data linked to ID "{searchId}". Please verify your clinical ID card.
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}