import { useEffect, useState } from 'react';
import { Modal, Button, InlineAlert, SelectField, TextField, useToast } from '../../ui';
import { services } from '../../services';
import { fmtDate, todayISO } from '../../lib/format';
import { notifyChanged } from '../../lib/events';

export default function RescheduleModal({ booking, open, onClose, onDone }) {
  const toast = useToast();
  const [slots, setSlots] = useState([]);
  const [f, setF] = useState({ date: '', slot: '' });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setF({ date: booking.pickup.date >= todayISO() ? booking.pickup.date : '', slot: booking.pickup.slot || '' });
    setErr({}); setError('');
    services.bookings.serviceTypes().then((r) => setSlots(r.slots)).catch((e) => setError(e.message));
  }, [open, booking]);

  const submit = async () => {
    const next = { date: !f.date ? 'Choose a pickup date.' : f.date < todayISO() ? 'Choose today or a later date.' : '', slot: f.slot ? '' : 'Choose a time slot.' };
    if (!next.date && !next.slot && f.date === booking.pickup.date && f.slot === booking.pickup.slot) next.slot = 'Choose a different date or time slot.';
    setErr(next);
    if (Object.values(next).some(Boolean)) return;
    setBusy(true); setError('');
    try {
      const updated = await services.bookings.reschedule(booking.id, f);
      notifyChanged();
      toast.push({ title: 'Pickup rescheduled', message: `${fmtDate(f.date)}, ${f.slot}` });
      onDone?.(updated);
      onClose();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title="Change pickup time"
      footer={<><Button variant="secondary" onClick={onClose} disabled={busy}>Keep current time</Button><Button onClick={submit} loading={busy}>Save new time</Button></>}>
      <div className="space-y-4">
        <p className="text-sm text-slate-300">Currently {fmtDate(booking.pickup.date)}, {booking.pickup.slot}. You can change it until the driver sets off.{booking.driver ? ' Your driver will be told about the new time.' : ''}</p>
        {error && <InlineAlert>{error}</InlineAlert>}
        <TextField label="Pickup date" type="date" min={todayISO()} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} error={err.date} required />
        <SelectField label="Time slot" value={f.slot} onChange={(e) => setF({ ...f, slot: e.target.value })} error={err.slot} required>
          <option value="">Select a slot</option>
          {slots.map((s) => <option key={s} value={s}>{s}</option>)}
        </SelectField>
      </div>
    </Modal>
  );
}
