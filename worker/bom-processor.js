const { Redis } = require('@upstash/redis');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to process CSV data with OpenAI
async function processBomWithAI(csvData) {
  const prompt = `
You are an expert in scientific materials and laboratory supplies. Analyze the following CSV data of materials and return a structured JSON response with the following information for each material:

1. Estimated cost in USD (based on current market prices)
2. Standard units (grams, milliliters, pieces, etc.)
3. Catalog numbers from major suppliers (Thermo Fisher, Sigma-Aldrich, VWR, etc.)
4. Recommended suppliers

CSV Data:
${csvData}

Return ONLY a valid JSON array with objects containing:
- name: material name
- quantity: quantity from CSV
- unit: standardized unit
- estimatedCostUSD: estimated cost per unit
- supplier: recommended supplier
- catalog: catalog number
- totalCost: quantity * estimatedCostUSD

If you cannot determine a specific value, use null for that field.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes scientific materials and returns structured JSON data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    try {
      const parsedResult = JSON.parse(response);
      return {
        success: true,
        data: parsedResult,
        rawResponse: response
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: response
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to update job status in Supabase
async function updateJobStatus(jobId, status, result = null) {
  try {
    const updateData = { status };
    if (result) {
      updateData.result = result;
    }

    const { error } = await supabase
      .from('boms')
      .update(updateData)
      .eq('id', jobId);

    if (error) {
      console.error('Failed to update job status:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error updating job status:', error);
    return false;
  }
}

// Main worker function
async function processJob(jobData) {
  const { id: jobId, csv, email } = jobData;
  
  console.log(`Processing job ${jobId} for email: ${email}`);

  try {
    // Update status to processing
    await updateJobStatus(jobId, 'processing');

    // Process the BOM with AI
    const aiResult = await processBomWithAI(csv);

    if (aiResult.success) {
      // Update status to completed with result
      const updateSuccess = await updateJobStatus(jobId, 'completed', aiResult.data);
      
      if (updateSuccess) {
        console.log(`Job ${jobId} completed successfully`);
      } else {
        console.error(`Failed to update completion status for job ${jobId}`);
      }
    } else {
      // Update status to failed
      const updateSuccess = await updateJobStatus(jobId, 'failed', {
        error: aiResult.error,
        rawResponse: aiResult.rawResponse
      });
      
      if (updateSuccess) {
        console.log(`Job ${jobId} failed: ${aiResult.error}`);
      } else {
        console.error(`Failed to update failure status for job ${jobId}`);
      }
    }
  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);
    
    // Update status to failed
    await updateJobStatus(jobId, 'failed', {
      error: error.message
    });
  }
}

// Main worker loop
async function startWorker() {
  console.log('BOM Processor Worker started...');
  
  while (true) {
    try {
      // Pop job from queue (blocking operation)
      const jobData = await redis.brpop('bom_queue', 5);
      
      if (jobData) {
        const [queueName, jobString] = jobData;
        const jobData = JSON.parse(jobString);
        
        // Process the job
        await processJob(jobData);
      }
    } catch (error) {
      console.error('Worker loop error:', error);
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Worker shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Worker shutting down gracefully...');
  process.exit(0);
});

// Start the worker
startWorker().catch(error => {
  console.error('Worker failed to start:', error);
  process.exit(1);
}); 