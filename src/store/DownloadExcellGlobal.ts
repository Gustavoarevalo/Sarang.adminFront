import { create } from 'zustand';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface Column {
  header: string;
  key: string;
  width?: number;
}

interface DataRow {
  [key: string]: any;
}
interface StoreState {
  loading: boolean;
  error: string | null;
  data: DataRow[];
  columns: Column[];
  filename: string;


  setData: (data: DataRow[]) => void;
  setColumns: (columns: Column[]) => void;
  setFilename: (filename: string) => void;

  downloadExcel: () => Promise<void>;
}

const useDownloadExcelStore = create<StoreState>((set, get) => ({
  loading: false,
  error: null,
  data: [],
  columns: [],
  filename: 'reporte.xlsx',

  setData: (data) => set({ data }),
  setColumns: (columns) => set({ columns }),
  setFilename: (filename) => set({ filename }),

  downloadExcel: async () => {
    try {
      set({ loading: true, error: null });

      const { data, columns, filename } = get();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');

      worksheet.columns = columns;
      data.forEach((item) => worksheet.addRow(item));

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, filename);
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDownloadExcelStore;
