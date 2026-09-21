"use client";

import { useState } from "react";
import Link from "next/link";
import type { EmissionsEstimate } from "../lib/emissions-estimator";

export default function Home() {
  const [activityText, setActivityText] = useState("");
  const [estimate, setEstimate] = useState<EmissionsEstimate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const hasDetectedData = estimate !== null && Object.keys(estimate.detectedData).length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: activityText }),
      });
      const data = (await response.json()) as EmissionsEstimate | { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible analizar la actividad.");
      }

      setEstimate(data as EmissionsEstimate);
    } catch (error) {
      setEstimate(null);
      setAnalysisError(error instanceof Error ? error.message : "No fue posible analizar la actividad.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7f3] text-[#17231b]">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 py-4 sm:px-10 sm:py-5 lg:px-14">
        <header className="flex items-center justify-between border-b border-[#dce5dc] pb-4">
          <Link className="flex items-center gap-3" href="/" aria-label="EcoTrack AI, inicio">
            <span className="grid size-10 place-items-center rounded-lg bg-[#176b43] text-sm font-bold text-white shadow-sm">
              E
            </span>
            <span className="text-lg font-semibold">EcoTrack AI</span>
          </Link>
          <span className="hidden text-sm font-medium text-[#718075] sm:block">Panel de emisiones</span>
        </header>

        <section className="grid items-center gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-20 lg:py-10">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold text-[#287653]">Registro diario</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] text-[#17231b] sm:text-5xl">
              Entiende el impacto de tu operacion.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#59675d] sm:text-lg sm:leading-8">
              Convierte las actividades de tu negocio en una estimacion simple de emisiones.
            </p>
          </div>

          <form
            className="rounded-lg border border-[#d9e2da] bg-white p-5 shadow-[0_12px_32px_rgba(26,57,36,0.07)] sm:p-6"
            onSubmit={handleSubmit}
          >
            <label className="mb-3 block text-base font-semibold text-[#26362b]" htmlFor="activities">
              Actividades de hoy
            </label>
            <textarea
              className="min-h-40 w-full resize-y rounded-md border border-[#cfdbd1] bg-[#fbfdfb] px-4 py-4 text-base leading-7 text-[#26362b] outline-none transition placeholder:text-[#8a978d] focus:border-[#287653] focus:ring-4 focus:ring-[#287653]/10 sm:min-h-44"
              id="activities"
              name="activities"
              placeholder="Ej: Hoy usamos 3 camionetas de reparto, recorrimos 120 km y consumimos 200 kWh de electricidad."
              value={activityText}
              onChange={(event) => setActivityText(event.target.value)}
            />
            <button
              className="mt-4 w-full rounded-md bg-[#176b43] px-5 py-3.5 text-base font-semibold text-white shadow-[0_6px_14px_rgba(23,107,67,0.2)] transition hover:bg-[#105536] hover:shadow-[0_8px_18px_rgba(23,107,67,0.25)] focus:outline-none focus:ring-4 focus:ring-[#176b43]/20 focus:ring-offset-2"
              disabled={isAnalyzing}
              type="submit"
            >
              {isAnalyzing ? "Analizando..." : "Analizar huella"}
            </button>
            {analysisError ? <p className="mt-3 text-sm text-[#a53a32]" role="alert">{analysisError}</p> : null}
          </form>
        </section>

        <section className="border-t border-[#dce5dc] py-6 sm:py-8" aria-labelledby="results-title">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#287653]">Resultado</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#17231b]" id="results-title">
                Resumen de impacto
              </h2>
            </div>
            <span className="text-sm font-medium text-[#718075]">
              {isAnalyzing
                ? "Analizando..."
                : estimate
                  ? hasDetectedData
                    ? "Análisis completado"
                    : "Sin datos reconocibles"
                  : "Pendiente de analizar"}
            </span>
          </div>
          <div className="grid overflow-hidden rounded-lg border border-[#d9e2da] bg-white shadow-[0_8px_24px_rgba(26,57,36,0.05)] sm:grid-cols-3">
            <ResultValue
              label="Huella estimada total"
              value={hasDetectedData ? `${estimate.totalKgCo2e} kg CO2e` : "-- kg CO2e"}
              emphasized
            />
            <ResultValue
              label="Electricidad"
              value={hasDetectedData ? `${estimate.electricityKgCo2e} kg CO2e` : "-- kg CO2e"}
            />
            <ResultValue
              label="Transporte"
              value={hasDetectedData ? `${estimate.transportKgCo2e} kg CO2e` : "-- kg CO2e"}
            />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#637267]">
            Estimación educativa basada en factores simplificados. No corresponde a un inventario oficial de emisiones.
          </p>
        </section>
      </div>
    </main>
  );
}

function ResultValue({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="min-h-28 border-b border-[#e0e7e1] bg-white px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-sm font-medium text-[#718075]">{label}</p>
      <p className={`mt-3 font-semibold text-[#253c2d] ${emphasized ? "text-3xl" : "text-xl"}`}>{value}</p>
    </div>
  );
}
