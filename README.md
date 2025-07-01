# Sci-Bom

## What is Bun?

Bun is a fast all-in-one JavaScript runtime and toolkit. It's designed to be a drop-in replacement for Node.js and npm, offering:

## Prerequisites

Before running this project, you need to install Bun:

### macOS and Linux

```sh
curl -fsSL https://bun.sh/install | bash
```

### Windows

```sh
# Using PowerShell
irm bun.sh/install.ps1 | iex

# Or using WSL (Windows Subsystem for Linux)
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal and verify Bun is installed:

```sh
bun --version
```

## Running the app locally:

```sh
# Install dependencies
bun i

# Run the web app
bun run dev
```

## Experiment Creation & UI Mocks

This project includes both real experiment creation functionality and enhanced UI mocks for demonstration:

### Features Demonstrated

1. **Experiment Creation Flow** (`/demo` → "Experiment Creation Flow")
   - **Matches real interface** - identical to the working BomUploader component
   - CSV upload and processing simulation
   - **Immediate experiment creation** - no waiting for AI analysis
   - Background AI analysis simulation
   - Material preview table with estimated costs

2. **Enhanced Status Display** (`/demo` → "Experiment List")
   - Visual status badges with animated icons
   - Color-coded status indicators (completed, analyzing, failed, submitted)
   - **Prominent indicators for analyzing experiments**
   - Background processing status messages
   - Cost and material summaries
   - Quick action buttons for detailed views

3. **Detailed Experiment View** (`/demo` → "Detailed Experiment View")
   - Tabbed interface for organized information display
   - Material pricing comparisons with Thermo Fisher data
   - Cost analysis and trend visualization
   - Export and sharing options

### Real Experiment Creation

The main app uses the `BomUploader` component which has full backend integration:
- **Dashboard**: Click "New Experiment" to create real experiments
- **Backend Integration**: Calls Supabase functions to save experiments
- **CSV Processing**: Real CSV parsing and validation
- **Database Storage**: Experiments are saved to the database

### UI Demo

For enhanced UI demonstrations:
1. Start the development server: `bun run dev`
2. Navigate to `http://localhost:8080/demo`
3. Or click "View UI Demo" on the login page
4. Experience the enhanced UI mock that matches the real interface

### Mock Data

The demo uses realistic mock data including:
- Sample experiments with different statuses
- Thermo Fisher catalog numbers and pricing
- Material cost comparisons
- Progress simulation for AI analysis

### Status Types

- **Submitted**: Initial state after CSV upload
- **Analyzing**: AI is processing and finding Thermo Fisher pricing
- **Completed**: Analysis finished with pricing data
- **Failed**: Analysis encountered an error
