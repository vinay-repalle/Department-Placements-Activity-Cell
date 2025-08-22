import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TypingIndicator = () => (
  <div className="flex items-center gap-2 mt-1 mb-2">
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0s]"></span>
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
    <span className="text-gray-500 ml-2 text-sm">Alumni Assistant is typing...</span>
  </div>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/gemini/chat', {
        messages: newMessages.map(m => m.text)
      });
      const botReply = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      setMessages([...newMessages, { role: 'bot', text: botReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'bot', text: 'Error: ' + err.message }]);
    }
    setLoading(false);
  };

  // Close dialog when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <>
      {/* Floating message icon */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 focus:outline-none transition"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
        onClick={() => setOpen(true)}
        aria-label="Open chatbot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </button>
      {/* Chat dialog */}
      {open && (
        <div className="fixed bottom-8 right-8 z-50 flex items-end justify-end">
          <div
            ref={dialogRef}
            className="relative bg-white/90 rounded-3xl shadow-2xl border border-gray-200 flex flex-col backdrop-blur-lg"
            style={{ width: 400, height: 540 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 rounded-t-3xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fff" /><path d="M12 17v.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" /><path d="M9 9a3 3 0 016 0c0 1.5-1.5 2.5-3 2.5S9 10.5 9 9z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" /></svg>
                <span className="font-semibold text-lg tracking-wide">Alumni Assistant</span>
              </div>
              <button
                className="text-white/80 hover:text-white text-2xl font-bold focus:outline-none px-2 py-1 rounded-full hover:bg-white/10 transition"
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
              >
                &times;
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3" style={{ maxHeight: 400 }}>
              {messages.map((m, i) => (
                <div key={i} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`max-w-[75%] px-4 py-2 rounded-xl shadow-md text-base whitespace-pre-line break-words ${m.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white self-end'
                    : 'bg-white/90 text-gray-900 self-start border border-gray-200'}`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
              {loading && <TypingIndicator />}
            </div>
            {/* Input */}
            <div className="flex gap-2 px-4 pb-4 pt-2 bg-white/80 rounded-b-3xl border-t border-gray-100">
              <input
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about the alumni website..."
                disabled={loading}
                autoFocus
              />
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
                onClick={sendMessage}
                disabled={loading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 