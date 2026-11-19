import { useRef, useState } from 'react';
import { Camera, X as XIcon } from 'lucide-react';
import { Badge } from '../../portal/ui';
import { MAX_PHOTOS, compressPhoto } from '../lib/photos';

/** Up to MAX_PHOTOS vehicle photos, downscaled in the browser. Used at every handover (driver and service center). */
export default function PhotoPicker({ photos, onChange, hint }) {
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const add = async (e) => {
    const files = [...e.target.files].slice(0, MAX_PHOTOS - photos.length);
    e.target.value = '';
    setError('');
    try { const shots = await Promise.all(files.map(compressPhoto)); onChange([...photos, ...shots].slice(0, MAX_PHOTOS)); }
    catch (err) { setError(err.message); }
  };
  return (
    <fieldset>
      <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-white">Photos <Badge>Optional</Badge></legend>
      <p className="mb-3 text-xs text-slate-400">Up to {MAX_PHOTOS}. {hint}</p>
      <div className="flex flex-wrap gap-2">
        {photos.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} alt={`Vehicle photo ${i + 1}`} className="h-20 w-20 rounded-lg border border-white/10 object-cover" />
            <button type="button" onClick={() => onChange(photos.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white"><XIcon className="h-3.5 w-3.5" aria-hidden="true" /></button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button type="button" onClick={() => fileRef.current?.click()} className="grid h-20 w-20 place-items-center rounded-lg border border-dashed border-white/20 text-slate-300 hover:bg-white/5">
            <span className="flex flex-col items-center gap-1 text-xs"><Camera className="h-5 w-5" aria-hidden="true" />Add photo</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={add} aria-label="Add vehicle photos" />
      {error && <p role="alert" className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </fieldset>
  );
}
