# CourseTube 
Live link: https://coursetube.vercel.app

CourseTube is a sophisticated learning management platform that transforms YouTube content into structured, distraction-free educational experiences. By leveraging instant mapping and precision progress tracking, it provides learners with the tools necessary to turn passive video consumption into active mastery.

## Key Features

- **Structured Curriculum Mapping**: Automatically organizes YouTube playlists and videos into a logical, easy-to-follow learning path.
- **Precision Progress Tracking**: Persistent storage of learning progress across sessions, including chapter completion detection.
- **Intelligent Chapter Navigation**: Seamless integration with YouTube timestamps for instant access to specific topics.
- **Context-Aware Documentation**: Markdown-supported note-taking system with automatic video timestamping for contextual review.
- **Analytics Dashboard**: Comprehensive visualization of learning habits, including watch time metrics and course completion statistics.
- **Global Discovery Library**: A community-curated collection of high-quality courses across various domains including Frontend Engineering, Artificial Intelligence, and System Design.
- **Focus Mode**: A distraction-free learning environment designed to minimize cognitive load and maximize retention.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animation**: Framer Motion and GSAP
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **State Management**: React Hooks and Server Actions
- **Theming**: next-themes (Dark/Light Mode support)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB instance
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coursetube.git
   cd coursetube
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js application routes and server components.
- `/components`: Reusable UI components built with a focus on modularity and performance.
- `/lib`: Core utility functions, database configurations, and shared logic.
- `/public`: Static assets including brand assets and icons.

## Contribution Guidelines

We welcome contributions to CourseTube. Please ensure that any pull requests follow the established coding standards and include appropriate documentation updates.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- YouTube Data API for content integration.
- The open-source community for the robust toolset that powers this platform.
