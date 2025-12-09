export interface PortSchedule {
  port: string;
  arrival: string;
  departure: string;
  status: "Completed" | "In Progress" | "Upcoming";
}

export interface TariffTable {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface CompanyTariff {
  name?: string;
  tables: TariffTable[];
}

export interface TariffPageData {
  exchangeDate: string;
  exchangeRate: number;
  allowUserHistoricalRates?: boolean;
  companies: CompanyTariff[];
  updatedAt?: string;
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface EditableTableProps {
  data: TariffTable;
  onUpdate: (updatedTable: TariffTable) => void;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
