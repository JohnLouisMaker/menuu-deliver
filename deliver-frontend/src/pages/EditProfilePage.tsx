import { AxiosError } from "axios";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Info,
  LogOut,
  Mail,
  Megaphone,
  Moon,
  Package,
  PackageCheck,
  Palette,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import api from "../api/api";
import SiteFooter from "../components/footer/SiteFooter";
import { ROTAS } from "../routes/paths";
import useAuthStore, { type User } from "../store/authStore";
import usePreferencesStore, {
  defaultNotifications,
  type NotificationPreferences,
} from "../store/preferencesStore";
import useThemeStore, { type Theme } from "../store/themeStore";

const cardClass =
  "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6";
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500 disabled:opacity-60";

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className={`${cardClass} flex items-center gap-3`}>
      <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
        {icon}
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  icon,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={type === "email" ? "email" : "name"}
          required
          maxLength={type === "email" ? 150 : 100}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={disabled}
          placeholder={type === "email" ? "seu@email.com" : "Seu nome completo"}
          className={inputClass}
        />
      </div>
    </div>
  );
}

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

export default function EditProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const notifications = usePreferencesStore((state) => state.notifications);
  const setNotification = usePreferencesStore((state) => state.setNotification);
  const resetNotifications = usePreferencesStore(
    (state) => state.resetNotifications,
  );
  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [pedidoCount, setPedidoCount] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "auto";
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    let active = true;
    api
      .get<Array<{ id: number }>>("/pedidos/meus_pedidos")
      .then(({ data }) => active && setPedidoCount(data.length))
      .catch(() => active && setPedidoCount(null));
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEditing) return;
    setError(null);
    setIsSaved(false);
    const nomeAtualizado = nome.trim();
    const emailAtualizado = email.trim();
    if (!nomeAtualizado || !emailAtualizado) {
      setError("Preencha seu nome e e-mail.");
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await api.patch<User>("/auth/me", {
        nome: nomeAtualizado,
        email: emailAtualizado,
      });
      setUser(data);
      setNome(data.nome);
      setEmail(data.email);
      setIsSaved(true);
      setIsEditing(false);
    } catch (err) {
      const axiosError = err as AxiosError<{
        detail?: string;
        message?: string;
      }>;
      setError(
        axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          "Não foi possível salvar suas alterações. Tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setNome(user?.nome ?? "");
    setEmail(user?.email ?? "");
    setError(null);
    setIsSaved(false);
    setIsEditing(false);
  }

  function handleStartEditing() {
    if (isSaving) return;
    setIsEditing(true);
    setError(null);
    setIsSaved(false);
    requestAnimationFrame(() => {
      document.getElementById("profile-name")?.focus({ preventScroll: true });
    });
  }

  function handleLogout() {
    logout();
    navigate(ROTAS.login, { replace: true });
  }

  function openSection(sectionId: string) {
    navigate({ pathname: ROTAS.perfil, hash: sectionId }, { replace: true });
  }

  const activeNotifications = notificationOptions.filter(
    (option) => notifications[option.key],
  ).length;
  const isDefaultNotifications = notificationOptions.every(
    (option) => notifications[option.key] === defaultNotifications[option.key],
  );

  const initials = nome.trim().charAt(0).toUpperCase();
  const navItems = [
    { label: "Meu perfil", id: "perfil", icon: UserRound },
    { label: "Aparência", id: "aparencia", icon: Palette },
    { label: "Notificações", id: "notificacoes", icon: Bell },
  ];
  const sectionParam = location.hash.replace("#", "");
  const activeSection = navItems.some((item) => item.id === sectionParam)
    ? sectionParam
    : "perfil";

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
          <span className="font-semibold text-slate-700">Minha conta</span>
        </div>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-600">
              Minha conta
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Minha conta
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Perfil, aparência e notificações em um só lugar.
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
                Minha conta
              </p>
              <nav className="space-y-1">
                {navItems.map(({ label, id, icon: Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openSection(id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${isActive ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </button>
                  );
                })}
              </nav>
              <div className="mt-5 rounded-2xl bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-orange-600">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-black">Sua conta Menuu</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  Mantenha seus dados atualizados para agilizar seus próximos
                  pedidos.
                </p>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 dark:border dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
                >
                  <LogOut className="h-4 w-4" />
                  Sair do sistema
                </button>
              </div>
            </section>
          </aside>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 space-y-5"
          >
            {activeSection === "perfil" && (
              <>
                <section
                  id="perfil"
              className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-white via-white to-orange-50 p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-600 text-2xl font-black text-white shadow-lg shadow-orange-200">
                    {initials || <UserRound className="h-8 w-8" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-2xl font-black">
                        {nome || "Seu nome"}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${user?.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {user?.ativo ? "Conta ativa" : "Conta"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {email || "seu@email.com"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<Package className="h-5 w-5" />}
                value={pedidoCount === null ? "—" : pedidoCount.toString()}
                label="Pedidos realizados"
              />
              <StatCard
                icon={<ShieldCheck className="h-5 w-5" />}
                value={user?.ativo ? "Ativa" : "—"}
                label="Situação da conta"
              />
            </div>

            <section id="editar-conta" className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">Informações pessoais</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Dados associados à sua conta Menuu.
                  </p>
                </div>
                <span
                  className={`ml-auto inline-flex w-36 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${isEditing ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {isEditing ? (
                    <Pencil className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {isEditing ? "Edição habilitada" : "Somente leitura"}
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                {error && (
                  <p
                    role="alert"
                    className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}
                {isSaved && (
                  <p
                    role="status"
                    className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                  >
                    Perfil atualizado com sucesso.
                  </p>
                )}
                <div className="grid">
                  <div
                    aria-hidden={!isEditing}
                    className={`col-start-1 row-start-1 ${isEditing ? "" : "invisible"}`}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        id="profile-name"
                        label="Nome completo"
                        icon={<UserRound className="h-4 w-4" />}
                        value={nome}
                        onChange={setNome}
                        disabled={!isEditing || isSaving}
                      />
                      <FormField
                        id="profile-email"
                        label="E-mail"
                        icon={<Mail className="h-4 w-4" />}
                        value={email}
                        onChange={setEmail}
                        disabled={!isEditing || isSaving}
                        type="email"
                      />
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={!isEditing || isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-60"
                      >
                        <X className="h-4 w-4" />
                        Descartar
                      </button>
                      <button
                        type="submit"
                        disabled={!isEditing || isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSaving ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </div>
                  </div>
                  <div
                    aria-hidden={isEditing}
                    className={`col-start-1 row-start-1 ${isEditing ? "invisible" : ""}`}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoBox
                        label="Nome completo"
                        value={nome || "Não informado"}
                      />
                      <InfoBox
                        label="E-mail"
                        value={email || "Não informado"}
                      />
                    </div>
                    <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                      <button
                        type="button"
                        onClick={handleStartEditing}
                        disabled={isEditing}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar informações
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </section>
              </>
            )}

            {activeSection === "aparencia" && (
            <section id="aparencia" className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">Aparência</h2>
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
            </section>
            )}

            {activeSection === "notificacoes" && (
            <section id="notificacoes" className={cardClass}>
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">Notificações</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Escolha quais avisos fazem sentido para você.
                  </p>
                </div>
                <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-500 sm:inline-flex">
                  {activeNotifications} de {notificationOptions.length} ativas
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
                    onChange={(value) => setNotification(option.key, value)}
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
            </section>
            )}
          </motion.div>
        </div>
      </main>

      <SiteFooter rota={ROTAS.cardapio} />
    </div>
  );
}
