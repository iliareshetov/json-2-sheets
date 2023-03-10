Usage:

# JSON2Sheets

"JSON2Sheets" is a TypeScript application that enables you to parse data in JSON format and seamlessly send it to the Google Sheets API.

## Usage

To use the code, follow these steps:

1. Add your Google API credentials:

Create a new project in the [Google Cloud Console](https://console.cloud.google.com/) and enable the Google Sheets API. Then, create a [Create a Google Service Account](https://robocorp.com/docs/development-guide/google-sheets/interacting-with-google-sheets) and download the credentials file. Save the credentials file to the root directory of the project as `credentials.json`.

2. Copy your spreadsheet ID:

Open the Google Sheets spreadsheet that you want to read and write data to and copy the spreadsheet ID from the URL. The spreadsheet ID is the string of letters and numbers between `/d/` and `/edit` in the URL.

3. Add your example data:

Create a new file in the root directory of the project called `example-data.json`. Add some example data in the following format:

```
{
  "Sheet1": {
    "header": ["Name", "Age", "Email"],
    "rows": [      ["John", 30, "john@example.com"],
      ["Jane", 25, "jane@example.com"],
      ["Bob", 40, "bob@example.com"]
    ]
  },
  "Sheet2": {
    "header": ["City", "Population"],
    "rows": [      ["New York", 8622698],
      ["Los Angeles", 3990456],
      ["Chicago", 2705994]
    ]
  }
}
```

4. Run the code:

```
npm install
npm start <spreadsheet-id> <example-data-file>
```

The code will read the example data from the `example-data.json` file and write it to the specified Google Sheets spreadsheet. If the sheets do not exist in the spreadsheet, they will be created automatically.

## Code Overview

The code is split into several files in the `src` directory:

- `utils.ts`: Contains utility functions for working with the Google Sheets API, such as reading credentials and creating API clients.
- `types.ts`: Defines the interfaces for the sheet data and data set objects.
- `index.ts`: The main entry point for the code, which reads the example data from a file and writes it to the Google Sheets spreadsheet.

The code uses the following Google APIs client library for JavaScript classes:

- `google.auth.GoogleAuth`: The authentication class for the Google APIs client library.
- `googleapis.sheets_v4.Sheets`: The class for working with the Google Sheets API.
