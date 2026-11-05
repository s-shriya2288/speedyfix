import { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { Badge, Button, Card, CardHeader, DemoNotice, InlineAlert, useToast } from '../../ui';
import { HANDOVER_COPY, pendingHandover } from '../../domain/status';
import { services, demoTools } from '../../services';
import { fmtDateTime } from '../../lib/format';
import { notifyChanged } from '../../lib/events';
import { DriverBlock } from '../booking/parts';

function Summary({ booking }) {
  const rows = ['pickup', 'delivery'].map((t) => ({ t, h: booking.handovers?.[t] }));
  return (
    <Card>
      <CardHeader title="Verified handovers" />
      <ul className="divide-y divide-white/10">
        {rows.map(({ t, h }) => (
          <li key={t} className="flex items-center gap-3 px-5 py-3.5">
            {h?.status === 'verified' ? <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden="true" /> : <KeyRound className="h-5 w-5 text-slate-400" aria-hidden="true" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white">{HANDOVER_COPY[t].short}</p>
              <p className="text-xs text-slate-400">{h?.status === 'verified' ? `Verified ${fmtDateTime(h.verifiedAt)}` : booking.status === 'cancelled' ? 'Not needed' : 'Not needed yet. Your code appears here when the driver is on the way.'}</p>
            </div>
            {h?.status === 'verified' && <Badge tone="green">Verified</Badge>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function HandoverPanel({ booking, onChanged }) {
  const type = pendingHandover(booking);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => { setError(''); }, [booking.id, type]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  if (!type) return booking.status === 'cancelled' ? null : <Summary booking={booking} />;

  const h = booking.handovers[type];
  const driver = type === 'delivery' ? booking.deliveryDriver : booking.driver;
  const blocked = h.status === 'locked' || h.status === 'expired' || h.status === 'waiting';
  const wait = h.canResendAt ? Math.max(0, Math.ceil((new Date(h.canResendAt).getTime() - now) / 1000)) : 0;
  const minsLeft = h.expiresAt ? Math.max(0, Math.ceil((new Date(h.expiresAt).getTime() - now) / 60000)) : null;

  const resend = async () => {
    setBusy(true); setError('');
    try { const updated = await services.handover.resend(booking.id, type); notifyChanged(); onChanged?.(updated); toast.push({ title: 'New code issued' }); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <Card className="border-amber-400/30 shadow-[0_0_0_1px_rgba(251,191,36,.12),0_20px_60px_-30px_rgba(251,191,36,.35)]">
      <div className="flex items-start gap-3 border-b border-white/10 px-5 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <Badge tone="amber">Action needed</Badge>
          <h2 className="mt-1.5 font-display text-lg leading-snug text-white">{HANDOVER_COPY[type].title}</h2>
        </div>
      </div>
      <div className="space-y-5 px-5 py-5">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-slate-400">Booking</dt><dd className="text-white">{booking.reference}</dd></div>
          <div><dt className="text-xs text-slate-400">Vehicle</dt><dd className="text-white">{booking.vehicle.make} {booking.vehicle.model} &middot; {booking.vehicle.registration}</dd></div>
        </dl>
        <DriverBlock driver={driver} title={type === 'delivery' ? 'Delivery driver' : 'Pickup driver'} />

        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-5 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Your handover code</p>
          {h.code && !blocked
            ? <p className="mt-2 font-display text-4xl tracking-[.35em] text-white tabular-nums" data-testid="handover-code" aria-label={`Handover code ${h.code.split('').join(' ')}`}>{h.code}</p>
            : <p className="mt-2 text-sm text-rose-300">{h.status === 'locked' ? 'Locked after too many wrong attempts.' : h.status === 'expired' ? 'This code has expired.' : 'No code issued yet.'}</p>}
          {h.code && !blocked && minsLeft != null && <p className="mt-2 text-xs text-slate-400">Valid for about {minsLeft} more {minsLeft === 1 ? 'minute' : 'minutes'}. {h.attemptsLeft} attempts left.</p>}
        </div>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-300">
          <li>Read the code out only when the driver is with you and your vehicle is in front of you.</li>
          <li>The driver enters it in their app. This page updates once the handover is confirmed.</li>
          <li>Never share the code over the phone or with anyone who is not at the handover.</li>
        </ol>

        {error && <InlineAlert>{error}</InlineAlert>}
        <div className="flex flex-wrap gap-2">
          {(blocked || wait === 0) && <Button variant="secondary" onClick={resend} loading={busy} disabled={!blocked && wait > 0}>{blocked ? 'Get a new code' : 'Send a new code'}</Button>}
          {!blocked && wait > 0 && <span className="self-center text-xs text-slate-400">New code available in {wait}s</span>}
        </div>

        {demoTools && <DemoNotice>Demo only: no SMS is sent. In production this code also arrives by SMS. Use "Simulate the next update" on the tracking page to act as the driver entering it.</DemoNotice>}
      </div>
    </Card>
  );
}
