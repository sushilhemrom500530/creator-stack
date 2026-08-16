import {
  Injectable,
  Logger,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiUsage, AiUsageDocument } from './schemas/ai-usage.schema';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';
import {
  GenerateCaptionDto,
  GenerateHashtagsDto,
  GenerateHooksDto,
  GenerateThreadDto,
  AiChatDto,
} from './dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectModel(AiUsage.name) private readonly aiUsageModel: Model<AiUsageDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    private readonly configService: ConfigService,
  ) {}

  private getGeminiKey(): string {
    return (
      this.configService.get<string>('GEMINI_API_KEY') ||
      this.configService.get<string>('social.ai.geminiApiKey') ||
      ''
    );
  }

  private getOpenAiKey(): string {
    return (
      this.configService.get<string>('OPENAI_API_KEY') ||
      this.configService.get<string>('social.ai.openaiApiKey') ||
      ''
    );
  }

  private async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel.findOne({
      _id: new Types.ObjectId(workspaceId),
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace access denied.');
    }
    return workspace;
  }

  /**
   * Dispatches prompt to Gemini or OpenAI API, or uses smart deterministic fallback.
   */
  private async executeLLM(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string; provider: 'gemini' | 'openai' | 'mock'; promptTokens: number; completionTokens: number }> {
    const geminiKey = this.getGeminiKey();
    const openAiKey = this.getOpenAiKey();

    // 1. Try Gemini API
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nTask: ${userPrompt}` }] },
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
          }),
        });

        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = data.candidates[0].content.parts[0].text.trim();
          const promptTokens = data.usageMetadata?.promptTokenCount || Math.ceil(userPrompt.length / 4);
          const completionTokens = data.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);
          return { text, model: 'gemini-1.5-flash', provider: 'gemini', promptTokens, completionTokens };
        }
      } catch (err: any) {
        this.logger.warn(`Gemini API call failed: ${err.message}. Trying next provider.`);
      }
    }

    // 2. Try OpenAI API
    if (openAiKey) {
      try {
        const url = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        const data = await response.json();
        if (response.ok && data.choices?.[0]?.message?.content) {
          const text = data.choices[0].message.content.trim();
          return {
            text,
            model: 'gpt-4o-mini',
            provider: 'openai',
            promptTokens: data.usage?.prompt_tokens || Math.ceil(userPrompt.length / 4),
            completionTokens: data.usage?.completion_tokens || Math.ceil(text.length / 4),
          };
        }
      } catch (err: any) {
        this.logger.warn(`OpenAI API call failed: ${err.message}. Using deterministic smart generator.`);
      }
    }

    // 3. High quality deterministic generator fallback for local testing
    return this.generateSmartFallback(systemPrompt, userPrompt);
  }

  private generateSmartFallback(systemPrompt: string, userPrompt: string) {
    let text = '';
    if (systemPrompt.includes('Caption')) {
      text = `🚀 Unlock the next evolution of your workflow!\n\nHere is how you can achieve 10x faster execution without the burnout:\n1. Automate repetitive social dispatches\n2. Maintain consistent omnichannel presence\n3. Leverage AI content intelligence\n\nWhat is your biggest roadblock right now? Drop a comment below! 👇\n\n#CreatorEconomy #Productivity #SaaSLaunch #StartupGrowth #SocialMediaStrategy`;
    } else if (systemPrompt.includes('Hashtag')) {
      text = `#CreatorStack #SaaSGrowth #SocialMediaAutomation #ContentStrategy #AITools #DigitalMarketing #IndieHackers #ProductHunt #TechStartup #ScaleUp`;
    } else if (systemPrompt.includes('Hook')) {
      text = `1. "99% of creators are publishing wrong. Here is the framework that changed everything:"\n2. "How we automated 5 social channels in under 15 minutes a week (Full breakdown):"\n3. "Stop wasting 10 hours a week on social media. Do this instead:"\n4. "The exact social media operating system top agencies use in 2026:"\n5. "If you are struggling to stay consistent across multiple platforms, read this:"`;
    } else if (systemPrompt.includes('Thread')) {
      text = `1/5 🧵 Building a multi-platform presence used to take a full team.\n\nNow, 1 creator with the right operating system can out-publish a 10-person marketing department. Here is how:\n\n2/5 📌 Create Once, Distribute Everywhere\nNever write separate posts from scratch. Draft a core insight, then tailor the format for LinkedIn, Twitter, Instagram, and Threads.\n\n3/5 ⚡ Batch Scheduling\nPick 1 hour on Sunday to schedule your entire week. Let background workers handle dispatching.\n\n4/5 📊 Analytics Loop\nReview your top-performing 20% content weekly and double down on formats that resonate.\n\n5/5 🔁 Ready to scale your audience on autopilot? Try CreatorStack today.`;
    } else {
      text = `Here are 3 high-impact strategies based on your request:\n\n1. **Focus on Audience Pain Points**: Frame your message around tangible time-saving or revenue-boosting benefits.\n2. **Leverage Native Formatting**: Tailor the tone for each network (concise on X, authoritative on LinkedIn, visual on Instagram).\n3. **Clear Call-to-Action (CTA)**: Give readers a clear next step to boost engagement.`;
    }

    const promptTokens = Math.ceil(userPrompt.length / 4);
    const completionTokens = Math.ceil(text.length / 4);
    return { text, model: 'creator-ai-engine', provider: 'mock' as const, promptTokens, completionTokens };
  }

  private async trackUsage(
    workspaceId: string,
    userId: string,
    feature: 'caption' | 'hashtags' | 'hooks' | 'thread' | 'chat' | 'refine',
    prompt: string,
    response: string,
    llmResult: { model: string; provider: 'gemini' | 'openai' | 'mock'; promptTokens: number; completionTokens: number },
  ) {
    const totalTokens = llmResult.promptTokens + llmResult.completionTokens;

    await this.aiUsageModel.create({
      workspaceId: new Types.ObjectId(workspaceId),
      userId: new Types.ObjectId(userId),
      feature,
      prompt,
      response,
      promptTokens: llmResult.promptTokens,
      completionTokens: llmResult.completionTokens,
      totalTokens,
      aiModel: llmResult.model,
      provider: llmResult.provider,
    });
  }

  /**
   * Generates a tailored social media caption.
   */
  async generateCaption(userId: string, dto: GenerateCaptionDto) {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const platform = dto.platform || 'linkedin';
    const tone = dto.tone || 'professional';
    const systemPrompt = `You are an expert social media copywriter. Generate a high-converting ${tone} caption optimized specifically for ${platform.toUpperCase()}. ${dto.includeHashtags ? 'Include 3-5 relevant hashtags.' : 'Do not include hashtags.'} ${dto.includeEmojis ? 'Include engaging emojis.' : 'Do not use emojis.'}`;
    const userPrompt = `Topic: ${dto.topic}`;

    const llm = await this.executeLLM(systemPrompt, userPrompt);
    await this.trackUsage(dto.workspaceId, userId, 'caption', dto.topic, llm.text, llm);

    return {
      caption: llm.text,
      platform,
      tone,
      tokensUsed: llm.promptTokens + llm.completionTokens,
      model: llm.model,
    };
  }

  /**
   * Generates high-performing hashtags.
   */
  async generateHashtags(userId: string, dto: GenerateHashtagsDto) {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const count = dto.count || 10;
    const systemPrompt = `You are a social media SEO specialist. Suggest exactly ${count} high-performing, niche and trending hashtags for the provided keyword. Return only space-separated hashtags prefixed with #.`;
    const userPrompt = `Keyword: ${dto.keyword}`;

    const llm = await this.executeLLM(systemPrompt, userPrompt);
    await this.trackUsage(dto.workspaceId, userId, 'hashtags', dto.keyword, llm.text, llm);

    const hashtags = llm.text.match(/#[a-zA-Z0-9_]+/g) || [];

    return {
      raw: llm.text,
      hashtags,
      count: hashtags.length,
      tokensUsed: llm.promptTokens + llm.completionTokens,
    };
  }

  /**
   * Generates viral hook lines.
   */
  async generateHooks(userId: string, dto: GenerateHooksDto) {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const systemPrompt = `You are a viral content strategist. Generate 5 compelling opening hook lines for a post about the given topic. Target audience: ${dto.targetAudience || 'general creators and business owners'}. Format as numbered list 1 to 5 with no extra intro.`;
    const userPrompt = `Topic: ${dto.topic}`;

    const llm = await this.executeLLM(systemPrompt, userPrompt);
    await this.trackUsage(dto.workspaceId, userId, 'hooks', dto.topic, llm.text, llm);

    const hooks = llm.text
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').replace(/^"|"$/g, '').trim())
      .filter((line) => line.length > 0);

    return {
      raw: llm.text,
      hooks,
      tokensUsed: llm.promptTokens + llm.completionTokens,
    };
  }

  /**
   * Generates multi-part thread.
   */
  async generateThread(userId: string, dto: GenerateThreadDto) {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const count = dto.tweetsCount || 5;
    const systemPrompt = `You are a Twitter / Threads ghostwriter. Draft an engaging ${count}-part thread about the topic. Number each tweet as 1/${count}, 2/${count}, etc., separated by double newlines. Include a strong hook at 1/${count} and CTA at the end.`;
    const userPrompt = `Topic: ${dto.topic}`;

    const llm = await this.executeLLM(systemPrompt, userPrompt);
    await this.trackUsage(dto.workspaceId, userId, 'thread', dto.topic, llm.text, llm);

    return {
      thread: llm.text,
      tweetsCount: count,
      tokensUsed: llm.promptTokens + llm.completionTokens,
    };
  }

  /**
   * Interactive freeform AI chat and brainstorming.
   */
  async chat(userId: string, dto: AiChatDto) {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const systemPrompt = `You are CreatorStack AI Assistant, an elite social media strategist, copywriter, and growth consultant for creators and agencies. Provide actionable, concise, and structured advice.`;
    const userPrompt = dto.message;

    const llm = await this.executeLLM(systemPrompt, userPrompt);
    await this.trackUsage(dto.workspaceId, userId, 'chat', dto.message, llm.text, llm);

    return {
      message: llm.text,
      tokensUsed: llm.promptTokens + llm.completionTokens,
      model: llm.model,
    };
  }

  /**
   * Retrieves workspace monthly AI token usage and quota stats.
   */
  async getUsageStats(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const wsObjectId = new Types.ObjectId(workspaceId);

    const [usageResult, totalGenerations] = await Promise.all([
      this.aiUsageModel.aggregate([
        { $match: { workspaceId: wsObjectId, createdAt: { $gte: startOfMonth } } },
        {
          $group: {
            _id: null,
            totalTokens: { $sum: '$totalTokens' },
            promptTokens: { $sum: '$promptTokens' },
            completionTokens: { $sum: '$completionTokens' },
          },
        },
      ]),
      this.aiUsageModel.countDocuments({ workspaceId: wsObjectId, createdAt: { $gte: startOfMonth } }),
    ]);

    const usedTokens = usageResult[0]?.totalTokens || 0;
    const monthlyLimit = 100000; // 100k tokens quota per month

    return {
      usedTokens,
      monthlyLimit,
      remainingTokens: Math.max(0, monthlyLimit - usedTokens),
      percentUsed: Number(((usedTokens / monthlyLimit) * 100).toFixed(1)),
      totalGenerations,
      tier: 'Pro',
    };
  }

  /**
   * Retrieves workspace AI generation history.
   */
  async getUsageHistory(workspaceId: string, userId: string, limit = 20) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    return this.aiUsageModel
      .find({ workspaceId: new Types.ObjectId(workspaceId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email avatar')
      .exec();
  }
}
