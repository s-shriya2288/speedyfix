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

## Done on `feature/customer-portal-improvements` (not merged to main yet)
- [x] Handover code shown to the customer; the driver enters it.
- [x] Demo pickup dates follow the booking date.
- [x] Charges (labour, parts, total) and vehicle condition reports on a booking.
- [x] Change pickup time before the driver sets off.
- [x] Rate the service and driver after delivery.
