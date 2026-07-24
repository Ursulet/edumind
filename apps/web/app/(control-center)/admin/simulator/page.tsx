"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@edumind/ui";
import { e2eJourneys } from "../../../../lib/e2e-mocks";

export default function E2ESimulatorPage() {
  const [activeJourney, setActiveJourney] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const runSimulation = (journeyId: string) => {
    setActiveJourney(journeyId);
    setRunning(true);
    setLogs([]);
    setProgress(0);

    const journey = e2eJourneys.find(j => j.id === journeyId);
    if (!journey) return;

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < journey.steps.length) {
        setLogs(prev => [...prev, journey.steps[stepIndex]]);
        setProgress(Math.round(((stepIndex + 1) / journey.steps.length) * 100));
        stepIndex++;
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 800); // simulate delay per step
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Simulator E2E Acceptance</h1>
          <p className="text-sm text-muted-text">Validarea automată a scenariilor critice de business (Fără DB)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Playbooks */}
        <div className="space-y-4">
          <h2 className="font-medium text-primary-ink">Scenarii Disponibile</h2>
          {e2eJourneys.map(journey => (
            <Card key={journey.id} className="bg-white border-border shadow-sm">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="max-w-[70%]">
                  <h3 className="font-semibold text-primary-ink text-sm">{journey.title}</h3>
                  <p className="text-xs text-muted-text mt-1">{journey.description}</p>
                </div>
                <Button 
                  onClick={() => runSimulation(journey.id)} 
                  disabled={running}
                  className="bg-forest-accent text-warm-surface hover:bg-forest-hover"
                >
                  {running && activeJourney === journey.id ? "Se rulează..." : "Rulează Test"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: Console Output */}
        <Card className="bg-primary-ink border-border shadow-sm h-[500px] flex flex-col">
          <CardHeader className="border-b border-gray-700 p-4 bg-gray-900 rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-warm-surface text-sm font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Console Output
              </CardTitle>
              {running && (
                <span className="text-xs font-mono text-sage-surface">
                  {progress}%
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto font-mono text-xs text-green-400 bg-gray-900 rounded-b-lg space-y-2">
            {logs.length === 0 && !running && (
              <span className="text-gray-500">Așteptare comandă de rulare...</span>
            )}
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-gray-500">[{new Date().toISOString().split('T')[1].substring(0,8)}]</span>
                <span className="text-white">INFO:</span>
                <span className="text-green-300">{log}</span>
              </div>
            ))}
            {!running && progress === 100 && (
              <div className="mt-4 pt-4 border-t border-gray-800 text-blue-400 font-bold">
                ✓ SCENARIU FINALIZAT CU SUCCES (0 ERRORS)
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

