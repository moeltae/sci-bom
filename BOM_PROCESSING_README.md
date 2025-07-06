# BOM Processing Feature

This feature adds AI-powered Bill of Materials (BOM) processing to the Sci-BoM application. When users upload a CSV file, the system processes it through a Redis queue and uses OpenAI's GPT-4 to provide structured cost analysis, supplier information, and catalog numbers.

## Architecture Overview

```
Frontend (React) → API Routes (Vercel) → Redis Queue (Upstash) → Worker (Render/Fly.io) → OpenAI → Supabase
```

## Components

### 1. Frontend (`src/components/bom/BomUploader.tsx`)
- Enhanced upload component with real-time status updates
- Polling mechanism to check job status
- Display of AI-processed results
- Progress indicators and error handling

### 2. API Routes (`api/`)
- `/api/submit` - Submits BOM jobs to Redis queue
- `/api/bom/[id]` - Checks job status and retrieves results

### 3. Worker (`worker/`)
- Node.js worker that processes jobs from Redis queue
- Uses OpenAI GPT-4o for material analysis
- Updates job status in Supabase database

### 4. Database Schema (`prisma/schema.prisma`)
- New `Bom` model to store job status and results
- Relationship with existing `User` model

## Setup Instructions

### 1. Environment Variables

Add these environment variables to your Vercel project:

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 2. Database Migration

Run the Prisma migration to add the new BOM table:

```bash
npx prisma migrate dev --name add-bom-table
```

### 3. Deploy Worker

Follow the instructions in `worker/README.md` to deploy the worker to Render, Fly.io, or Railway.

### 4. Deploy Frontend

Deploy to Vercel with the new API routes:

```bash
vercel --prod
```

## Usage Flow

1. **Upload CSV**: User uploads a CSV file with materials
2. **Submit Job**: Frontend calls `/api/submit` with CSV data and user email
3. **Queue Job**: API creates a job record in Supabase and pushes to Redis queue
4. **Process Job**: Worker picks up job from queue and processes with OpenAI
5. **Update Status**: Worker updates job status in Supabase
6. **Poll Status**: Frontend polls `/api/bom/[id]` for status updates
7. **Display Results**: When complete, frontend displays AI-processed results
8. **Save Experiment**: User can save the processed results as an experiment

## API Endpoints

### POST `/api/submit`
Submits a BOM job for processing.

**Request Body:**
```json
{
  "csv": "Material Name,Quantity,Unit...",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "uuid-string",
  "message": "BOM processing job submitted successfully",
  "status": "pending"
}
```

### GET `/api/bom/[id]`
Checks the status of a BOM job.

**Response:**
```json
{
  "success": true,
  "jobId": "uuid-string",
  "email": "user@example.com",
  "status": "completed",
  "result": [
    {
      "name": "Sodium Chloride",
      "quantity": 100,
      "unit": "grams",
      "estimatedCostUSD": 0.50,
      "supplier": "Thermo Fisher",
      "catalog": "7647-14-5",
      "totalCost": 50.00
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

## Job Statuses

- `pending` - Job is queued, waiting to be processed
- `processing` - Job is currently being processed by AI
- `completed` - Job completed successfully with results
- `failed` - Job failed with error details

## Error Handling

The system includes comprehensive error handling:

- **Input Validation**: Zod schemas validate all inputs
- **Queue Failures**: Failed queue operations update job status
- **AI Failures**: OpenAI errors are captured and stored
- **Network Issues**: Retry logic for transient failures
- **User Feedback**: Toast notifications for all states

## Testing

### Sample Data
Use `sample-bom.csv` to test the feature with realistic scientific materials.

### Local Testing
1. Start the worker locally: `cd worker && npm start`
2. Set up local environment variables
3. Test with the sample CSV file

## Monitoring

### Worker Logs
Monitor worker logs for processing status:
```bash
# Render
render logs --service bom-processor-worker

# Fly.io
fly logs

# Railway
railway logs
```

### Database Monitoring
Check the `boms` table in Supabase for job status and results.

### Redis Monitoring
Monitor the `bom_queue` length in Upstash Redis dashboard.

## Scaling Considerations

- **Multiple Workers**: Deploy multiple worker instances for high volume
- **Queue Management**: Monitor queue length and adjust worker count
- **Rate Limiting**: Implement OpenAI API rate limiting
- **Caching**: Consider caching common material analyses
- **Database Indexing**: Add indexes on frequently queried fields

## Security

- **Input Sanitization**: All CSV data is validated and sanitized
- **API Key Protection**: OpenAI API key is stored securely
- **User Isolation**: Jobs are associated with user emails
- **Error Disclosure**: Limited error details are exposed to users

## Cost Optimization

- **OpenAI Usage**: Monitor API usage and costs
- **Worker Scaling**: Scale workers based on queue length
- **Caching**: Cache common material analyses to reduce API calls
- **Batch Processing**: Consider batching similar materials

## Troubleshooting

### Common Issues

1. **Worker Not Processing Jobs**
   - Check Redis connection
   - Verify environment variables
   - Check worker logs

2. **Jobs Stuck in Pending**
   - Verify worker is running
   - Check Redis queue status
   - Review worker error logs

3. **AI Processing Failures**
   - Check OpenAI API key
   - Verify API rate limits
   - Review CSV format

4. **Frontend Polling Issues**
   - Check API route configuration
   - Verify CORS settings
   - Review network connectivity

### Debug Commands

```bash
# Check Redis queue length
redis-cli -u $UPSTASH_REDIS_REST_URL LLEN bom_queue

# Check recent jobs in database
psql $DATABASE_URL -c "SELECT * FROM boms ORDER BY created_at DESC LIMIT 10;"

# Test OpenAI API
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

## Future Enhancements

- **Material Database**: Build a database of common materials and costs
- **Supplier Integration**: Direct integration with supplier APIs
- **Batch Processing**: Process multiple BOMs simultaneously
- **Cost History**: Track cost changes over time
- **Alternative Suppliers**: Suggest multiple supplier options
- **Export Formats**: Support for additional export formats 