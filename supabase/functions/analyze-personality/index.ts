import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { personalityAnswers } = await req.json();
    
    // TODO: Replace with actual Gemini API key
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'DUMMY_API_KEY_REPLACE_ME';
    
    console.log('Received personality answers:', personalityAnswers);
    
    const prompt = `Based on the following user preferences, provide personalized movie recommendations and insights:

User's Genre Preferences: ${Array.isArray(personalityAnswers[0]) ? personalityAnswers[0].join(', ') : personalityAnswers[0]}
User's Coping Strategy: ${personalityAnswers[1]}

Please analyze their personality and provide:
1. A brief personality profile (2-3 sentences)
2. Why these choices reflect their viewing preferences
3. Recommended movie themes that would resonate with them

Keep the response concise and engaging.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate analysis';
    
    console.log('Gemini analysis:', analysisText);

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-personality function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});