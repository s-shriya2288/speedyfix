# Speedy Fix to-do list

Items parked for later review. Tick them off as they are done.

## Customer portal
- [ ] **Support contact details.** Help & Support says contact details are not set up. Decide which contact to show
      (name, phone, WhatsApp, email) and fill them in `src/landing/config.js`. The landing page's "Become a Partner"
      button uses the same contact.
- [ ] **Map picker for the pickup location.** The partner briefing promises marking the location on a map. Needs a maps
      provider account (e.g. Google Maps API key); hook it in `src/portal/integrations/maps.js` and `PickupStep.jsx`.
- [ ] **Real sign-in, SMS and backend.** All four portals run on demo data stored in the browser. Needs an auth
      provider, a database, and SMS delivery for handover codes. Each portal's `services/remoteAdapter.js` lists the
      methods to implement.

## Driver portal
- [ ] **Live GPS tracking** of the driver for the customer and operations. Needs location permission and a backend to relay it.
- [ ] **Driver earnings and trip pay.** Needs the per-trip rate (the briefing leaves it blank: `₹__ per trip`).
- [ ] **Photo storage.** Handover photos are kept in the browser in demo mode; a backend should upload them to storage.

## Service center portal
- [ ] **OTP at the center handovers.** The briefing says 4 codes per round trip. Today the two center handovers are confirmed by
      staff (receiving checklist, and the delivery driver setting off). Decide whether the center should also get a code by SMS.
- [ ] **Staff confirm handing the car to the delivery driver.** Currently recorded when the driver sets off.
- [ ] **Works offline** (save work-order updates on the phone, sync later) and **PIN lock**. Both need the real app build.
- [ ] **A login for each staff member.** Roles exist (manager, advisor, technician); creating logins needs the real backend.
- [ ] **Automatic re-offer when nobody accepts.** Operations can now press "Offer to all online drivers"; doing it automatically needs a backend timer.

## Admin portal
- [ ] **Live map of drivers.** Needs GPS from the driver app and a maps provider.
- [ ] **SMS, email and push alerts for operations.** Only in-app alerts exist; needs a messaging provider.
- [ ] **Driver pay and center billing reports.** Needs the per-trip rate and the commercial terms.

## Done: customer portal (live)
- [x] Handover code shown to the customer; the driver enters it.
- [x] Demo pickup dates follow the booking date.
- [x] Charges (labour, parts, total) and vehicle condition reports on a booking.
- [x] Change pickup time before the driver sets off.
- [x] Rate the service and driver after delivery.

## Done: driver portal
- [x] New bookings and delivery requests are offered automatically to online drivers.
- [x] Offers expire after 5 minutes, with a countdown.
- [x] "Simulate a pickup offer" offers the newest booking.
- [x] The driver is told when the customer changes the pickup time.
- [x] Up to 4 vehicle photos at each handover, visible to the customer.

## Done: service center portal
- [x] Bookings the center creates are offered to online drivers, with the offer status on the booking.
- [x] All four handovers on the booking, with the driver's vehicle check and photos.
- [x] The receiving screen shows the driver's pickup check and photos; staff can add up to 4 photos.
- [x] Late pickups and deliveries are flagged on the dashboard, the bookings list and the booking.
- [x] Dashboard: today's bookings (total, pending, completed) and workshop (open, completed).
- [x] Time slots that have already passed today cannot be booked.
- [x] Staff wording in the activity timeline.

## Done: admin portal
- [x] Drivers are told when operations assigns, offers, reassigns, reschedules or cancels a job.
- [x] Drivers are also told when the customer or the service center cancels or moves a pickup; open offers are withdrawn.
- [x] "Offer to all online drivers" for jobs nobody has accepted, on Assignments and on the booking.
- [x] Booking page shows all four handovers with the vehicle checks and photos.
- [x] Staff wording in the booking timeline and the dashboard's recent activity (with the driver's name).
- [x] A pickup cannot be corrected to a past date.
