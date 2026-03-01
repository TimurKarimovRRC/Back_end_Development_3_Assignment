export interface Event {
  id: string;
  name: string;
  date: string;
  capacity: number;
  registrationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  name: string;
  date: string;
  capacity: number;
}

export interface UpdateEventInput {
  name?: string;
  date?: string;
  capacity?: number;
  registrationCount?: number;
}