export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export interface TopicData {
  name: string;
  relevance: number; // 0-100
  description: string;
}

export interface AnalysisResult {
  topics: TopicData[];
  summary: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AppState {
  materials: StudyMaterial[];
  isProcessing: boolean;
  topics: TopicData[];
  chatHistory: Message[];
}

// Standard Google GenAI Schema Types for structured output
export enum GeminiType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  NULL = 'NULL',
}