import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { festaAtivo, reveillonAtivo } from "../lib/natal";

/** Fio de luzes (Natal) ou de estrelas (Réveillon) que se repete na horizontal (SVG embutido). */
export function guirlanda() {
  const bulbo = (x: number, cor: string) =>
    `<rect x="${x - 2.5}" y="17" width="5" height="4" rx="1" fill="#8a6a1f"/><ellipse cx="${x}" cy="27" rx="5.5" ry="7.5" fill="${cor}"/><ellipse cx="${x - 1.6}" cy="24.5" rx="1.5" ry="2.4" fill="#fff" opacity=".55"/>`;
  const estrela = (x: number, cor: string) =>
    `<polygon transform="translate(${x} 29) scale(1)" points="0,-10 3,-3.2 10,-3 4.6,1.6 6.4,8.6 0,4.6 -6.4,8.6 -4.6,1.6 -10,-3 -3,-3.2" fill="${cor}" stroke="#b98a2e" stroke-width="1"/>`;
  const itens = reveillonAtivo()
    ? estrela(60, "#f5c453") + estrela(180, "#fff7dc") + estrela(300, "#e3b24a")
    : bulbo(60, "#f5c453") + bulbo(180, "#d6453d") + bulbo(300, "#f7efd8");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="44" viewBox="0 0 360 44">` +
    `<path d="M0 4 Q60 40 120 4 Q180 40 240 4 Q300 40 360 4" fill="none" stroke="#d9a93f" stroke-width="2"/>` +
    itens + `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function Neve() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    let w = 0, h = 0, raf = 0;
    const flocos = Array.from({ length: 26 }, () => ({
      x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.4,
      v: 0.25 + Math.random() * 0.6, f: Math.random() * 6,
    }));
    const medir = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    medir();
    addEventListener("resize", medir);
    const desenhar = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flocos) {
        f.y += (f.v / h) * 1.2 * 60 / 60;
        f.f += 0.012;
        if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(f.x * w + Math.sin(f.f) * 14, f.y * h, f.r, 0, 6.3);
        ctx.fillStyle = "rgba(214,165,60,0.55)";
        ctx.fill();
      }
      raf = requestAnimationFrame(desenhar);
    };
    desenhar();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", medir); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}

/**
 * Enfeites de Natal das páginas internas (não aparece na página inicial, que tem a arte própria,
 * nem no painel da Carleane). Controlado por src/lib/natal.ts.
 */
export function NatalDecor() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const painel = /^\/(admin|agendamentos|clientes)(\/|$)/.test(pathname);
  if (!festaAtivo() || pathname === "/" || painel) return null;
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="natal-pisca absolute inset-x-0 top-0 h-11 bg-repeat-x" style={{ backgroundImage: guirlanda(), backgroundSize: "360px 44px" }} />
      </div>
      <Neve />
    </>
  );
}
