export interface DataSet {
  [sheetName: string]: {
    header: string[];
    rows: [string, number][];
  };
}

export interface SheetData {
  header: string[];
  rows: [string, number][];
}
