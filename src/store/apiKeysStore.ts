import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApiKeys {
  apifyKey: string;
  phantombusterKey: string;
  aiModelKey: string;
  grammarCheckerKey: string;
  aiDetectorKey: string;
  humanizerKey: string;
  geminiApiKey: string;
  undetectableApiKey: string;
  saplingApiKey: string;
  resendApiKey: string;
  languagetoolApiKey: string;
  uploadPostApiKey: string;
  gemini2FlashKey: string;
}

export interface MockDataFlags {
  useApifyMockData: boolean;
  usePhantombusterMockData: boolean;
  useAiModelMockData: boolean;
  useGrammarCheckerMockData: boolean;
  useAiDetectorMockData: boolean;
  useHumanizerMockData: boolean;
}

interface ApiKeysState {
  apiKeys: ApiKeys;
  mockDataFlags: MockDataFlags;
  updateApiKey: (service: keyof ApiKeys, key: string) => void;
  toggleMockData: (service: keyof MockDataFlags) => void;
  resetToDefaults: () => void;
  loadFromEnv: () => void;
  checkApiKeyStatus: () => { [key: string]: boolean };
}

const defaultApiKeys: ApiKeys = {
  apifyKey: '',
  phantombusterKey: '',
  aiModelKey: '',
  grammarCheckerKey: '',
  aiDetectorKey: '',
  humanizerKey: '',
  geminiApiKey: '',
  undetectableApiKey: '',
  saplingApiKey: '',
  resendApiKey: '',
  languagetoolApiKey: '',
  uploadPostApiKey: '',
  gemini2FlashKey: ''
};

// Default to using real APIs
const defaultMockDataFlags: MockDataFlags = {
  useApifyMockData: false,
  usePhantombusterMockData: false,
  useAiModelMockData: false,
  useGrammarCheckerMockData: false,
  useAiDetectorMockData: false,
  useHumanizerMockData: false
};

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      apiKeys: defaultApiKeys,
      mockDataFlags: defaultMockDataFlags,
      
      updateApiKey: (service: keyof ApiKeys, key: string) => {
        set(state => {
          const newApiKeys = {
            ...state.apiKeys,
            [service]: key
          };
          
          // Auto-update mock flags based on key availability
          const newMockFlags = { ...state.mockDataFlags };
          const serviceToMockFlag: { [key in keyof ApiKeys]?: keyof MockDataFlags } = {
            apifyKey: 'useApifyMockData',
            phantombusterKey: 'usePhantombusterMockData',
            geminiApiKey: 'useAiModelMockData',
            languagetoolApiKey: 'useGrammarCheckerMockData',
            saplingApiKey: 'useAiDetectorMockData',
            undetectableApiKey: 'useHumanizerMockData'
          };
          
          const mockFlag = serviceToMockFlag[service];
          if (mockFlag) {
            newMockFlags[mockFlag] = false; // Always use real API
          }
          
          return {
            apiKeys: newApiKeys,
            mockDataFlags: newMockFlags
          };
        });
      },
      
      toggleMockData: (service: keyof MockDataFlags) => {
        set(state => ({
          mockDataFlags: {
            ...state.mockDataFlags,
            [service]: false // Force to false - always use real API
          }
        }));
      },
      
      loadFromEnv: () => {
        console.log('🔑 Loading API keys from environment variables...');
        
        // Load API keys from environment variables
        const envKeys: ApiKeys = {
          apifyKey: import.meta.env.VITE_APIFY_API_KEY || '',
          phantombusterKey: import.meta.env.VITE_PHANTOMBUSTER_API_KEY || '',
          aiModelKey: import.meta.env.VITE_AI_MODEL_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '',
          grammarCheckerKey: import.meta.env.VITE_LANGUAGETOOL_API_KEY || '',
          aiDetectorKey: import.meta.env.VITE_SAPLING_API_KEY || '',
          humanizerKey: import.meta.env.VITE_UNDETECTABLE_API_KEY || '',
          geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
          undetectableApiKey: import.meta.env.VITE_UNDETECTABLE_API_KEY || '',
          saplingApiKey: import.meta.env.VITE_SAPLING_API_KEY || '',
          resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
          languagetoolApiKey: import.meta.env.VITE_LANGUAGETOOL_API_KEY || '',
          uploadPostApiKey: import.meta.env.VITE_UPLOAD_POST_API_KEY || '',
          gemini2FlashKey: import.meta.env.VITE_GEMINI_API_KEY || ''
        };

        // Force all mock flags to false - always use real APIs
        const mockFlags: MockDataFlags = {
          useApifyMockData: false,
          usePhantombusterMockData: false,
          useAiModelMockData: false,
          useGrammarCheckerMockData: false,
          useAiDetectorMockData: false,
          useHumanizerMockData: false
        };

        // Log status
        const keyStatus = get().checkApiKeyStatus();
        console.log('🔑 API Key Status:', keyStatus);
        
        const liveServices = Object.entries(keyStatus).filter(([_, hasKey]) => hasKey).map(([service]) => service);
        const missingServices = Object.entries(keyStatus).filter(([_, hasKey]) => !hasKey).map(([service]) => service);
        
        if (liveServices.length > 0) {
          console.log('✅ Live Services:', liveServices.join(', '));
        }
        if (missingServices.length > 0) {
          console.log('⚠️ Missing API Keys:', missingServices.join(', '));
        }

        set({
          apiKeys: envKeys,
          mockDataFlags: mockFlags
        });
      },
      
      checkApiKeyStatus: () => {
        const { apiKeys } = get();
        return {
          'Gemini AI': !!apiKeys.geminiApiKey,
          'Gemini 2.0 Flash': !!apiKeys.gemini2FlashKey,
          'Undetectable AI': !!apiKeys.undetectableApiKey,
          'Sapling AI': !!apiKeys.saplingApiKey,
          'Resend Email': !!apiKeys.resendApiKey,
          'Apify Scraper': !!apiKeys.apifyKey,
          'PhantomBuster': !!apiKeys.phantombusterKey,
          'LanguageTool': !!apiKeys.languagetoolApiKey,
          'Upload Post': !!apiKeys.uploadPostApiKey
        };
      },
      
      resetToDefaults: () => {
        set({
          apiKeys: defaultApiKeys,
          mockDataFlags: defaultMockDataFlags
        });
      }
    }),
    {
      name: 'api-keys-storage',
    }
  )
);