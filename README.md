# Five Percent Mentor (Vue 3 + Neon)

A modern, glassmorphic knowledge management system designed for the study and practice of the Nation of Gods and Earths (NGE) knowledge. Built with Vue 3, Neon Postgres, and Tailwind CSS.

## 🌟 Key Features

*   **Premium Glassmorphic UI**: High-end aesthetic with vibrant gradients, backdrop blurs, and smooth micro-animations.
*   **Integrated Knowledge Engine**: Canonical content for Supreme Mathematics, Supreme Alphabet, 12 Jewels, and 120 Lessons (Student Enrollment).
*   **Interactive Quiz System**: Customizable quizzes with randomization, topic selection (Math, Alphabet, Lessons, Jewels), and real-time score tracking.
*   **Real-time Persistence**: User progress, quiz results, and study logs are persisted to a Neon PostgreSQL database via Drizzle ORM.
*   **Secure Authentication**: Fully integrated with Neon Auth, featuring secure sessions and developer-friendly local proxying.
*   **Dynamic Theme System**: 5 curated themes (Vibrant, Professional, Afrocentric, Dark Academia, Neo-Brutalist) that instantly transform the interface.
*   **Progress Dashboard**: Personalized "Journey" section tracking lessons completed, days active, and quizzes born.

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

*   **🔢 Supreme Mathematics**: Interactive degrees 1-10 with daily rotation.
*   **🔤 Supreme Alphabet**: Interactive A-Z meanings.
*   **📖 120 Lessons**: Structured study flow for Student Enrollment 1-10.
*   **🎯 Quizzes**: Data-driven assessment with randomized questions.
*   **🎴 Flashcards**: Active recall tool for core principles.
*   **📚 Knowledge Library**: Access to the [12 Jewels](public/content-packs/12-jewels.json) and curated readings.

---

**Knowledge is the foundation. Peace.** ✊🏿
