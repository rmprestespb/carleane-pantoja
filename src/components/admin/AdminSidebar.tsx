import { Link } from "@tanstack/react-router";
import {
  Home,
  SlidersHorizontal,
  CalendarDays,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

type Props = {
  onSignOut: () => void;
};

const items = [
  { label: "Início", icon: Home, to: "/" as const },
  { label: "Gerenciar serviços", icon: SlidersHorizontal, to: "/admin" as const },
  { label: "Agendamentos", icon: CalendarDays, to: "/agendamentos" as const },
  { label: "Clientes", icon: Users, to: "/clientes" as const },
  { label: "Configurações", icon: Settings, soon: true },
];


export function AdminSidebar({ onSignOut }: Props) {
  const base =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors";

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-[oklch(0.28_0.03_40)] p-5 text-[oklch(0.93_0.02_80)] lg:flex">
      <p className="px-1 font-serif text-lg leading-tight">Carleane Pantoja</p>
      <p className="px-1 text-[0.65rem] uppercase tracking-[0.2em] text-[oklch(0.8_0.05_20)]">
        Massoterapeuta
      </p>

      <nav className="mt-8 flex flex-col gap-1">
        {items.map((item) =>
          item.to ? (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: true }}
              className={`${base} text-white/75 hover:bg-white/10`}
              activeProps={{
                className: `${base} bg-primary/25 font-medium text-[oklch(0.88_0.07_20)]`,
              }}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" /> {item.label}
            </Link>
          ) : (
            <span key={item.label} className={`${base} text-white/50`}>
              <item.icon className="h-4 w-4" aria-hidden="true" /> {item.label}
              {item.soon && (
                <span className="ml-auto text-[0.6rem] uppercase tracking-wider text-white/35">
                  breve
                </span>
              )}
            </span>
          ),
        )}

      </nav>

      <button
        onClick={onSignOut}
        className={`${base} mt-auto text-white/70 hover:bg-white/10`}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
      </button>
    </aside>
  );
}
