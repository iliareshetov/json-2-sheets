import { sheets_v4, Auth } from "googleapis";
import {
  processArgs,
  readCredentialsFile,
  createAuth,
  createSheetsClient,
  readExampleDataFile,
  checkSheetExists,
  appendDataToSheet,
  createSheetAndAddData,
} from "./utils";
import { SheetData, DataSet } from "./types";

export default async function main() {
  const args: string[] = process.argv.slice(2);
  const [SPREADSHEET_ID, EXAMPLE_DATA_FILE] = processArgs(args);

  console.log(
    `INFO: SPREADSHEET_ID: ${SPREADSHEET_ID}, EXAMPLE_DATA_FILE: ${EXAMPLE_DATA_FILE} `
  );

  const credentials: Auth.CredentialBody =
    readCredentialsFile("credentials.json");

  const auth: Auth.GoogleAuth = await createAuth(credentials);

  const sheets: sheets_v4.Sheets = createSheetsClient(auth);

  const exampleData: DataSet = readExampleDataFile(EXAMPLE_DATA_FILE);

  for (const sheetName in exampleData) {
    const sheetData: SheetData = exampleData[sheetName];
    const range: string = `${sheetName}!A:A`;
    let sheetExists: boolean = false;

    sheetExists = await checkSheetExists(sheets, SPREADSHEET_ID, range);
    console.log(`INFO: Checking Range ${range}, exists: ${sheetExists}`);

    if (sheetExists) {
      await appendDataToSheet(sheets, sheetName, sheetData, SPREADSHEET_ID);
    } else {
      await createSheetAndAddData(sheets, sheetName, sheetData, SPREADSHEET_ID);
    }

    console.log(`INFO: Data sent to ${sheetName} sheet in Google Sheets:`);
    console.log(sheetData);
  }
}
