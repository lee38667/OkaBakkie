Product Requirements Document (PRD) – Oka’bakkie MVP
1. Overview

Product Name: Oka’bakkie
Tagline: Rescuing Food, Empowering Namibia.
Purpose: Connect vendors with surplus food to nearby customers by offering discounted “Surprise Bags,” helping reduce food waste and improve affordability.
Primary Users: Students, workers, and families seeking affordable meals.

2. Objectives

Reduce food waste by connecting customers with surplus food.

Provide affordable meals to communities.

Create a simple, intuitive platform for customers and vendors.

Launch a pilot MVP with minimal payment integration for quick deployment.

3. Scope for MVP

In-Scope:

User browsing of vendors.

Reservation of Surprise Bags.

Vendor posting of bag availability (admin-driven).

Cash-on-Collection payments.

Basic GPS location filtering.

Order management (status + cancellation).

Out-of-Scope for MVP (Future Features):

Mobile money/e-wallet integration.

User/vendor accounts with profile management.

Local language translations.

Vendor self-service portal.

Ratings and reviews.

4. App Structure & Requirements
4.1 Splash Screen

UI Elements: App logo centered on beige background, tagline underneath.

Behavior: Displays for 2–3 seconds, then transitions to Home Screen.

4.2 Home Screen

Header: “Available Surprise Bags Near You.”

Content Layout: Scrollable list/grid of vendors.

Vendor Card Elements:

Vendor logo/photo.

Available bag count.

Pickup window.

Discounted price.

Filters/Search:

Filter by location (GPS).

Filter by food type (bakery, café, restaurant).

Search bar for vendor name.

4.3 Vendor Details Page

Vendor banner photo.

Description text.

Price of Surprise Bag.

Pickup instructions.

Reserve Bag button (links to Reservation Form).

4.4 Reservation & Payment

Form Fields:

Name (required)

Phone number (required)

Email (optional)

Payment Method: Cash on Collection.

Confirmation:

In-app confirmation screen.

Automated WhatsApp message.

4.5 My Orders

List of orders with:

Vendor name.

Status: Awaiting Pickup / Completed.

Option to cancel before pickup.

4.6 Vendor Portal (Admin Version for MVP)

Admin can:

Add new vendor listing.

Post bag availability & price.

Edit pickup times.

View reservations.

5. Design Guidelines

Theme Colors: Beige (#F5F5DC) + Orange (#FFA500).

Tone: Friendly, approachable, community-focused.

UI Style: Minimal clutter, large readable buttons, big product images.

Typography: Sans-serif font (e.g., Poppins or Open Sans).

Accessibility: High contrast text, clear buttons.

6. Technical Requirements

Platform: Web application (responsive for mobile-first design).

Frontend: React.js (or Next.js for better SEO & performance).

Backend: Node.js + Express.js.

Database: MongoDB or PostgreSQL.

Hosting: Vercel (for frontend) + Render/Heroku (backend).

Admin Management: Simple CMS-like admin dashboard for posting vendor data.

API Integration: Twilio or WhatsApp Business API for confirmations.

Authentication: None for MVP; admin panel password-protected.

7. User Flow

User:

Opens app → sees Splash Screen → lands on Home Screen.

Browses/filter vendors → taps vendor card.

Reads details → clicks Reserve Bag.

Fills reservation form → submits.

Receives confirmation in-app + WhatsApp.

Picks up order & pays in cash.

Vendor (Admin):

Logs into admin panel.

Adds/edit vendor listing & availability.

Sees reservation list.

Developer Instruction Guide for Copilot
Step 1: Project Setup


Frontend: Initialize with React.js
Backend: Initialize Node.js + Express.js server.

Set up .env for environment variables (DB URL, WhatsApp API keys).

Step 2: Frontend Development

Pages:

/ (Home)

/vendor/:id (Vendor Details)

/reserve/:id (Reservation Form)

/my-orders (Orders List)

/admin (Vendor Portal)

Components:

VendorCard

FilterBar

OrderList

ReservationForm

ConfirmationModal

Tasks:

Implement responsive layout (mobile-first).

Fetch vendor data from backend API.

Implement form validation.

Send POST requests to backend for reservations.

Show real-time available bag count.

Step 3: Backend Development

API Endpoints:

GET /vendors → List all vendors.

GET /vendors/:id → Vendor details.

POST /reservations → Create reservation.

GET /orders → List user orders.

POST /admin/vendor → Add vendor (admin only).

PATCH /admin/vendor/:id → Update vendor details.

Tasks:

Connect to MongoDB/PostgreSQL.

Implement vendor & reservation schemas.

Add admin authentication for vendor management.

Integrate WhatsApp API for confirmations.

Step 4: Admin Panel

Simple login page (email/password stored in env).

CRUD interface for vendors & bag availability.

Table to view reservations.

Step 5: Testing & Deployment

Test user reservation flow.

Test admin CRUD operations.

Deploy frontend to Vercel & backend to Render/Heroku.