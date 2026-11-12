import { useRef, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

const MAX_SIDE = 1800;

/** Medidas reales de una imagen (0, 0 si no carga). Sirve para saber si es horizontal o vertical. */
export function measureImage(url: string): Promise<[number, number]> {
  return new Promise(resolve => {
    if (!url) return resolve([0, 0]);
    const image = new Image();
    image.onload = () => resolve([image.naturalWidth, image.naturalHeight]);
    image.onerror = () => resolve([0, 0]);
    image.src = url;
  });
}

/** Reduce la foto en el navegador (lado mayor 1800 px, JPG) para que suba rápido y pese poco. */
async function shrink(file: File): Promise<{ data: string; width: number; height: number }> {
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Ese archivo no es una imagen que el navegador pueda abrir'));
      image.src = source;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.round(image.naturalWidth * scale);
    const height = Math.round(image.naturalHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
    return { data: dataUrl.slice(dataUrl.indexOf(',') + 1), width, height };
  } finally {
    URL.revokeObjectURL(source);
  }
}

/** Campo de imagen: se puede pegar una dirección o subir la foto desde el computador. */
export function ImageField({ name, defaultValue = '', label = 'Imagen' }: { name: string; defaultValue?: string; label?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  async function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setStatus('Subiendo foto…');
    try {
      const result = await adminApi<{ url: string }>('upload', await shrink(file));
      setUrl(result.url);
      setStatus('Foto subida. Falta guardar el formulario.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo subir la foto.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-field">
      <label>
        {label}
        <input name={name} value={url} onChange={event => setUrl(event.target.value)} placeholder="Dirección de la imagen, o súbela con el botón" />
      </label>
      <div className="row">
        <button type="button" className="btn ghost" disabled={busy} onClick={() => picker.current?.click()}>
          {busy ? 'Subiendo…' : 'Subir foto desde el computador'}
        </button>
        {url ? <button type="button" className="btn ghost" onClick={() => { setUrl(''); setStatus(''); }}>Quitar imagen</button> : null}
        <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPick} />
      </div>
      {status ? <p className="hint">{status}</p> : null}
      {url ? <img className="image-preview" src={url} alt="Vista previa" /> : null}
    </div>
  );
}
