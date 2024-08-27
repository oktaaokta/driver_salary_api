# Driver Salary 

## Description

This is an API to get driver's salary based on the csv available.

## Prerequisites

Before you start, make sure you have the following installed:

1. **Docker**: Ensure Docker is installed on your local machine. You can download and install Docker from the [official Docker website](https://www.docker.com/get-started).

2. **Make**: Ensure `make` is installed. It is commonly available on Unix-based systems (Linux, macOS). For Windows, you might need to install it via a package manager like [Chocolatey](https://chocolatey.org/) or [WSL](https://docs.microsoft.com/en-us/windows/wsl/install).

## Setup Instructions

Follow these steps to set up and run the project:

1. **Start Docker Services**

   If you have `make` installed, run:

   ```
   make docker-postgres-up
   ```

   If make is not available, use the following Docker command to start the PostgreSQL service manually, run:
   ```
   docker-compose -f docker-compose.yaml -p seryu up --build postgres -d
   ```
   
   After that, run the migration.sql available in the /.dev directory, and import the datas available.

2. **Install Project Dependencies**

    Navigate to the project directory and install the required Node.js dependencies:
    ```
    npm install
    ```

3. **Run The Project**

    Start the project by running:
    ```
    npm start
    ```

