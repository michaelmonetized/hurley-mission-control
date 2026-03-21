'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '../../useUser';

interface OptimisticMessage {
  _id: string;
  threadId: string;
  authorUid: string;
  body: string;
  clientMessageId?: string;
  timestamp: number;
  type?: string;
  _isOptimistic?: boolean;
  _isFailed?: boolean;
  _creationTime?: number;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.threadId as string;
  const { userId, isLoading: userLoading } = useUser();

  // Auth check
  useEffect(() => {
    if (!userLoading && !userId) {
      router.push('/sign-in');
    }
  }, [userId, userLoading, router]);

  // Convex hooks
  const messages = useQuery(api.queries.getMessages, threadId ? { threadId: threadId as Id<"threads">, limit: 50 } : 'skip');
  const sendMessage = useMutation(api.mutations.sendMessage);

  // State
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Polling: refetch messages every 2s
  useEffect(() => {
    if (!threadId) return;
    
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
      // Convex useQuery auto-refetches on interval
    }, 2000);

    return () => clearInterval(interval);
  }, [threadId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, optimisticMessages]);

  // Merge optimistic and real messages
  const allMessages = (() => {
    const realMsgs = (messages || []).map((msg: any) => ({
      ...msg,
      timestamp: msg._creationTime,
    }));
    const optimisticOnly = optimisticMessages.filter(
      (opt) => !realMsgs.some((real: any) => real.clientMessageId === opt.clientMessageId)
    );
    return [...realMsgs, ...optimisticOnly].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  })();

  // Clear confirmed optimistic messages
  useEffect(() => {
    if (!messages) return;
    setOptimisticMessages((prev) =>
      prev.filter((opt) => !messages.some((real: any) => real.clientMessageId === opt.clientMessageId))
    );
  }, [messages]);

  // Handle send
  const handleSend = async () => {
    if (!messageText.trim() || !threadId || !userId) return;

    const clientMessageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Add optimistic message
    const optimisticMsg: OptimisticMessage = {
      _id: clientMessageId,
      threadId,
      authorUid: userId,
      body: messageText,
      clientMessageId,
      timestamp: Date.now(),
      type: 'text',
      _isOptimistic: true,
    };

    setOptimisticMessages((prev) => [...prev, optimisticMsg]);
    setMessageText('');
    setSending(true);

    try {
      await sendMessage({
        threadId: threadId as Id<"threads">,
        authorUid: userId,
        body: messageText,
        clientMessageId,
        type: 'text',
      } as any);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mark as failed
      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.clientMessageId === clientMessageId ? { ...msg, _isFailed: true } : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Thread</h1>
              <p className="text-xs text-gray-500">ID: {threadId.slice(0, 8)}...</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Last refresh: {new Date(lastRefresh).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!messages ? (
          <div className="text-center text-gray-500 py-8">Loading messages...</div>
        ) : allMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
        ) : (
          allMessages.map((msg: any) => (
            <div
              key={msg._id}
              className={`flex ${msg.authorUid === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg._isOptimistic
                    ? msg._isFailed
                      ? 'bg-red-100 border border-red-300 text-red-900'
                      : 'bg-yellow-100 border border-yellow-300 text-yellow-900'
                    : msg.authorUid === userId
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.body}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg._isOptimistic
                      ? 'text-gray-600'
                      : msg.authorUid === userId
                        ? 'text-blue-100'
                        : 'text-gray-500'
                  }`}
                >
                  {msg._isOptimistic ? '⟳ Sending...' : ''}{' '}
                  {msg._isFailed ? '✗ Failed' : ''}{' '}
                  {new Date(msg.timestamp || msg._creationTime || 0).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message... (Shift+Enter for newline)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !messageText.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition h-fit ${
              sending || !messageText.trim()
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {sending ? '⟳' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Messages refresh every 2 seconds • Shift+Enter for newline</p>
      </div>
    </div>
  );
}
