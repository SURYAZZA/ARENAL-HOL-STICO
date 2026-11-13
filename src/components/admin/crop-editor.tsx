import { useEffect, useRef, useState } from 'react';

const FRAME_WIDTH = 480;
const OUTPUT_SIDE = 1800;

export type CropResult = { data: string; width: number; height: number };

/**
 * Editor de recorte: la foto se arrastra dentro de un marco con la forma que tendrá en el blog.
 * Lo que queda dentro del marco es lo que se publica. El control de zoom acerca la foto.
 */
export function CropEditor({ source, ratio, onDone, onCancel }: {
  /** Dirección de la imagen a recortar (archivo local o foto ya subida). */
  source: string;
  /** Forma del marco, ancho / alto. */
  ratio: number;
  onDone: (result: CropResult) => void;
  onCancel: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [natural, setNatural] = useState<[number, number] | null>(null);
  const [frameWidth, setFrameWidth] = useState(FRAME_WIDTH);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ left: 0, top: 0 });
  const [error, setError] = useState('');

  const frameHeight = frameWidth / ratio;
  // Con zoom 1 la foto cubre el marco justo; nunca queda un hueco.
  const base = natural ? Math.max(frameWidth / natural[0], frameHeight / natural[1]) : 1;
  const scale = base * zoom;
  const shown = natural ? [natural[0] * scale, natural[1] * scale] : [0, 0];

  const clamp = (left: number, top: number) => ({
    left: Math.min(0, Math.max(frameWidth - shown[0], left)),
    top: Math.min(0, Math.max(frameHeight - shown[1], top)),
  });

  useEffect(() => {
    const fit = () => setFrameWidth(Math.min(FRAME_WIDTH, (frame.current?.parentElement?.clientWidth ?? FRAME_WIDTH)));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Al cargar, o al cambiar zoom o tamaño, la foto se centra o se mantiene dentro del marco.
  useEffect(() => {
    if (!natural) return;
    setOffset(current =>
      current.left === 0 && current.top === 0 && zoom === 1
        ? { left: (frameWidth - shown[0]) / 2, top: (frameHeight - shown[1]) / 2 }
        : clamp(current.left, current.top),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [natural, zoom, frameWidth]);

  function confirm() {
    if (!natural || !image.current) return;
    const sourceWidth = frameWidth / scale;
    const sourceHeight = frameHeight / scale;
    const width = Math.round(Math.min(OUTPUT_SIDE, sourceWidth));
    const height = Math.round(width / ratio);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image.current, -offset.left / scale, -offset.top / scale, sourceWidth, sourceHeight, 0, 0, width, height);
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onDone({ data: dataUrl.slice(dataUrl.indexOf(',') + 1), width, height });
    } catch {
      // Una imagen de otro sitio web no deja leer sus píxeles.
      setError('Esta imagen está en otro sitio y no se puede recortar aquí. Súbela desde el computador.');
    }
  }

  return (
    <div className="crop-backdrop" role="dialog" aria-modal="true" aria-label="Recortar foto">
      <div className="crop-dialog">
        <h3>Recortar foto</h3>
        <p className="hint">
          Esta foto es {ratio > 1 ? 'demasiado ancha' : 'demasiado alta'} para su espacio en el blog.
          Arrástrala para elegir la parte que se verá; lo que quede fuera del marco no se publica.
        </p>
        <div
          ref={frame}
          className="crop-frame"
          style={{ width: frameWidth, height: frameHeight }}
          onPointerDown={event => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { x: event.clientX, y: event.clientY, ...offset };
          }}
          onPointerMove={event => {
            if (!drag.current) return;
            setOffset(clamp(drag.current.left + event.clientX - drag.current.x, drag.current.top + event.clientY - drag.current.y));
          }}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
        >
          <img
            ref={image}
            src={source}
            crossOrigin={source.startsWith('http') ? 'anonymous' : undefined}
            alt=""
            draggable={false}
            style={{ width: shown[0] || undefined, height: shown[1] || undefined, transform: `translate(${offset.left}px, ${offset.top}px)` }}
            onLoad={event => setNatural([event.currentTarget.naturalWidth, event.currentTarget.naturalHeight])}
            onError={() => setError('No se pudo abrir la imagen para recortarla. Súbela desde el computador.')}
          />
        </div>
        <label className="crop-zoom">
          Zoom
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={event => setZoom(Number(event.target.value))} />
        </label>
        {error ? <p className="status" role="alert">{error}</p> : null}
        <div className="row">
          <button type="button" className="btn" disabled={!natural} onClick={confirm}>Usar este recorte</button>
          <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
