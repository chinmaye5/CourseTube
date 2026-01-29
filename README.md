# CourseTube

CourseTube is a modern learning management system that transforms any YouTube video into a structured, distraction-free educational course. By extracting chapter information and providing a suite of interactive tools, it bridges the gap between passive video watching and active learning.

## Features

### Course Management
- Smart Chapter Extraction: Automatically parses YouTube video data to generate a structured course curriculum.
- Persistent Progress Tracking: Real-time monitoring of chapter completion with automatic saving.
- Personalized Dashboard: A centralized view for managing enrolled courses, viewing progress, and resuming active lessons.

### Enhanced Learning Tools
- Distraction-Free Player: A custom video interface optimized for focus, removing secondary YouTube elements like recommendations and comments.
- Contextual Notes: Create timestamped notes that are linked directly to specific moments in the video.
- Bookmark System: Save critical timestamps for quick reference during revision.
- Seamless Syncing: Synchronize progress across devices to resume learning exactly where you left off.

### Premium Experience
- Nebula Dark Interface: A high-end design system featuring glassmorphism, smooth micro-animations, and a cohesive dark theme.
- Interactive UI: Built with modern components for a fluid, responsive user experience.
- Deep Analytics: Visualize learning patterns and progress milestones.

## Technology Stack

- Framework: Next.js 16 (App Router)
- Authentication: Clerk
- Database: MongoDB via Mongoose
- UI Components: HeroUI (NextUI)
- Animations: Framer Motion
- Styling: TailwindCSS 4
- Icons: Lucide React

## Configuration

To run this project locally, create a .env.local file in the root directory and provide the following environment variables:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string

## Getting Started

1. Clone the repository:
   git clone https://github.com/chinmaye5/CourseTube.git

2. Install dependencies:
   npm install

3. Run the development server:
   npm run dev

4. Open http://localhost:3000 in your browser to view the application.

## Project Structure

- /app: Application routes, layouts, and API endpoints.
- /components: Shared React components.
- /lib: Database connection logic and utility functions.
- /public: Static assets including logos and icons.

## License

This project is open-source and available under the MIT License.
