# Five Percent Mentor (Vue 3 + Neon)

A modern, glassmorphic knowledge management system designed for the study and practice of the Nation of Gods and Earths (NGE) knowledge. Built with Vue 3, Neon Postgres, and Tailwind CSS.

## 🌟 Key Features

*   **Premium Glassmorphic UI**: High-end aesthetic with vibrant gradients, backdrop blurs, and smooth micro-animations.
*   **Deep Attribute Builder**: Set an "Active Building Focus" for character growth. Manifest divine attributes (Knowledge, Wisdom, etc.) through targeted study and consistency tracking.
*   **Knowledge Mastery Engine**: Automatic persistent tracking for Math and Alphabet. Earn "Mastered" badges after 5 correct answers, with immersive **Born Notifications** celebrating your manifestation.
*   **Adaptive Quiz System**: Intelligent filtering that prioritizes unmastered subjects, ensuring study sessions are always directed toward personal elevation.
*   **Media-Rich Library**: Integrated Archive.org API for global search, PDF reader for foundational books, and multi-media support for Watching, Listening, and Reading.
*   **Real-time Persistence**: User progress, attribute levels, and mastery metrics are persisted to a Neon PostgreSQL database via Drizzle ORM.
*   **Secure Authentication**: Fully integrated with Neon Auth, featuring secure sessions and developer-friendly local proxying.
*   **Dynamic Theme System**: 5 curated themes that instantly transform the interface according to your mental state.

## 🛠 Technology Stack

*   **Core**: [Vue 3](https://vuejs.org/) (Composition API)
*   **Database/ORM**: [Neon Postgres](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing**: [Vue Router](https://router.vuejs.org/)
*   **Bundling**: [Vite](https://vitejs.dev/)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18.0+)
*   Neon Database URL (with Auth enabled)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/St0lenThunda/five-percent-mentor.git
    cd five-percent-mentor
    ```

2.  **Configure Environment**:
    Create a `.env` file based on `.env.example`:
    ```bash
    VITE_NEON_AUTH_URL=your_neon_auth_url
    DATABASE_URL=your_postgres_connection_string
    ```

3.  **Install & Start**:
    ```bash
    npm install
    npm run dev
    ```

## 📂 Project Structure

```
five-percent-mentor/
├── docs/               # System walkthrough and design logs
├── public/
│   └── content-packs/  # Canonical JSON data (Math, Alphabet, etc.)
├── src/
│   ├── auth/           # Neon Auth client & session management
│   ├── db/             # Drizzle schema and client config
│   ├── stores/         # Pinia modules (User, Progress, Content)
│   ├── views/          # Module pages and Dashboard
│   └── components/     # AppLogo, UserDropdown, ModuleTemplates
├── drizzle/            # Database migrations
└── vite.config.js      # Dev proxy & build configuration
```

## 📐 Implemented Modules

*   **🔢 Supreme Mathematics**: Interactive degrees 1-10 with persistent **Mastery Badges**.
*   **🔤 Supreme Alphabet**: Interactive A-Z meanings with persistent **Mastery Badges**.
*   **☀️ Attribute Builder**: Immersive character growth module for manifesting the 14 Attributes of a Righteous Person.
*   **📖 120 Lessons**: Structured study flow for Student Enrollment 1-10.
*   **🎯 Quizzes**: Adaptive, data-driven assessment that prioritizes unmastered subjects.
*   **📚 Knowledge Library**: Media-rich portal with Global Archive Search, PDF reader, and multi-media support (Watch/Listen/Read).
*   **🎴 Flashcards**: Active recall tool for core principles.

---

**Knowledge is the foundation. Peace.** ✊🏿
