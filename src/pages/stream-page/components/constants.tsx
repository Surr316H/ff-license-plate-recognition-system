import { UserRole } from "../../../store/constants";

export const tableAccessColumns = [
  { 
    key: 'plateNumber',
    label: 'Plate Number',
    renderCell: (value: string) => (
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {value}
        </div>
      </td>
    ),
    accessLevel: [UserRole.ADMIN]
  }, 
  { 
    key: 'timestamp',
    label: 'Timestamp',
    renderCell: (value: Date) => (
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {value.toLocaleString()}
        </div>
      </td>
    ),
    accessLevel: [UserRole.ADMIN]
  },
  { 
    key: 'vehicleType',
    label: 'Vehicle Type',
    renderCell: (value: string) => (
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Car' ? 'bg-blue-100 text-blue-800' :
          value === 'Truck' ? 'bg-green-100 text-green-800' :
          value === 'Motorcycle' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Bus' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      </td>
    ),
    accessLevel: [UserRole.OPERATOR, UserRole.ADMIN]
  },
  { 
    key: 'confidence',
    label: 'Confidence',
    renderCell: (value: number) => (
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm text-gray-900">{value}%</div>
          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                value >= 90 ? 'bg-green-600' :
                value >= 80 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
    </td>
    ),
    accessLevel: [UserRole.OPERATOR, UserRole.ADMIN]
  },
  { 
    key: 'vehicleImage',
    label: 'Vehicle Image',
    renderCell: (value: string) => (
      <td className="px-4 py-4 whitespace-nowrap">
        <img
          src={value}
          alt="Vehicle"
          className="w-12 h-8 object-cover rounded shadow-sm"
        />
      </td>
    ),
    accessLevel: [UserRole.OPERATOR, UserRole.ADMIN]
  },
]
