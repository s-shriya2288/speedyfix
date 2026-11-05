import { Badge } from '../../ui';
import { fmtINR } from '../../lib/format';

function Lines({ title, rows, render }) {
  if (!rows.length) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.id} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 text-slate-200">{r.description}<span className="block text-xs text-slate-400">{render(r)}</span></span>
            <span className="shrink-0 tabular-nums text-white">{fmtINR(r.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Charges from the service center's work order. An estimate while work is open, the final bill once it is completed. */
export default function Bill({ bill }) {
  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-sm text-white">Charges</h3>
        <Badge tone={bill.final ? 'green' : 'amber'}>{bill.final ? 'Final' : 'Estimate so far'}</Badge>
      </div>
      <Lines title="Labour" rows={bill.labour} render={(l) => `${l.hours} h × ${fmtINR(l.rate)}/h`} />
      <Lines title="Parts" rows={bill.parts} render={(p) => `${p.qty} × ${fmtINR(p.unitPrice)}`} />
      <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
        <span className="text-sm font-semibold text-white">Total</span>
        <span className="font-display text-lg tabular-nums text-white" data-testid="bill-total">{fmtINR(bill.total)}</span>
      </div>
      {!bill.final && <p className="text-xs text-slate-400">The service center may add parts or labour until the work is completed.</p>}
    </div>
  );
}
