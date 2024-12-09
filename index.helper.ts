/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import {
  Content,
  GoogleGenerativeAI,
  ResponseSchema,
} from '@google/generative-ai'; // Importing Google Generative AI
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AnyMessage } from '@/chat/schemas/types/message';
import { HelperService } from '@/helper/helper.service';
import BaseLlmHelper from '@/helper/lib/base-llm-helper';
import { LLM } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { Setting } from '@/setting/schemas/setting.schema';
import { SettingService } from '@/setting/services/setting.service';

import { GEMINI_HELPER_NAME } from './settings';

type GeminiGenerationSettings = Omit<
  Settings['gemini_helper'],
  'token' | 'model'
>;

@Injectable()
export default class GeminiLlmHelper
  extends BaseLlmHelper<typeof GEMINI_HELPER_NAME>
  implements OnApplicationBootstrap
{
  private client: GoogleGenerativeAI;

  /**
   * Instantiate the LLM helper
   *
   * @param logger - Logger service
   */
  constructor(
    settingService: SettingService,
    helperService: HelperService,
    protected readonly logger: LoggerService,
  ) {
    super('gemini-helper', settingService, helperService, logger);
  }

  getPath(): string {
    return __dirname;
  }

  async onApplicationBootstrap() {
    const settings = await this.getSettings();

    this.client = new GoogleGenerativeAI(settings.token);
  }

  @OnEvent('hook:gemini_helper:token')
  handleApiUrlChange(setting: Setting) {
    this.client = new GoogleGenerativeAI(setting.value);
  }

  /**
   * Converts a snake_case string to camelCase.
   * @param key - The snake_case string.
   * @returns The camelCase string.
   */
  private toCamelCase(key: string): string {
    return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Converts all keys of an object from snake_case to camelCase.
   * @param obj - Object with snake_case keys.
   * @returns New object with camelCase keys.
   */
  private buildGenerationConfig(obj: GeminiGenerationSettings): {
    [key: string]: any;
  } {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const camelCaseKey = this.toCamelCase(key);
        acc[camelCaseKey] = obj[key];
        return acc;
      },
      {} as { [key: string]: any },
    );
  }

  /**
   * Generates a response using Google Gemini
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param systemInstruction - The input text from the system
   * @param options - The API request options
   *
   * @returns - The generated response from Google Gemini
   */
  async generateResponse(
    prompt: string,
    model: string,
    systemInstruction?: string,
    options: Partial<GeminiGenerationSettings> = {},
  ): Promise<string> {
    const {
      token: _t,
      model: globalModel,
      ...globalOptions
    } = await this.getSettings();
    const genModel = this.client.getGenerativeModel({
      model: model || globalModel,
      systemInstruction,
      generationConfig: {
        /* 
          =====================================================================
          Check the documentation for more details on the generation config 
          https://ai.google.dev/api/generate-content#v1beta.GenerationConfig 
          =====================================================================
          */
        ...this.buildGenerationConfig({
          ...globalOptions,
          ...options,
        }),
        responseMimeType: 'text/plain',
      },
    });
    const completion = await genModel.generateContent(prompt);

    return completion.response.text();
  }

  /**
   * Generates a structured response using Google Gemini
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param systemInstruction - The input text from the system
   * @param options - The API request options
   *
   * @returns - The generated response from Google Gemini
   */
  async generateStructuredResponse<T>(
    prompt: string,
    model: string,
    systemInstruction: string,
    schema: LLM.ResponseSchema,
    options: Partial<GeminiGenerationSettings> = {},
  ): Promise<T> {
    const {
      token: _t,
      model: globalModel,
      ...globalOptions
    } = await this.getSettings();
    const genModel = this.client.getGenerativeModel({
      model: model || globalModel,
      systemInstruction,
      generationConfig: {
        /* 
          =====================================================================
          Check the documentation for more details on the generation config 
          https://ai.google.dev/api/generate-content#v1beta.GenerationConfig 
          =====================================================================
          */
        ...this.buildGenerationConfig({
          ...globalOptions,
          ...options,
        }),
        // Force the model to be deterministic
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: schema as unknown as ResponseSchema,
      },
    });
    const completion = await genModel.generateContent(prompt);

    return JSON.parse(completion.response.text()) as T;
  }

  /**
   * Ensures that the first message is from the user
   *
   * @param messages - Gemini message array
   *
   * @returns Gemini message array
   */
  private ensureFirstMessageFromUser(messages: Content[]) {
    // Iterate until the first message is from 'user'
    while (messages.length > 0 && messages[0].role !== 'user') {
      // Remove the first message if it's not from the user
      messages.shift();
    }
    return messages;
  }

  /**
   * Formats messages to the Gemini required data structure
   *
   * @param messages - Message history to include
   *
   * @returns Gemini message array
   */
  private formatMessages(messages: AnyMessage[]): Content[] {
    const contents = messages.map((m) => {
      return {
        role: 'sender' in m && m.sender ? `user` : `model`,
        parts: [
          {
            text:
              'text' in m.message && m.message.text
                ? m.message.text
                : JSON.stringify(m.message),
          },
        ],
      };
    });

    return this.ensureFirstMessageFromUser(contents);
  }

  /**
   * Send a chat completion request with the conversation history.
   * You can use this same approach to start the conversation
   * using multi-shot or chain-of-thought prompting.
   *
   * @param prompt - The input text from the user
   * @param model - The model to be used
   * @param systemInstruction - The system instructions
   * @param history - Array of messages
   * @param options - The API request options
   *
   * @returns - The generated response from the LLM
   */
  public async generateChatCompletion(
    prompt: string,
    model?: string,
    systemInstruction?: string,
    history: AnyMessage[] = [],
    options: Partial<GeminiGenerationSettings> = {},
  ) {
    const { token: _t, model: _m, ...globalOptions } = await this.getSettings();
    const genModel = this.client.getGenerativeModel({
      model,
      systemInstruction,
      generationConfig: {
        /*
          =====================================================================
          Check the documentation for more details on the generation config 
          https://ai.google.dev/api/generate-content#v1beta.GenerationConfig 
          =====================================================================
          */
        ...this.buildGenerationConfig({
          ...globalOptions,
          ...options,
        }),
      },
    });

    const chat = genModel.startChat({
      history: this.formatMessages(history),
    });

    const completion = await chat.sendMessage(prompt);

    return completion.response.text();
  }
}
