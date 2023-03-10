import * as fs from "fs";
import { SheetData, DataSet } from "./types";
import {
  google, // The top level object used to access services
  Auth, // Namespace for auth related types
  Common, // General types used throughout the library
  sheets_v4,
} from "googleapis";

export function processArgs(args: string[]): [string, string] {
  if (args.length < 2) {
    console.error(
      "Usage: ts-node main.ts <spreadsheet-id> <example-data-file>"
    );
    process.exit(1);
  }
  return [args[0], args[1]];
}

export function readCredentialsFile(
  credentialsFile: string
): Auth.CredentialBody {
  const contents = fs.readFileSync(credentialsFile).toString();
  return JSON.parse(contents);
}

export async function createAuth(
  credentials: Auth.CredentialBody
): Promise<Auth.GoogleAuth> {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
}

export function createSheetsClient(auth: any): sheets_v4.Sheets {
  return google.sheets({ version: "v4", auth });
}

export function readExampleDataFile(exampleDataFile: string): DataSet {
  const contents = fs.readFileSync(exampleDataFile).toString();
  return JSON.parse(contents);
}

export async function checkSheetExists(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  range: string
): Promise<boolean> {
  try {
    await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return true;
  } catch (err: any) {
    if (
      err instanceof Common.GaxiosError &&
      err.message.includes("Unable to parse range")
    ) {
      return false;
    }

    if (err instanceof Error) {
      console.error(err);
    }

    throw err;
  }
}

export async function appendDataToSheet(
  sheets: sheets_v4.Sheets,
  sheetName: string,
  sheetData: SheetData,
  spreadsheetId: string
): Promise<void> {
  const numRows: number = await getNumRowsInSheet(
    sheets,
    sheetName,
    spreadsheetId
  );
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A${numRows + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      majorDimension: "ROWS",
      values: sheetData.rows,
    },
  });
}

export async function getNumRowsInSheet(
  sheets: sheets_v4.Sheets,
  sheetName: string,
  spreadsheetId: string
): Promise<number> {
  const response: sheets_v4.Schema$ValueRange = (
    await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A:A`,
    })
  ).data;

  const numRows: number = response?.values?.length || 0;
  return numRows;
}

export async function createSheetAndAddData(
  sheets: sheets_v4.Sheets,
  sheetName: string,
  sheetData: SheetData,
  spreadsheetId: string
): Promise<void> {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        },
      ],
    },
  });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      data: [
        {
          range: `${sheetName}!A1`,
          majorDimension: "ROWS",
          values: [sheetData.header, ...sheetData.rows],
        },
      ],
      valueInputOption: "USER_ENTERED",
    },
  });
}
