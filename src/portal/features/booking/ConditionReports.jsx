import { Card, CardHeader } from '../../ui';
import { fmtDateTime } from '../../lib/format';

const L = { good: 'Good', minor: 'Minor marks', damage: 'Damaged', none: 'None seen', present: 'Present' };

function Report({ title, by, r }) {
  return (
    <div className="space-y-2 px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold text-white">{title}</p><p className="text-xs text-slate-400">{[by, fmtDateTime(r.at)].filter(Boolean).join(' · ')}</p></div>
      <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        <div><dt className="text-xs text-slate-400">Exterior</dt><dd className="text-white">{L[r.exterior] || 'Not recorded'}</dd></div>
        <div><dt className="text-xs text-slate-400">Scratches or dents</dt><dd className="text-white">{L[r.scratches] || 'Not recorded'}</dd></div>
        {r.visibleDamage && <div><dt className="text-xs text-slate-400">Visible damage</dt><dd className="text-white">{L[r.visibleDamage]}</dd></div>}
        <div><dt className="text-xs text-slate-400">Fuel level</dt><dd className="text-white">{r.fuel || 'Not checked'}</dd></div>
        {r.accessories && <div className="sm:col-span-2"><dt className="text-xs text-slate-400">Items noted</dt><dd className="text-white">{r.accessories}</dd></div>}
        {r.notes && <div className="sm:col-span-2"><dt className="text-xs text-slate-400">Notes</dt><dd className="text-white">{r.notes}</dd></div>}
      </dl>
    </div>
  );
}

/** What the driver and the service center recorded about the vehicle's condition at each handover. */
export default function ConditionReports({ booking: b }) {
  const reports = [
    b.pickupJob?.inspection && { key: 'pickup', title: 'At pickup', by: b.driver?.name, r: b.pickupJob.inspection },
    b.receiving && { key: 'center', title: 'Received at the service center', by: b.receiving.byName, r: b.receiving },
    b.deliveryJob?.inspection && { key: 'delivery', title: 'At delivery', by: b.deliveryDriver?.name, r: b.deliveryJob.inspection },
  ].filter(Boolean);
  if (!reports.length) return null;
  return (
    <Card>
      <CardHeader title="Vehicle condition" />
      <div className="divide-y divide-white/10">{reports.map((x) => <Report key={x.key} {...x} />)}</div>
    </Card>
  );
}
