import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Validation schema for the request body
const submitBomSchema = z.object({
  csv: z.string().min(1, 'CSV data is required'),
  email: z.string().email('Valid email is required'),
});

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validationResult = submitBomSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.errors 
      });
    }

    const { csv, email } = validationResult.data;

    // Generate unique job ID
    const jobId = uuidv4();

    // Create job payload
    const jobPayload = {
      id: jobId,
      csv,
      email,
      createdAt: new Date().toISOString(),
    };

    // Store initial record in Supabase
    const { data: bomRecord, error: dbError } = await supabase
      .from('boms')
      .insert({
        id: jobId,
        email,
        csv,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to create job record' });
    }

    // Push job to Redis queue
    const queueResult = await redis.lpush('bom_queue', JSON.stringify(jobPayload));
    
    if (queueResult === null) {
      // If queue push failed, update status to failed
      await supabase
        .from('boms')
        .update({ status: 'failed' })
        .eq('id', jobId);
      
      return res.status(500).json({ error: 'Failed to queue job' });
    }

    console.log(`Job ${jobId} queued successfully for email: ${email}`);

    // Return success response
    return res.status(200).json({
      success: true,
      jobId,
      message: 'BOM processing job submitted successfully',
      status: 'pending'
    });

  } catch (error) {
    console.error('Error submitting BOM job:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 