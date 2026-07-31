import type { ReactNode } from "react";

type Props = {
  text: string;
  className?: string;
};

/**
 * Renders the light markup produced by the admin description editor:
 * **negrito**, _itálico_ and [texto](url).
 */
export function RichText({ text, className }: Props) {
  return <p className={className}>{renderInline(text)}</p>;
}

function renderInline(text: string): ReactNode[] {
  const pattern =
    /(\*\*[^*]+\*\*)|(_[^_]+_)|(\[[^\]]+\]\((https?:\/\/[^\s)]+)\))/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      nodes.push(<strong key={key++}>{match[1].slice(2, -2)}</strong>);
    } else if (match[2]) {
      nodes.push(<em key={key++}>{match[2].slice(1, -1)}</em>);
    } else if (match[3]) {
      const label = match[3].slice(1, match[3].indexOf("]"));
      nodes.push(
        <a
          key={key++}
          href={match[4]}
          target="_blank"
          rel="noreferrer noopener"
          className="text-primary underline underline-offset-4"
        >
          {label}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
