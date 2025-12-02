CourseTube – YouTube → Structured Courses

CourseTube converts any YouTube video (with chapters) into a clean, structured course—similar to Udemy.
Users get auto-generated notes, bookmarks, and a personal dashboard that saves progress so they can continue where they left off.

🚀 Features

Paste YouTube URL with chapters → instantly get a structured course.

add notes and bookmarks to key moments.

User dashboard with saved courses & progress tracking.

Continue learning from your last watched chapter.

Built with Next.js + Clerk Auth + MongoDB.

🧰 Tech Stack

Frontend: Next.js 14

Auth: Clerk

Database: MongoDB (Mongoose)

Styling: TailwindCSS

🔐 .env Structure

Create a .env.local file with:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=

📦 Installation
git clone https://github.com/chinmaye5/CourseTube.git
cd CourseTube
npm install

▶️ Run the App

Development:

npm run dev


Production:

npm run build
npm start
