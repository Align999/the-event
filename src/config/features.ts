export const FEATURES = {
    testing: process.env.NEXT_PUBLIC_TESTING_ENABLED === 'true',
    events: {
      creation: true,
      guestList: true,
      rsvp: true,
      notifications: false // not implemented yet
    }
  };