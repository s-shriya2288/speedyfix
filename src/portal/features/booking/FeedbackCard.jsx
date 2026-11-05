import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button, Card, CardHeader, InlineAlert, TextAreaField, cx, useToast } from '../../ui';
import { services } from '../../services';
import { fmtDateTime } from '../../lib/format';
import { notifyChanged } from '../../lib/events';

const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

function Stars({ label, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm text-slate-200">{label}</legend>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} star${n > 1 ? 's' : ''}, ${WORDS[n]}`} aria-pressed={value === n}
            className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/5 disabled:cursor-default disabled:hover:bg-transparent">
            <Star className={cx('h-6 w-6', n <= value ? 'fill-amber-300 text-amber-300' : 'text-slate-500')} aria-hidden="true" />
          </button>
        ))}
        {value > 0 && <span className="ml-2 text-sm text-slate-300">{WORDS[value]}</span>}
      </div>
    </fieldset>
  );
}

/** Shown once the vehicle is delivered: one rating per booking. */
export default function FeedbackCard({ booking: b, onChanged }) {
  const toast = useToast();
  const [f, setF] = useState({ service: 0, driver: 0, comment: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (b.status !== 'delivered') return null;
  const hasDriver = Boolean(b.deliveryDriver || b.driver);

  if (b.feedback) return (
    <Card>
      <CardHeader title="Your rating" />
      <div className="space-y-3 px-5 py-5">
        <Stars label="Service" value={b.feedback.service} />
        {b.feedback.driver && <Stars label="Driver" value={b.feedback.driver} />}
        {b.feedback.comment && <p className="text-sm text-slate-300">“{b.feedback.comment}”</p>}
        <p className="text-xs text-slate-400">Sent {fmtDateTime(b.feedback.at)}. Thank you.</p>
      </div>
    </Card>
  );

  const submit = async () => {
    if (!f.service || (hasDriver && !f.driver)) { setError(hasDriver ? 'Rate both the service and the driver.' : 'Rate the service.'); return; }
    setBusy(true); setError('');
    try {
      const updated = await services.bookings.rate(b.id, { service: f.service, driver: hasDriver ? f.driver : null, comment: f.comment });
      notifyChanged();
      toast.push({ title: 'Thanks for your feedback' });
      onChanged?.(updated);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <Card className="border-volt/30">
      <CardHeader title="How did it go?" />
      <div className="space-y-4 px-5 py-5">
        <Stars label={`Service at ${b.center.name}`} value={f.service} onChange={(n) => setF({ ...f, service: n })} />
        {hasDriver && <Stars label="Pickup and delivery driver" value={f.driver} onChange={(n) => setF({ ...f, driver: n })} />}
        <TextAreaField label="Anything to add? (optional)" value={f.comment} maxLength={500} onChange={(e) => setF({ ...f, comment: e.target.value })} />
        {error && <InlineAlert>{error}</InlineAlert>}
        <Button onClick={submit} loading={busy}>Send rating</Button>
      </div>
    </Card>
  );
}
