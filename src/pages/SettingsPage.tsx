import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Info,
  Megaphone,
  Moon,
  PackageCheck,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import SiteFooter from "../components/footer/SiteFooter";
import { ROTAS } from "../routes/paths";
import usePreferencesStore, {
  defaultNotifications,
  type NotificationPreferences,
} from "../store/preferencesStore";
import useThemeStore, { type Theme } from "../store/themeStore";

type SectionId = "aparencia" | "notificacoes";

const cardClass =
  "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6";
const sectionTitleClass = "text-lg font-black tracking-tight";

const sections: Array<{
  id: SectionId;
  label: string;
  description: string;
  icon: typeof Palette;
}> = [
  {
    id: "aparencia",
    label: "Aparência",
    description: "Tema claro ou escuro",
    icon: Palette,
  },
  {
    id: "notificacoes",
    label: "Notificações",
    description: "O que você quer receber",
    icon: Bell,
  },
];

const notificationOptions: Array<{
  key: keyof NotificationPreferences;
  title: string;
  description: string;
  icon: typeof Bell;
}> = [
  {
    key: "statusPedido",
    title: "Atualizações de pedidos",
    description:
      "Saiba quando seu pedido for confirmado, sair para entrega ou chegar.",
    icon: PackageCheck,
  },
  {
    key: "promocoes",
    title: "Ofertas e promoções",
    description: "Descontos, cupons e combos especiais dos seus favoritos.",
    icon: Megaphone,
  },
  {
    key: "novidades",
    title: "Novidades da Menuu",
    description: "Novos sabores, restaurantes e recursos adicionados ao app.",
    icon: Sparkles,
  },
];

function ThemeOption({
  mode,
  selected,
  onSelect,
}: {
  mode: Theme;
  selected: boolean;
  onSelect: (theme: Theme) => void;
}) {
  const isLight = mode === "light";
  const Icon = isLight ? Sun : Moon;

  return (
    <label
      className={`relative block cursor-pointer rounded-2xl border p-3 transition ${
        selected
          ? "border-orange-500 shadow-sm shadow-orange-100"
          : "border-slate-200 hover:border-orange-300"
      }`}
    >
      <input
        type="radio"
        name="theme"
        value={mode}
        checked={selected}
        onChange={() => onSelect(mode)}
        className="peer sr-only"
      />

      <div
        aria-hidden="true"
        className="mb-3 rounded-xl p-2.5 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500"
        style={{ backgroundColor: isLight ? "#eef2f7" : "#101216" }}
      >
        <div className="mb-2 flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#f97316" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: isLight ? "#cbd5e1" : "#3a3f48" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: isLight ? "#cbd5e1" : "#3a3f48" }}
          />
        </div>
        <div
          className="rounded-lg p-2.5"
          style={{ backgroundColor: isLight ? "#ffffff" : "#1e2126" }}
        >
          <div
            className="mb-1.5 h-1.5 w-12 rounded-full"
            style={{ backgroundColor: isLight ? "#94a3b8" : "#5b636f" }}
          />
          <div
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: isLight ? "#cbd5e1" : "#3a3f48" }}
          />
          <div className="mt-2.5 flex items-center gap-1.5">
            <span
              className="h-4 w-4 rounded"
              style={{ backgroundColor: isLight ? "#fed7aa" : "#4a2c14" }}
            />
            <span
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: isLight ? "#e2e8f0" : "#2e323a" }}
            />
            <span
              className="h-3 w-6 rounded"
              style={{ backgroundColor: "#f97316" }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${selected ? "text-orange-600" : "text-slate-400"}`}
        />
        <span className="text-sm font-bold text-slate-700">
          {isLight ? "Tema claro" : "Tema escuro"}
        </span>
        <span
          className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border ${
            selected
              ? "border-orange-600 bg-orange-600 text-white"
              : "border-slate-300 text-transparent"
          }`}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {isLight
          ? "Leve e colorido, ideal para o dia a dia."
          : "Menos brilho para pedir à noite."}
      </p>
    </label>
  );
}

function NotificationToggle({
  title,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  icon: typeof Bell;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-700">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
          checked ? "bg-orange-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
          style={{ backgroundColor: "#ffffff" }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("aparencia");
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const notifications = usePreferencesStore((state) => state.notifications);
  const setNotification = usePreferencesStore((state) => state.setNotification);
  const resetNotifications = usePreferencesStore(
    (state) => state.resetNotifications,
  );

  const activeNotifications = notificationOptions.filter(
    (option) => notifications[option.key],
  ).length;
  const isDefaultNotifications = notificationOptions.every(
    (option) => notifications[option.key] === defaultNotifications[option.key],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 sm:px-6">
        <div className="flex items-center gap-2 py-5 text-sm text-slate-500">
          <Link
            to={ROTAS.cardapio}
            className="transition-colors hover:text-orange-600"
          >
            Início
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-slate-700">Configurações</span>
        </div>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-600">
              Preferências
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Configurações
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Ajuste a aparência e as notificações da sua conta.
            </p>
          </div>
          <Link
            to={ROTAS.cardapio}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className={cardClass}>
              <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                Preferências
              </p>
              <nav className="space-y-1" aria-label="Seções de configuração">
                {sections.map(({ id, label, description, icon: Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveSection(id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        isActive
                          ? "bg-orange-600 text-white"
                          : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{label}</span>
                        <span
                          className={`mt-0.5 block truncate text-[11px] ${
                            isActive ? "text-orange-100" : "text-slate-400"
                          }`}
                        >
                          {description}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    </button>
                  );
                })}
              </nav>
              <Link
                to={ROTAS.editarPerfil}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
              >
                <UserRound className="h-4 w-4" />
                Editar perfil
                <ChevronRight className="ml-auto h-4 w-4" />
              </Link>
              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-black">Salvo no aparelho</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  Suas preferências ficam guardadas neste dispositivo e são
                  aplicadas na hora.
                </p>
              </div>
            </section>
          </aside>

          <div className="min-w-0 space-y-5">
            <motion.section
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cardClass}
            >
              {activeSection === "aparencia" && (
                <>
                  <div className="mb-5 flex items-start gap-3">
                    <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className={sectionTitleClass}>Aparência</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Escolha como a Menuu deve aparecer para você.
                      </p>
                    </div>
                    <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700 sm:inline-flex">
                      <Check className="h-3.5 w-3.5" />
                      Aplicado
                    </span>
                  </div>

                  <div
                    className="grid gap-3 sm:grid-cols-2"
                    role="radiogroup"
                    aria-label="Tema da aplicação"
                  >
                    <ThemeOption
                      mode="light"
                      selected={theme === "light"}
                      onSelect={setTheme}
                    />
                    <ThemeOption
                      mode="dark"
                      selected={theme === "dark"}
                      onSelect={setTheme}
                    />
                  </div>

                  <div className="mt-5 flex items-start gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <p className="text-xs leading-relaxed text-slate-500">
                      O tema é aplicado imediatamente e também pode ser alterado
                      pelo botão de sol/lua no topo do cardápio.
                    </p>
                  </div>
                </>
              )}

              {activeSection === "notificacoes" && (
                <>
                  <div className="mb-5 flex items-start gap-3">
                    <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className={sectionTitleClass}>Notificações</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Escolha quais avisos fazem sentido para você.
                      </p>
                    </div>
                    <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-500 sm:inline-flex">
                      {activeNotifications} de {notificationOptions.length}{" "}
                      ativas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {notificationOptions.map((option) => (
                      <NotificationToggle
                        key={option.key}
                        title={option.title}
                        description={option.description}
                        icon={option.icon}
                        checked={notifications[option.key]}
                        onChange={(value) =>
                          setNotification(option.key, value)
                        }
                      />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Info className="h-4 w-4 shrink-0" />
                      Preferências salvas neste aparelho.
                    </p>
                    <button
                      type="button"
                      onClick={resetNotifications}
                      disabled={isDefaultNotifications}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Restaurar padrões
                    </button>
                  </div>
                </>
              )}

            </motion.section>
          </div>
        </div>
      </main>

      <SiteFooter rota={ROTAS.cardapio} />
    </div>
  );
}
