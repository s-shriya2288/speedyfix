import { CheckCircle2, Circle } from 'lucide-react';
import { Badge, Card, CardHeader } from '../../portal/ui';
import { fmtDateTime } from '../../portal/lib/format';

const L = { good: 'Good', minor: 'Minor marks', damage: 'Damaged', none: 'None seen', present: 'Present' };

/** What was recorded about the vehicle at a handover: the driver's check, or your team's receiving checklist. */
export function ConditionRecord({ r, label = 'Vehicle condition' }) {
  if (!r) return null;
  const facts = [['Exterior', L[r.exterior]], ['Scratches or dents', L[r.scratches]], ['Visible damage', r.visibleDamage && L[r.visibleDamage]], ['Fuel', r.fuel], ['Items', r.accessories], ['Notes', r.notes]].filter(([, v]) => v);
  return (
    <div className="mt-2 rounded-lg bg-white/[.03] px-3 py-2.5">
      <p className="text-xs font-semibold text-slate-300">{label}</p>
      <dl className="mt-1 grid gap-x-5 gap-y-1 text-xs sm:grid-cols-2">{facts.map(([k, v]) => <div key={k}><dt className="inline text-slate-400">{k}: </dt><dd className="inline text-slate-100">{v}</dd></div>)}</dl>
      {r.photos?.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{r.photos.map((src, i) => <a key={i} href={src} target="_blank" rel="noreferrer"><img src={src} alt={`${label}: photo ${i + 1}`} className="h-16 w-16 rounded-md border border-white/10 object-cover" /></a>)}</div>}
    </div>
  );
}

/** The four handovers of a round trip: customer to driver, driver to center, center to driver, driver to customer. */
export default function HandoverRecords({ steps }) {
  return (
    <Card><CardHeader title="Handover records" />
      <ol className="divide-y divide-white/10">
        {steps.map((s) => (
          <li key={s.key} className="flex gap-3 px-5 py-4 text-sm">
            {s.at ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-white">{s.title} <span className="text-xs text-slate-400">· {s.parties}</span></span>
                {s.at ? <Badge tone="green">{fmtDateTime(s.at)}</Badge> : <Badge>Not yet</Badge>}
              </div>
              {(s.method && (s.at || s.key === 'center_in')) && <p className="mt-1 text-xs text-slate-400">{s.method}{s.by && s.key !== 'center_in' ? ` · ${s.by}` : ''}</p>}
              <ConditionRecord r={s.condition} label={s.key === 'center_in' ? 'Your receiving checklist' : 'Driver\'s vehicle check'} />
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-white/10 px-5 py-3 text-xs text-slate-400">Customer handovers are completed by drivers with the customer's one-time code; your team cannot verify or override them.</p>
    </Card>
  );
}
