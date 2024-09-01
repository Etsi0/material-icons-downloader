# Material Icons Downloader

Material Icons Downloader is a Node.js script designed to automate the download of specific Material Design icons from the [official repository](https://github.com/google/material-design-icons/). This tool is ideal for developers and designers who need to quickly access and save specific icon styles, such as rounded (materialsymbolsrounded), directly to their local projects.

## Features:

-  Automated Downloads: Fetches and saves icons in the desired style and format (for example; style: materialsymbolsrounded, format: _fill1_24px.svg) automatically.
-  Rate Limit Handling: Manages GitHub API rate limits to prevent interruptions during icon downloads.
-  Retry Mechanism: Implements retry logic to handle transient network issues, ensuring reliable downloads.
-  Flexible Configuration: Easily modify the script to fetch different icon styles or modifiers by adjusting a few parameters.

## Requirements:

Node.js 20+: This script requires Node.js v.20 or higher if you do not want to use packages like `dotenv` for environment variables.

## Obtaining a GitHub API Token:

To use this script, you'll need a GitHub API token. For detailed instructions on creating and managing your token, visit the official GitHub documentation: [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#about-personal-access-tokens).

### After generating your token, set it as an environment variable:

.env
```.env
GITHUB_TOKEN = 'your_token_here'
```

## Usage:

1.  Clone the repository.
2.  Set your GITHUB_TOKEN as described above.
3.  Run the script to download your desired icons.
    *  ```batch
        node --env-file=.env downloadMaterialDesignIcons.mjs
        ```
