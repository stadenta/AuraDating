import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Crown,
  Coins,
  ShieldAlert,
  Sparkles,
  Info,
} from 'lucide-react';
import { SanitizedProfile, PricingConfig, UserSession, ChatMessage } from '../types';
import { api } from '../services/backendApi';

interface ChatModalProps {
  profile: SanitizedProfile | null;
  currentUser: UserSession;
  pricingConfig: PricingConfig;
  messageCost: number;
  onClose: () => void;
  onOpenWallet: () => void;
  onRefreshUser: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  profile,
  currentUser,
  pricingConfig,
  messageCost,
  onClose,
  onOpenWallet,
  onRefreshUser,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      const history = api.getChatHistory(profile.id);
      setMessages(history);
    }
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!profile) return null;

  const isVip = profile.isVip;
  const hasCredits = currentUser.credits >= messageCost;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!inputText.trim()) return;

    if (!hasCredits) {
      setErrorMessage(`Insufficient credits. Each message costs ${messageCost} credits. Please top up.`);
      return;
    }

    const res = api.sendChatMessage(profile.id, inputText.trim());
    if (res.success && res.chat) {
      setMessages((prev) => [...prev, res.chat!]);
      setInputText('');
      onRefreshUser();

      // Trigger realistic smart simulation reply after short pause
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyPool = isVip
          ? [
              `Thank you for reaching out! It is so refreshing to meet someone who appreciates genuine conversation. Tell me, what drew your eye to my portfolio?`,
              `Hello! Delightful to connect with you. I was just finishing a collection review. How has your week been unfolding?`,
              `Good evening! That is a very thoughtful question. I would love to talk more about it over a glass of wine sometime.`,
            ]
          : [
              `Hey there! Thanks for your message. How is your day going?`,
              `Hi! Great to connect with you on Aura. What kind of music or hobbies do you enjoy?`,
              `Thanks for saying hi! I loved reading through your interest tags too.`,
            ];

        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
        const simulatedReply: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: profile.id,
          senderName: profile.displayName,
          recipientId: currentUser.id,
          text: randomReply,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, simulatedReply]);
      }, 1400);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg h-[620px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.displayName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  profile.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {profile.displayName}
                </span>
                {profile.isVip && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/40 uppercase">
                    <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>VIP</span>
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {profile.city}, {profile.country} · {profile.onlineStatus === 'online' ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Wallet Quick Indicator */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-mono font-medium hover:bg-amber-100 transition-colors"
            >
              <Coins className="w-3 h-3 text-amber-500" />
              <span>{currentUser.credits} cr</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close chat"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pricing Notice Bar */}
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
            isVip
              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isVip ? 'VIP Tier Rate:' : 'Regular Tier Rate:'}{' '}
              <strong className="font-mono tabular-nums">{messageCost} credits</strong> per message sent
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Deducted on send</span>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Sparkles className="w-8 h-8 mb-2 text-rose-400/80" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Start an authentic conversation with {profile.displayName}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Messages are private, encrypted, and billed at {messageCost} credits per dispatch.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMine
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {msg.creditsDeducted && (
                      <span>· {msg.creditsDeducted} cr</span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex items-center gap-1 text-slate-400 text-xs italic pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">{profile.displayName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error notification if out of credits */}
        {errorMessage && (
          <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 flex items-center justify-between">
            <span className="truncate">{errorMessage}</span>
            <button
              onClick={onOpenWallet}
              className="underline font-bold shrink-0 ml-2"
            >
              Get Credits
            </button>
          </div>
        )}

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type a thoughtful message (${messageCost} credits)...`}
            className="flex-1 py-2.5 px-4 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500 disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
