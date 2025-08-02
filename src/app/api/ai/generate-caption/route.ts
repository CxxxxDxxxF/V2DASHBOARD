import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Only create OpenAI client if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const { prompt, platforms } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // If OpenAI is not configured, use fallback
    if (!openai) {
      const enhancedCaption = `${prompt}\n\n#RutgersGolf #GolfLife #NewJerseyGolf`
      return NextResponse.json({
        caption: enhancedCaption,
        platforms,
        originalPrompt: prompt,
        note: 'AI service not configured, using fallback enhancement'
      })
    }

    // Create platform-specific prompts
    const platformPrompts = {
      facebook: 'Optimize for Facebook engagement with a friendly, community-focused tone',
      instagram: 'Create an Instagram caption with relevant hashtags and visual appeal',
      twitter: 'Write a concise Twitter post within character limits',
      tiktok: 'Create a TikTok caption that encourages engagement and uses trending language'
    }

    const platformInstructions = platforms
      .map((platform: string) => platformPrompts[platform as keyof typeof platformPrompts])
      .join('. ')

    const systemPrompt = `You are a social media expert for Rutgers Golf Course. Create engaging, professional captions that:
- Highlight the golf course experience
- Use appropriate tone for each platform
- Include relevant hashtags when appropriate
- Encourage engagement
- Stay within platform character limits
- Be authentic and genuine

Platform-specific requirements: ${platformInstructions}

The user's initial idea: ${prompt}

Generate a compelling caption that builds upon this idea.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create a social media caption based on: "${prompt}"`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const generatedCaption = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      caption: generatedCaption,
      platforms,
      originalPrompt: prompt
    })

  } catch (error) {
    console.error('AI caption generation error:', error)
    
    // Fallback to a simple enhancement if AI fails
    const { prompt } = await request.json()
    const enhancedCaption = `${prompt}\n\n#RutgersGolf #GolfLife #NewJerseyGolf`
    
    return NextResponse.json({
      caption: enhancedCaption,
      error: 'AI service unavailable, using fallback enhancement'
    })
  }
} 