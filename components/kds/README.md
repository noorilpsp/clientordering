# Kitchen Display System (KDS)

A digital version of the classic diner ticket spinner for restaurant order management.

## Features

### Core Components
- **HeaderBar**: Connection status, restaurant name, staff info
- **StatsBar**: Live metrics (active orders, avg wait time, completed today, streak)
- **FilterTabs**: Filter orders by type (All, Dine-in, Pickup, Priority)
- **TicketCarousel**: 3D carousel with physics-based swipe interactions
- **TicketCard**: Paper-style ticket with urgency indicators
- **TicketDetailView**: Full order view with item checkoff
- **CompletionToast**: Toast notification with undo functionality

## Interactions

### Carousel
- **Swipe Left/Right**: Spin carousel (physics-based momentum)
- **Tap Center Ticket**: Open full detail view
- **Swipe Up on Center Ticket**: Mark order as ready
- **Long Press**: Claim/unclaim order

### Ticket Detail View
- **Tap Item**: Toggle item ready status
- **Mark All Ready Button**: Complete entire order
- **Back Button**: Return to carousel

## Animations

- **Carousel Spin**: Spring physics with bounce easing
- **Ticket Completion**: Fly up animation with checkmark
- **Urgency Pulse**: Red glow for orders over 10 minutes
- **New Order**: Drop-in animation (ready for implementation)
- **Item Checkoff**: Smooth checkbox toggle

## Sound Effects (To Be Implemented)

The following sound effects should be added:

1. **New Dine-in Order**: Soft pleasant chime (`/sounds/dine-in-chime.mp3`)
   - Play when new dine-in order arrives
   - Location: `app/kds/page.tsx` - when new order is added

2. **New Pickup Order**: Double ding (`/sounds/pickup-ding.mp3`)
   - Play when new pickup order arrives
   - Location: `app/kds/page.tsx` - when new order is added

3. **New Priority Order**: Urgent attention tone (`/sounds/priority-alert.mp3`)
   - Play when priority order arrives
   - Location: `app/kds/page.tsx` - when new priority order is added

4. **Order Complete**: Satisfying whoosh/success sound (`/sounds/complete-whoosh.mp3`)
   - Play when order is marked ready
   - Location: `app/kds/page.tsx` - in `markOrderReady` function

5. **Streak Milestone**: Celebration sound (`/sounds/streak-celebration.mp3`)
   - Play every 10 streak milestones
   - Location: `app/kds/page.tsx` - in `markOrderReady` when streak % 10 === 0

### Implementation Example

```typescript
// In app/kds/page.tsx
const playSound = (soundFile: string) => {
  const audio = new Audio(soundFile);
  audio.volume = 0.5; // Adjust as needed
  audio.play().catch(() => {
    // Handle autoplay restrictions
  });
};

// When new order arrives
playSound('/sounds/dine-in-chime.mp3');

// When order completes
playSound('/sounds/complete-whoosh.mp3');
```

## Urgency Levels

- **Normal (0-5 min)**: White background, normal styling
- **Warning (5-10 min)**: Yellow glow, yellow timer
- **Urgent (10+ min)**: Red glow with pulse animation, red timer

## State Management

- Orders array with real-time timer updates
- Filter state (all, dine-in, pickup, priority)
- Focused carousel index
- Selected order for detail view
- Toast state with undo support
- Completion animation state

## Future Enhancements

- Table grouping for multiple orders from same table
- New order arrival animation with sound
- Screen flash for priority orders
- Auto-drift urgent tickets to center
- Dark mode toggle for kitchen environments
- Connection status with WebSocket integration
