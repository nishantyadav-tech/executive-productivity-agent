import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ChatMessage from "../components/ChatMessage";
import SuggestedQuestion from "../components/SuggestedQuestion";
import { suggestedQuestions } from "../data/mockChat";
import { askAgent } from "../services/api";

export default function AskAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendQuestion = async (question) => {
    if (!question.trim() || isThinking) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setIsThinking(true);
    try {
      const response = await askAgent(question);
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: response.answer, sources: response.sources },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: `I couldn't reach the agent backend. Please make sure the FastAPI server is running on port 8000.`, sources: [] },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900">Ask the Executive Agent</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ask questions about commitments, deadlines, meetings and pending actions.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {suggestedQuestions.map((q) => (
              <SuggestedQuestion key={q} question={q} onClick={sendQuestion} />
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} sources={m.sources} />
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 shadow-card rounded-xl2 rounded-bl-sm px-4 py-3 text-sm text-slate-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion(input);
        }}
        className="flex items-center gap-2 pt-3 border-t border-slate-100"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a commitment, deadline or meeting..."
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-ink-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isThinking}
          className="p-2.5 rounded-lg bg-ink-700 text-white hover:bg-ink-900 disabled:opacity-50 transition-colors"
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
