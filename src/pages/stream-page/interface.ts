export interface LicensePlate {
  id: string;
  plateNumber: string;
  timestamp: Date;
  vehicleType: 'Car' | 'Truck' | 'Motorcycle' | 'Bus' | 'Van';
  confidence: number;
  vehicleImage: string;
}
