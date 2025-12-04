# 🏡 Holidaze Retreats

Modern venue booking platform | Project Exam 2 (PE2)

Holidaze Retreats is a premium booking experience built with React, TypeScript, and Tailwind.  
Users can browse venues, book stays, manage listings, and edit profiles — all powered by the Noroff API.

**Live site:** <[Holidaze Retreats](https://holidaze-retreats.vercel.app/)>  
**Repository:** <[Holidaze Repo](https://github.com/Arkuradev/holidaze-retreats)>

---

## 🔥 Features

### 👥 Public Users

- Browse all venues
- Venue details with gallery + carousel
- Search by name, location, tags
- Filter by price, amenities, and more
- View host profiles

### 🧑‍💼 Registered Users

- Register/login with @stud.noroff.no
- Book venues with date validation & conflict checking
- View bookings with receipts
- Edit user profile (avatar, banner, bio)
- View their own profile page

### 🏡 Venue Managers

- Turn on “Venue Manager” when registering
- Create venues with multiple images
- Edit or delete venues
- Dashboard view of all managed venues
- See bookings on owned venues

### 🎨 UI & UX

- Premium styling using Tailwind
- Skeleton loaders for all major pages
- Toast notifications
- Smooth scroll restoration
- Mobile-first responsive layout
- Accessible and WCAG-compliant components

---

## 🧱 Tech Stack

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide Icons
- React Datepicker

### Tools

- Vite
- ESLint + Prettier

### Deployment

- Vercel (recommended)

---

## 🚀 Installation & Setup

### Clone repo

```bash
git clone https://github.com/Arkuradev/holidaze-retreats.git
cd holidaze-retreats
npm install
```

### Start dev server

```bash
npm run dev
```

### Check build for production

```bash
npm run build
```

## 📁 Project Structure

```css
src/
  components/
    layout/
    venues/
    skeletons/
    forms/
    ui/
  pages/
  context/
  hooks/
  lib/
  types/
  assets/
  index.css
  main.tsx
```

## 🌐 API – Noroff V2

Base URL:

```arduino
https://v2.api.noroff.dev
```

Used endpoints:

- `/auth/register`
- `/auth/login`
- `/holidaze/venues`
- `/holidaze/venues/id`
- `/holidaze/bookings/id`
- `/holidaze/profiles/name`

Protected routes require:

- `Authorization: Bearer <token>`
- `X-Noroff-API-Key: <key>`
