import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Validation schema for job ID
const jobIdSchema = z.string().uuid('Invalid job ID format');

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract job ID from URL parameters
    const { id } = req.query;

    // Validate job ID
    const validationResult = jobIdSchema.safeParse(id);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid job ID',
        details: validationResult.error.errors 
      });
    }

    const jobId = validationResult.data;

    // Fetch job status from Supabase
    const { data: bomRecord, error: dbError } = await supabase
      .from('boms')
      .select('id, email, status, result, created_at, updated_at')
      .eq('id', jobId)
      .single();

    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // Record not found
        return res.status(404).json({ error: 'Job not found' });
      }
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to fetch job status' });
    }

    // Return job status and result
    return res.status(200).json({
      success: true,
      jobId: bomRecord.id,
      email: bomRecord.email,
      status: bomRecord.status,
      result: bomRecord.result,
      createdAt: bomRecord.created_at,
      updatedAt: bomRecord.updated_at,
    });

  } catch (error) {
    console.error('Error fetching BOM job status:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 