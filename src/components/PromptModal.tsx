import React, { useState } from 'react';
import { Copy, Check, X, FileCode2, Sparkles, ExternalLink } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { MASTER_AI_STUDIO_PROMPT } from '../data/promptTemplate';

export const PromptModal: React.FC = () => {
  const { isPromptModalOpen, setIsPromptModalOpen, language } = useClinic();
  const [copied, setCopied] = useState(false);
  const isBn = language === 'bn';

  if (!isPromptModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_AI_STUDIO_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {isBn ? 'Google AI Studio মাস্টার প্রম্পট' : 'Master Google AI Studio Prompt'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn
                  ? 'ডায়াগনস্টিক সেন্টার ও নার্সিং হোম ওয়েবসাইটের জন্য রেডি প্রম্পট'
                  : 'Ready-to-use prompt for diagnostic centre & nursing home web portal'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPromptModalOpen(false)}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed selection:bg-blue-600">
          <pre className="whitespace-pre-wrap font-mono">{MASTER_AI_STUDIO_PROMPT}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <span className="text-xs text-slate-500">
            {isBn ? 'প্রম্পট কপি করে Google AI Studio-তে পেস্ট করুন' : 'Copy and paste into Google AI Studio'}
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{isBn ? 'কপি সম্পন্ন হয়েছে!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isBn ? 'প্রম্পট কপি করুন' : 'Copy Prompt'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
