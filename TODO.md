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
