# Five Percenter Knowledge System – Project Rules

## Core Mission
When working on this project, I will create, analyze, and suggest solutions based on the **Nation of Gods and Earths (NGE)** knowledge system, maintaining cultural authenticity and respect for Five Percenter principles.

---

## 🔑 Foundational Knowledge Base

### Supreme Mathematics (0-9)
The numeric system that represents universal truths:

| Number | Principle | Meaning |
|--------|-----------|---------|
| **0** | Cipher | Completion, wholeness, 360 degrees of knowledge |
| **1** | Knowledge | Foundation; to look, listen, and learn |
| **2** | Wisdom | Wise words and actions; application of knowledge |
| **3** | Understanding | Clear comprehension; mental picture |
| **4** | Culture/Freedom | Way of life; ability to be self-determined |
| **5** | Power/Refinement | Force of truth; elevation through discipline |
| **6** | Equality | Balance; state of being equal |
| **7** | God | Black man (Allah); the mind of a righteous person |
| **8** | Build/Destroy | Elevate or tear down; create or eliminate |
| **9** | Born | Birth of new knowledge; manifestation |

### Supreme Alphabet (A-Z)
Letters carry deeper meaning beyond phonetics. Key examples:
- **A** = Allah (God, the original Black man)
- **B** = Be/Born (to exist, to come into being)
- **C** = See/Cee (perception, understanding)
- **G** = God (the Black man in his highest state)
- **I** = Islam (I-Self-Lord-And-Master)
- **U** = You/Universe (the totality of all things)
- **Z** = Zig-Zag-Zig (from knowledge to wisdom to understanding)

### The 120 Lessons
Three core lesson sets:
1. **Student Enrollment (1-10)** – Foundational questions about identity and reality
2. **Lost-Found Muslim Lessons** – Two parts revealing history and self-knowledge
3. **English Lesson C** – Advanced symbolic and numerical teachings

### The 12 Jewels
1. Knowledge
2. Wisdom
3. Understanding
4. Freedom
5. Justice
6. Equality
7. Food
8. Clothing
9. Shelter
10. Love
11. Peace
12. Happiness

---

## 📐 Design & Development Principles

### 1. **Single Source of Truth (Mathematics-Driven)**
- All data structures should reference the **Supreme Mathematics** as the canonical system
- When building features, ask: "How does this align with the mathematics?"
- IDs and references should use mathematics principles where appropriate (e.g., `math_1` for Knowledge, `math_3` for Understanding)

### 2. **Knowledge Before Action (1 → 2 → 3)**
Follow the natural progression:
1. **Knowledge** (1): Gather facts, research, understand requirements
2. **Wisdom** (2): Apply knowledge through wise decisions and design
3. **Understanding** (3): Ensure clarity and comprehensive vision before building

**In practice:**
- Before implementing a feature, **study** existing resources first (Knowledge)
- Plan and design with **cultural wisdom** (Wisdom)
- Create a **clear mental picture** of the complete system (Understanding)

### 3. **Culture/Freedom (4)**
- Preserve **cultural authenticity** — terminology, concepts, and teachings should be accurate to NGE tradition
- Give users **freedom** to customize their learning path while maintaining core integrity
- Avoid diluting or modifying core teachings; additive content is fine, but foundational knowledge is sacred

### 4. **Build, Don't Destroy (8)**
- When refactoring or updating, **build** new solutions that elevate the system
- Only **destroy** (remove) code that contradicts Five Percenter principles or introduces inaccuracies
- Document all changes: what was built, what was destroyed, and why

### 5. **Born (9) – Manifest Completion**
- Every feature should have a **complete cycle**: plan → build → test → document
- Don't leave partial implementations; bring ideas to **full birth**
- Celebrate when features are "born" (completed and deployed)

---

## 🛠️ Production Readiness & Reliability (Strengthened)

### 1. **Eyes in Production (Visibility)**
- **Diagnostic Logging**: All proxy routes and external service calls must include `console.log` statements for URLs, status codes, and error details in production environments.
- **Fail with Detail**: Never swallow error messages. Ensure the frontend `api.request` client extracts the most granular error detail available (`error.details` or `error.message`) to provide "Knowledge" of failures.

### 2. **Resilient Proxying (Stability)**
- **Safe JSON Handling**: Always use a "safe" JSON parser (try/catch around `JSON.parse` or `response.json()`) when proxying responses from external services to avoid crashing the server on malformed data.
- **Cookie Integrity**: When acting as a proxy, explicitly manage session headers (forwarding `Cookie` to upstream and `Set-Cookie` back to the browser). Use `getSetCookie()` for modern Node environments.

### 3. **Logic Verification (Beyond Syntax)**
- **Return Path Audit**: A file that passes `node --check` (syntax) is not verified until its **logic paths** are audited. Every request must be guaranteed a response (e.g., check for missing `res.json()` in all conditional blocks).
- **Session Gracefulness**: Session checks should fail gracefully (return `200 OK` with `{ user: null }`) rather than throwing `401` errors, to prevent unnecessary browser console noise and API client exceptions.

---

## 🗂️ Data Architecture Rules

### Canonical Content (JSON Packs)
All foundational knowledge lives in **static JSON files** (single source of truth):

```
content-packs/
├── supreme-mathematics.json      # 0-9 with definitions, prompts
├── supreme-alphabet.json         # A-Z with meanings
├── 120-lessons.json              # All three lesson sets
├── 12-jewels.json                # The 12 jewels with aligned habits
├── attributes.json               # Cultural attributes (optional)
└── knowledge-library.json        # Curated readings
```

### Naming Conventions
- Use **descriptive IDs** based on mathematics: `math_1`, `alpha_a`, `lesson_se_01`
- Tag everything with appropriate principles: `#knowledge`, `#wisdom`, `#understanding`
- File and folder names should be **clear and self-documenting**

### Cross-Referencing
- Link concepts across domains (e.g., Knowledge appears in Mathematics, Jewels, and Lessons)
- Use `principle_id` fields to connect user actions to mathematics/alphabet
- Example: A journal entry tagged with `mathematics_id: "math_1"` is about **Knowledge**

---

## 🧪 Testing & Verification Principles

### Knowledge-Based Testing
- **Unit tests** should validate data integrity
- **Component tests** should ensure correct application of principles
- **E2E tests** should verify complete learning flows (Knowledge → Wisdom → Understanding)

### Pre-Flight "Pre-Action" Audit (1)
Before announcing a task is "Born":
1. Verify all routes return a response in all code paths (Success/Fail/Error).
2. Check that upstream calls have fallback "Safe JSON" parsing.
3. Ensure diagnostic logs are present for every proxy point.
4. Verify that auth headers/cookies are explicitly handed off between hops.

---

## ✅ Success Criteria

A feature is successful when it:
- ✅ **Educates** – Users gain real Knowledge
- ✅ **Empowers** – Users feel Freedom to learn and grow
- ✅ **Respects** – Cultural authenticity is maintained
- ✅ **Builds** – The system elevates understanding, doesn't confuse
- ✅ **Completes** – The feature is Born (fully functional, tested, and observable)

---

**Peace. ✊🏿**
