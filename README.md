# Unified 5% Knowledge System (Vue 3 + Vite)

A modern, glassmorphic web application designed to facilitate the study and practice of the 5% Nation's knowledge system. This front-end application serves as a mentor and tracker for students, built with Vue 3, Vite, and Tailwind CSS.

## 🌟 Features

*   **Modern Glassmorphic UI**: A stunning, premium interface with glass effects, dynamic gradients, and smooth interactions.
*   **Dynamic Theme System**: Choose from 5 distinct aesthetic themes:
    *   **Current (Vibrant)**: Purple/Gold/Indigo gradient.
    *   **Minimalist Professional**: Clean slate/gray tones for focus.
    *   **Elegant Afrocentric**: Rich terracotta/earth tones with authentic styling.
    *   **Dark Academia**: Aged paper, stone, and dramatic shadows.
    *   **Neo-Brutalist**: High-contrast black & white with bold typography.
*   **Mock Authentication**: Built-in demo mode allowing seamless exploration without a backend connection.
*   **Interactive Dashboard**: Central hub tracking progress across modules.
*   **User Dropdown**: Integrated user management with theme switcher and sign-out.
*   **Responsive Design**: Mobile-first architecture ensuring access on any device.

## 🛠 Technology Stack

*   **Framework**: [Vue 3](https://vuejs.org/) (Script Setup)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Routing**: [Vue Router](https://router.vuejs.org/)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16.0 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd five-percent-mentor
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 🔑 Authentication (Demo Mode)

The application currently runs in **Mock Authentication Mode**, allowing you to explore all features without a backend database.

*   **Sign Up**: Enter any email/password to create a new session.
*   **Log In**: Use the following demo credentials (or any you "signed up" with):
    *   **Email**: `demo@example.com`
    *   **Password**: `password123` (or anything)

*Your session is persisted in `localStorage`, so you will remain logged in even after refreshing.*

## 🎨 Theme Customization

The application includes a robust theme system accessible via the **User Dropdown** in the top-right corner.

1.  Click your **User Profile** icon in the header.
2.  Expand the **Theme** submenu.
3.  Select any of the 5 available themes to instantly transform the application's look and feel.

## 📂 Project Structure

```
src/
├── auth/           # Authentication services (MockAuth & NeonAuth)
├── components/     // Reusable UI components (UserDropdown, etc.)
├── config/         # App configuration (Theme definitions)
├── stores/         # Pinia state stores (User, Theme)
├── views/          # Page views (Login, Signup, Dashboard)
├── assets/         # Static assets
└── style.css       # Global styles & Tailwind directives
```

## 📐 Knowledge Modules (Upcoming)

*   **Supreme Mathematics**: Daily lessons on 1-10.
*   **Supreme Alphabet**: Daily lessons on A-Z.
*   **120 Lessons**: Structured study companion.
*   **Cipher Builder**: Collaborative discussion tools.
*   **Born Day Journal**: Daily reflections.

---

**Peace.** ✊🏿
