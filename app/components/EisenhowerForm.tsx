"use client";
import { useState } from "react";
import { updateToolEntry } from "@/app/actions/tool-entries";
import { generateAnalysis, generateActionPlan } from "@/app/actions/ai";

interface EisenhowerFormProps {
  entryId: string;
  initialData?: { q1: string[]; q2: string[]; q3: string[]; q4: string[] };
}

export function EisenhowerForm({ entryId, initialData }: EisenhowerFormProps) {
  const [tasks, setTasks] = useState(initialData || { q1: [], q2: [], q3: [], q4: [] });
  const [newTask, setNewTask] = useState("");
  const [selectedQ, setSelectedQ] = useState("q1");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks({
      ...tasks,
      [selectedQ]: [...(tasks[selectedQ as keyof typeof tasks] || []), newTask],
    });
    setNewTask("");
  };

  async function handleAnalyze() {
    setLoading(true);
    const tasksText = Object.entries(tasks)
      .map(([q, list]) => `${q}: ${list.length > 0 ? list.join(", ") : "(vazio)"}`)
      .join("\n");

    const { analysis: aiAnalysis } = await generateAnalysis(
      "eisenhower",
      `Analise esta Matriz de Eisenhower:\n${tasksText}\n\nIdentifique prioridades, alertas e foco para 48h.`
    );

    setAnalysis(aiAnalysis || "");
    await updateToolEntry(entryId, tasks, aiAnalysis);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { q: "q1", label: "Urgente + Importante", color: "#c0392b" },
          { q: "q2", label: "Importante (Agendar)", color: "#1a6b4a" },
          { q: "q3", label: "Urgente (Delegar)", color: "#7a5c1e" },
          { q: "q4", label: "Eliminar", color: "#6b7280" },
        ].map((item) => (
          <div key={item.q} className="rounded-lg p-4 border" style={{ backgroundColor: "var(--white)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: item.color }}>
              {item.label}
            </h3>
            <div className="space-y-1 text-xs">
              {(tasks[item.q as keyof typeof tasks] || []).map((task, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-gray-100 flex justify-between"
                  onClick={() =>
                    setTasks({
                      ...tasks,
                      [item.q]: (tasks[item.q as keyof typeof tasks] || []).filter((_, idx) => idx !== i),
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  {task} <span>×</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={selectedQ}
          onChange={(e) => setSelectedQ(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="q1">Q1: Urgente + Importante</option>
          <option value="q2">Q2: Importante</option>
          <option value="q3">Q3: Urgente</option>
          <option value="q4">Q4: Eliminar</option>
        </select>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Nova tarefa..."
        />
        <button
          onClick={addTask}
          className="px-4 py-2 rounded text-white font-semibold"
          style={{ backgroundColor: "var(--gold)" }}
        >
          Adicionar
        </button>
      </div>

      <button onClick={handleAnalyze} disabled={loading} className="w-full px-6 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: "var(--navy)" }}>
        {loading ? "Analisando..." : "Analisar com IA"}
      </button>

      {analysis && (
        <div className="rounded-2xl p-7 border" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
          <div className="text-sm whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
    </div>
  );
}
