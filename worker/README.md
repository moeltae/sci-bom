# BOM Processor Worker

This is a Node.js worker that processes Bill of Materials (BOM) jobs from a Redis queue using OpenAI's GPT-4 to analyze scientific materials and provide cost estimates, supplier information, and catalog numbers.

## Features

- Processes BOM jobs from Upstash Redis queue
- Uses OpenAI GPT-4o to analyze scientific materials
- Updates job status in Supabase database
- Provides structured JSON responses with cost estimates and supplier information
- Handles errors gracefully with proper logging

## Prerequisites

- Node.js 18 or higher
- Upstash Redis instance
- Supabase project
- OpenAI API key

## Environment Variables

Copy `env.example` to `.env` and fill in your configuration:

```bash
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Logging level
LOG_LEVEL=info
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the worker:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Deployment

### Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - **Build Command**: `cd worker && npm install`
   - **Start Command**: `cd worker && npm start`
   - **Environment**: Node
   - **Region**: Choose closest to your users

4. Add environment variables in Render dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`

### Fly.io

1. Install Fly CLI and authenticate
2. Create a new app:
```bash
fly apps create bom-processor-worker
```

3. Deploy:
```bash
cd worker
fly deploy
```

4. Set secrets:
```bash
fly secrets set UPSTASH_REDIS_REST_URL=your_redis_url
fly secrets set UPSTASH_REDIS_REST_TOKEN=your_redis_token
fly secrets set VITE_SUPABASE_URL=your_supabase_url
fly secrets set VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
fly secrets set OPENAI_API_KEY=your_openai_api_key
```

### Railway

1. Connect your GitHub repository to Railway
2. Set the root directory to `worker`
3. Add environment variables in Railway dashboard
4. Deploy automatically

## How It Works

1. **Job Queue**: The worker continuously polls the `bom_queue` in Redis for new jobs
2. **Job Processing**: When a job is received, it updates the status to "processing"
3. **AI Analysis**: The CSV data is sent to OpenAI GPT-4o for analysis
4. **Result Storage**: The structured result is stored in Supabase with status "completed"
5. **Error Handling**: If processing fails, the status is updated to "failed" with error details

## Job Format

Jobs in the Redis queue should have the following structure:

```json
{
  "id": "uuid-string",
  "csv": "raw-csv-data",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Response Format

The AI analysis returns a structured JSON array:

```json
[
  {
    "name": "Material Name",
    "quantity": 10,
    "unit": "grams",
    "estimatedCostUSD": 25.50,
    "supplier": "Thermo Fisher",
    "catalog": "A12345",
    "totalCost": 255.00
  }
]
```

## Monitoring

The worker logs all activities to stdout/stderr. For production deployments, consider:

- Setting up log aggregation (e.g., with Logtail, Papertrail)
- Adding health check endpoints
- Implementing metrics collection
- Setting up alerts for failed jobs

## Scaling

For high-volume processing:

1. Deploy multiple worker instances
2. Use Redis Cluster for better performance
3. Implement job prioritization
4. Add rate limiting for OpenAI API calls

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**: Check your Upstash Redis credentials
2. **OpenAI API Errors**: Verify your API key and check rate limits
3. **Supabase Connection Issues**: Ensure your Supabase credentials are correct
4. **Memory Issues**: Monitor memory usage and consider increasing container limits

### Logs

Check the worker logs for detailed error information:

```bash
# Render
render logs --service bom-processor-worker

# Fly.io
fly logs

# Railway
railway logs
``` 