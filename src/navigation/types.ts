export type HomeStackParamList = {
  HomeMain: undefined;
  Profile: undefined;
  AddPet: undefined;
  VetList: undefined;
  VetDetail: { vetId: string };
  BookAppointment: { vetId: string };
  ConfirmBooking: {
    vetId: string;
    petId: string;
    slotId: string;
    slotAt: string;
    type: 'in-person' | 'video';
    reason: string;
    amount: number;
  };
  AppointmentConfirmation: { appointmentId: string };
};

export type AppointmentsStackParamList = {
  AppointmentsMain: undefined;
  AppointmentDetail: { appointmentId: string };
  VetDetail: { vetId: string };
};

export type ConsultStackParamList = {
  ConsultMain: undefined;
  Chat: { threadId: string };
  VideoCall: { vetId: string };
};

export type WalkingStackParamList = {
  WalkingMain: undefined;
  WalkerList: undefined;
  WalkerDetail: { walkerId: string };
  BookWalk: { walkerId: string };
  ConfirmBooking: {
    walkerId: string;
    petId: string;
    slotId: string;
    slotAt: string;
    durationLabel: string;
    address: string;
    amount: number;
  };
  WalkConfirmation: { walkId: string };
  WalkDetail: { walkId: string };
};

export type LabTestsStackParamList = {
  LabTestsMain: undefined;
  LabTestDetail: { packageId: string };
  BookLabTest: { packageId: string };
  ConfirmBooking: {
    packageId: string;
    petId: string;
    slotAt: string;
    address: string;
    amount: number;
  };
  LabTestConfirmation: { bookingId: string };
};

export type RootTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Consult: undefined;
  LabTests: undefined;
  Walking: undefined;
};

export type DoctorDashboardStackParamList = {
  DashboardMain: undefined;
  Profile: undefined;
  AppointmentDetail: { appointmentId: string };
  PatientDetail: { petId: string };
};

export type DoctorAppointmentsStackParamList = {
  AppointmentsMain: undefined;
  AppointmentDetail: { appointmentId: string };
  PatientDetail: { petId: string };
};

export type DoctorPatientsStackParamList = {
  PatientsMain: undefined;
  PatientDetail: { petId: string };
};

export type DoctorMessagesStackParamList = {
  MessagesMain: undefined;
  Chat: { threadId: string };
};

export type DoctorTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Patients: undefined;
  Messages: undefined;
};

export type WalkerDashboardStackParamList = {
  DashboardMain: undefined;
  Profile: undefined;
  WalkDetail: { walkId: string };
  ClientDetail: { petId: string };
};

export type WalkerWalksStackParamList = {
  WalksMain: undefined;
  WalkDetail: { walkId: string };
  ClientDetail: { petId: string };
};

export type WalkerClientsStackParamList = {
  ClientsMain: undefined;
  ClientDetail: { petId: string };
};

export type WalkerMessagesStackParamList = {
  MessagesMain: undefined;
  Chat: { threadId: string };
};

export type WalkerTabParamList = {
  Dashboard: undefined;
  Walks: undefined;
  Clients: undefined;
  Messages: undefined;
};

// Landing/Login are the only screens rendered when there's no session.
// Once authenticated, RootNavigator swaps in MainTabNavigator /
// DoctorTabNavigator / WalkerTabNavigator directly based on profile.role —
// those aren't part of this stack, so there's nothing to navigate/reset to.
export type RootStackParamList = {
  Landing: undefined;
  Login: { mode?: 'login' | 'signup' } | undefined;
};
