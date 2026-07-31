export type HomeStackParamList = {
  HomeMain: undefined;
  Profile: undefined;
  VetList: { specialty?: string } | undefined;
  VetDetail: { vetId: string };
  BookAppointment: { vetId: string };
  Payment: {
    vetId: string;
    petId: string;
    date: string;
    time: string;
    type: 'in-person' | 'video';
    reason: string;
    amount: number;
  };
  AppointmentConfirmation: {
    vetId: string;
    petId: string;
    date: string;
    time: string;
    type: 'in-person' | 'video';
    reason: string;
  };
};

export type AppointmentsStackParamList = {
  AppointmentsMain: undefined;
  AppointmentDetail: { appointmentId: string };
  VetDetail: { vetId: string };
};

export type ConsultStackParamList = {
  ConsultMain: undefined;
  Payment: { vetId: string; mode: 'chat' | 'video'; amount: number };
  Chat: { vetId: string };
  VideoCall: { vetId: string };
};

export type ShopStackParamList = {
  ShopMain: undefined;
};

export type WalkingStackParamList = {
  WalkingMain: undefined;
};

export type LabTestsStackParamList = {
  LabTestsMain: undefined;
  LabTestDetail: { packageId: string };
  BookLabTest: { packageId: string };
  Payment: {
    packageId: string;
    petId: string;
    date: string;
    time: string;
    address: string;
    amount: number;
  };
  LabTestConfirmation: {
    packageId: string;
    petId: string;
    date: string;
    time: string;
    address: string;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Consult: undefined;
  LabTests: undefined;
  Shop: undefined;
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

export type RootStackParamList = {
  Landing: undefined;
  Login: { mode?: 'login' | 'signup' } | undefined;
  MainTabs: undefined;
  DoctorTabs: undefined;
};
