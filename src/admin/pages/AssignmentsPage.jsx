import { useState } from 'react';
import { Truck } from 'lucide-react';
import { adminServices } from '../services';
import { usePolling } from '../../portal/hooks/useAsync';
import { Badge, Button, Card, EmptyState, ErrorState, Skeleton, useToast } from '../../portal/ui';
import { notifyChanged } from '../../portal/lib/events';
import { fmtDate, fmtDateTime } from '../../portal/lib/format';
import { Chips, FlagBadges, usePagedList } from '../features/common';
import { useAdmin } from '../layout/AdminContext';
import AssignModal from '../features/AssignModal';
import { Link } from 'react-router-dom';

const VIEWS = [{ key: 'unassigned', label: 'Unassigned' }, { key: 'assigned', label: 'Assigned' }, { key: 'declined', label: 'Declined by drivers' }];

export default function AssignmentsPage() {
  const { can } = useAdmin();
  const [view, setView] = useState('unassigned');
  const [job, setJob] = useState(null);
  const [sending, setSending] = useState('');
  const toast = useToast();
  const offerAll = async (j) => {
    setSending(j.jobId);
    try { const { sent } = await adminServices.dispatch.offerAll(j.jobId); notifyChanged(); toast.push({ title: `Offered to ${sent} online driver${sent === 1 ? '' : 's'}`, message: j.booking.reference }); }
    catch (e) { toast.push({ tone: 'rose', title: 'Not sent', message: e.message }); }
    finally { setSending(''); l.reload(true); }
  };
  const l = usePagedList(async () => { const items = await adminServices.dispatch.list({ view }); return { items, total: items.length, nextCursor: null }; }, [view]);
  usePolling(() => l.reload(true), 12000);
  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-slate-400">Pickup and delivery jobs that need a driver, and jobs that can be reassigned. Eligibility is checked by the server. No distances or driver locations are shown because no mapping integration is connected.</p>
      <Chips options={VIEWS} value={view} onChange={setView} label="Assignment view" />
      {l.error && <ErrorState error={l.error} onRetry={() => l.reload()} title="Could not load jobs" />}
      {l.loading && <Skeleton className="h-40" />}
      {!l.loading && !l.error && !l.items.length && <EmptyState icon={Truck} title={view === 'unassigned' ? 'Every job has a driver' : view === 'declined' ? 'No declined jobs' : 'No assigned jobs'}>{view === 'unassigned' ? 'New pickups and delivery requests appear here until a driver is assigned.' : 'Nothing to show.'}</EmptyState>}
      {l.items.length > 0 && <ul className="space-y-3">{l.items.map((j) => (
        <li key={j.jobId}><Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2"><Badge tone={j.type === 'pickup' ? 'blue' : 'slate'}>{j.type === 'pickup' ? 'Pickup' : 'Delivery'}</Badge><Link to={`/admin/bookings/${j.booking.id}`} className="font-display text-white hover:text-volt-glow">{j.booking.reference}</Link><span className="text-sm text-slate-300">{j.booking.vehicle.registration}</span><FlagBadges flags={j.booking.flags} />{j.offered && <Badge tone="amber">Offered to {j.liveOffers} driver{j.liveOffers === 1 ? '' : 's'}</Badge>}<span className="ml-auto text-xs text-slate-400">{j.state === 'unassigned' ? `Waiting ${j.waitingMinutes} min` : `Updated ${fmtDateTime(j.booking.updatedAt)}`}</span></div>
          <p className="mt-3 text-sm text-slate-300">{j.pickupAddress} <span className="text-slate-400">→</span> {j.destination || 'Not set'}</p>
          <p className="mt-1 text-sm text-slate-400">{j.booking.center.name} · {fmtDate(j.booking.schedule.date)}, {j.booking.schedule.slot}</p>
          {j.assignee && <p className="mt-2 text-sm text-white">Driver: {j.assignee.name}</p>}
          {j.declines.length > 0 && <ul className="mt-2 space-y-1 text-sm text-amber-100">{j.declines.map((d, i) => <li key={i}>Declined by {d.driver}{d.reason ? `: ${d.reason}` : ''}</li>)}</ul>}
          {can('dispatch') && (j.state === 'unassigned' || j.reassignable) && <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => setJob(j)}>{j.assignee ? 'Reassign' : 'Assign a driver'}</Button>{j.state === 'unassigned' && <Button size="sm" variant="secondary" loading={sending === j.jobId} onClick={() => offerAll(j)}>Offer to all online drivers</Button>}</div>}
        </Card></li>))}</ul>}
      <AssignModal key={job?.jobId} job={job} open={Boolean(job)} onClose={() => setJob(null)} onDone={() => l.reload(true)} />
    </div>
  );
}
