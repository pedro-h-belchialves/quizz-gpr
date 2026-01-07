"use client";

import { useState } from "react";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { DM_Serif_Display } from "next/font/google";

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const gloock = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});
const questions = [
  "Como está hoje o planejamento estratégico da sua clínica para 2026",
  "Como estão hoje as fontes de captação de pacientes da sua clínica",
  "Como está o planejamento para ativar novas fontes de captação em 2026",
  "Como está a experiência do paciente e o pós atendimento da sua clínica",
  "Como estão hoje os scripts de atendimento, fechamento e reativação de pacientes",
];

export default function ClinicSurvey() {
  const [answers, setAnswers] = useState<number[]>(Array(5).fill(-1));
  const [showForm, setShowForm] = useState(true);
  const [leadInfo, setLeadInfo] = useState({
    nome: "",
    telefone: "",
    instagram: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    instagram: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const calculateAverage = () => {
    const validAnswers = answers.filter((a) => a >= 0);
    if (validAnswers.length === 0) return 0;
    return (
      validAnswers.reduce((sum, val) => sum + val, 0) / validAnswers.length
    );
  };

  const handleContinue = () => {
    if (answers.every((a) => a >= 0)) {
      setShowResults(true);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setLeadInfo(formData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const average = calculateAverage();

      const { error } = await supabase.from("survey_responses").insert({
        question_1: answers[0],
        question_2: answers[1],
        question_3: answers[2],
        question_4: answers[3],
        question_5: answers[4],
        average_score: average,
        nome: leadInfo.nome,
        telefone: leadInfo.telefone,
        instagram: leadInfo.instagram,
      });

      if (error) throw error;

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const average = calculateAverage();
  const allAnswered = answers.every((a) => a >= 0);

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-zinc-900 to-stone-900 flex items-center justify-center p-4">
        {/* <div className="max-w-2xl w-full bg-amber-500/2 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-amber-500/20 shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Obrigado!
          </h2>
          <p className="text-xl text-white mb-2">
            Sua pontuação:{" "}
            <span className="font-bold text-2xl text-white">
              {average.toFixed(1)}/10
            </span>
          </p>
          <p className="text-amber-500">
            Entraremos em contato em breve para agendar sua reunião de
            planejamento estratégico.
          </p>
        </div> */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-6 md:p-8 border border-red-500/30 mb-8 md:mb-10 text-center">
            <p className="text-red-400 text-base md:text-lg mb-2">
              Sua Pontuação
            </p>
            <p className="text-5xl md:text-7xl font-bold text-white mb-2">
              {average.toFixed(1)}
              <span className="text-2xl md:text-3xl text-red-400">/10</span>
            </p>

            <p className="text-red-400  text-sm md:text-base">
              {average < 2
                ? "Pessima! Precisa de crescimento urgente!"
                : "Ainda há muito para melhorar!"}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Você pode mudar esse cenário
            </h2>
            <p className="text-amber-100 text-center mb-6 md:mb-8 text-sm md:text-base">
              Preparamos um presente para você: uma reunião individual de
              planejamento estratégico, focada em clareza, direção e próximos
              passos práticos.
            </p>
            <p className="text-amber-100 text-center mb-6 md:mb-8 text-sm md:text-base">
              Em breve um membro da equipe entrará em contato
            </p>
          </div>
        </div>
      </div>
    );
  }

  // anul: #091836
  // dourado from #977e4b
  return (
    <div className="min-h-screen bg-gradient-to-br from-black  to-[#091836] flex items-center justify-center py-8 px-4 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-radial from-[#977e4b]/20 to-[#091836]/20 backdrop-blur-xl rounded-3xl p-6 md:p-12 border border-black/20 shadow-2xl">
          <h1
            className={`${gloock.className} text-3xl md:text-5xl font-bold uppercase text-white text-center mb-3 md:mb-4 leading-tight`}
          >
            Descubra se sua clínica está preparada para
            <span className="text-[#977e4b]"> crescer em 2026 </span>
          </h1>
          {/* <Image
            src="/fabio.png"
            alt="Logo"
            width={500}
            height={500}
            className="mx-auto"
          /> */}

          <img
            src="/fabio.png"
            alt="Logo"
            className="mx-auto  object-bottom object-cover w-80 h-80 scale-125 "
          />

          {
            showForm ? (
              <>
                <form onSubmit={submitForm} className="space-y-4 md:space-y-5">
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm md:text-base">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm md:text-base"
                      placeholder="Digite seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm md:text-base">
                      Whatsapp
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm md:text-base"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm md:text-base">
                      Instagram
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm md:text-base"
                      placeholder="@seuperfil"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 md:py-5 bg-[#977e4b] text-white rounded-xl font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-[#977e4b]/50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : "Ir para as perguntas"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-amber-50 text-center mb-8 md:mb-12 text-sm md:text-base">
                  Responda às 5 perguntas dando uma nota de 0 a 10, sendo 0
                  muito ruim e 10 excelente.
                </p>

                <div className="space-y-8 md:space-y-10">
                  <div
                    key={step}
                    className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
                      {/* <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[#977e4b]/10 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                      {step}
                    </span> */}
                      <p className="text-white text-center text-base md:text-lg font-medium leading-relaxed pt-1">
                        {questions[step - 1]}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                      {[...Array(11)].map((_, value) => (
                        <button
                          key={value}
                          onClick={() => handleAnswerChange(step - 1, value)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold text-sm md:text-base transition-all duration-200 ${
                            answers[step - 1] === value
                              ? "bg-[#977e4b] text-white shadow-lg shadow-[#977e4b]/50 scale-110"
                              : "bg-white/3 text-amber-200 hover:bg-white/20 hover:scale-105"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {step > 4 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className={`w-full mt-8 md:mt-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg transition-all duration-200 bg-[#977e4b] text-white shadow-2xl shadow-[#977e4b]/50 hover:scale-105"`}
                  >
                    Ver resultados
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(step + 1)}
                    className={`w-full mt-8 md:mt-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg transition-all duration-200 bg-[#977e4b] text-white hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105"
                     `}
                  >
                    Continuar
                  </button>
                )}
              </>
            )
            // : (
            //   <div className="mt-8">
            //     <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-6 md:p-8 border border-red-500/30 mb-8 md:mb-10 text-center">
            //       <p className="text-red-400 text-base md:text-lg mb-2">
            //         Sua Pontuação
            //       </p>
            //       <p className="text-5xl md:text-7xl font-bold text-white mb-2">
            //         {average.toFixed(1)}
            //         <span className="text-2xl md:text-3xl text-red-400">/10</span>
            //       </p>
            //       <p className="text-red-400 text-sm md:text-base">
            //         ⚠️ Há muito espaço para crescimento!
            //       </p>
            //     </div>

            //     <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
            //       <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            //         Agende sua Reunião de Planejamento Estratégico
            //       </h2>
            //       <p className="text-amber-100 text-center mb-6 md:mb-8 text-sm md:text-base">
            //         Preencha seus dados e nossa equipe entrará em contato
            //       </p>
            //     </div>
            //   </div>
            // )
          }
        </div>
      </div>
    </div>
  );
}
