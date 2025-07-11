import { vehicleTypes } from "./constants.js";

const plateChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateRandomPlate = () => {
  const formats = ['XXX-0000', 'XX-000-XX', '0000-XXX', 'XXX0000'];
  const format = formats[Math.floor(Math.random() * formats.length)];
  
  return format.replace(/[X]/g, () => plateChars[Math.floor(Math.random() * 26)])
              .replace(/[0]/g, () => Math.floor(Math.random() * 10).toString());
};

export const generateMockData = () => ({
  id: Math.random().toString(36).substr(2, 9),
  plateNumber: generateRandomPlate(),
  timestamp: new Date(),
  vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
  confidence: Math.floor(Math.random() * 30) + 70,
  vehicleImage: `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 1}/150/100`
});
