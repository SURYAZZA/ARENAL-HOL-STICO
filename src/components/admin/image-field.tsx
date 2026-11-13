import { useEffect, useRef, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { CropEditor } from '@/components/admin/crop-editor';
import { COVER_RATIO } from '@/lib/content';

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

/** Marco al que hay que recortar una foto con esas medidas, o null si cabe completa en el blog. */
function cropRatioFor(width: number, height: number): number | null {
  if (!width || !height) return null;
  const ratio = width / height;
  if (ratio > COVER_RATIO.max * 1.01) return COVER_RATIO.max;
  if (ratio < COVER_RATIO.min * 0.99) return COVER_RATIO.min;
  return null;
}

/**
 * Campo de imagen: se puede pegar una dirección o subir la foto desde el computador.
 * Con `fitBlog`, si la foto no cabe en su espacio del blog se abre el editor de recorte.
 */
export function ImageField({ name, defaultValue = '', label = 'Imagen', fitBlog = false }: {
  name: string; defaultValue?: string; label?: string; fitBlog?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [crop, setCrop] = useState<{ source: string; ratio: number; local: boolean } | null>(null);
  const [needsCrop, setNeedsCrop] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  /** Revisa una foto ya puesta en el campo (al abrir una publicación o al pegar una dirección). */
  async function check(target: string, open: boolean) {
    if (!fitBlog || !target) return setNeedsCrop(false);
    const [width, height] = await measureImage(target);
    const ratio = cropRatioFor(width, height);
    setNeedsCrop(ratio !== null);
    if (ratio !== null && open) setCrop({ source: target, ratio, local: false });
  }

  useEffect(() => {
    void check(defaultValue, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload(payload: { data: string; width: number; height: number }, done: string) {
    setBusy(true);
    setStatus('Subiendo foto…');
    try {
      const result = await adminApi<{ url: string }>('upload', payload);
      setUrl(result.url);
      setNeedsCrop(false);
      setStatus(done);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo subir la foto.');
    } finally {
      setBusy(false);
    }
  }

  async function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (fitBlog) {
      const source = URL.createObjectURL(file);
      const [width, height] = await measureImage(source);
      const ratio = cropRatioFor(width, height);
      if (ratio !== null) return setCrop({ source, ratio, local: true });
      URL.revokeObjectURL(source);
    }
    try {
      await upload(await shrink(file), 'Foto subida. Falta guardar el formulario.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo subir la foto.');
    }
  }

  function closeCrop() {
    if (crop?.local) URL.revokeObjectURL(crop.source);
    setCrop(null);
  }

  return (
    <div className="image-field">
      <label>
        {label}
        <input
          name={name}
          value={url}
          onChange={event => setUrl(event.target.value)}
          onBlur={event => void check(event.target.value.trim(), true)}
          placeholder="Dirección de la imagen, o súbela con el botón"
        />
      </label>
      <div className="row">
        <button type="button" className="btn ghost" disabled={busy} onClick={() => picker.current?.click()}>
          {busy ? 'Subiendo…' : 'Subir foto desde el computador'}
        </button>
        {needsCrop && url ? <button type="button" className="btn ghost" onClick={() => void check(url, true)}>Recortar foto</button> : null}
        {url ? <button type="button" className="btn ghost" onClick={() => { setUrl(''); setStatus(''); setNeedsCrop(false); }}>Quitar imagen</button> : null}
        <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPick} />
      </div>
      {status ? <p className="hint">{status}</p> : null}
      {needsCrop && url ? <p className="hint">Esta foto no cabe completa en el blog. Si no la recortas, se mostrará recortada al centro.</p> : null}
      {url ? <img className="image-preview" src={url} alt="Vista previa" /> : null}
      {crop ? (
        <CropEditor
          source={crop.source}
          ratio={crop.ratio}
          onCancel={() => {
            const wasLocal = crop.local;
            closeCrop();
            if (wasLocal) setStatus('No se subió la foto: el recorte se canceló.');
          }}
          onDone={result => {
            closeCrop();
            void upload(result, 'Foto recortada y subida. Falta guardar el formulario.');
          }}
        />
      ) : null}
    </div>
  );
}
