#Album Tracker

Album Tracker is a website designed to help you search for music, play track previews, and keep track of your favorite albums. You can look up any artist or album, see cover art, view track lists, and listen to 30-second song samples. A music player stays at the bottom of the screen so your music keeps playing even when you click around the site. You can save albums to your personal collection, set a status (like Want to listen or Listened), give them 1 to 5 stars, and add your own notes. You can also sort and filter your saved list. If an album is on Deezer, you can switch to their player to listen to full tracks, or use direct links to open the album on Spotify, YouTube, or Apple Music. Lastly, the site uses Google Gemini AI to look at what you’ve saved and rated, then suggests six new albums you might like.

##Screenshot & Live Link

Live Link: https://album-tracker-yourname.vercel.app (Replace with your live URL)

##Screenshot:

 (Include your actual screenshot path here)

##Features

Album Tracker is a website designed to help you search for music, play track previews, and keep track of your favorite albums. You can look up any artist or album, see cover art, view track lists, and listen to 30-second song samples. A music player stays at the bottom of the screen so your music keeps playing even when you click around the site. You can save albums to your personal collection, set a status (like Want to listen or Listened), give them 1 to 5 stars, and add your own notes. You can also sort and filter your saved list. If an album is on Deezer, you can switch to their player to listen to full tracks, or use direct links to open the album on Spotify, YouTube, or Apple Music. Lastly, the site uses Google Gemini AI to look at what you’ve saved and rated, then suggests six new albums you might like.

##Tech Stack

React – UI library for building components

Vite – Development server and build tool

Context API – State management for local storage and global playback

iTunes API – Free public service for album search and track previews

Deezer – Embedded player widget for listening to full albums

Gemini – Google AI service used for generating music recommendations

Vercel – Hosting platform for deploying the website and API functions

##How to Run It Locally

Follow these steps to run the project on your own computer:

##Clone the repository:

git clone https://github.com/YOUR-USERNAME/album-tracker.git
cd album-tracker


##Install dependencies:

npm install


Create .env.local:
Create a file named .env.local in the root folder (next to package.json) and add your Gemini API key:

GEMINI_API_KEY=your_gemini_api_key_here


##Start the server:

npm run dev


Open your browser and go to http://localhost:5173.

##Limitations

30-second previews: Audio previews are limited to 30 seconds because that is all the iTunes API provides.

Saved in browser only: Your album collection is stored only in your browser's local storage and does not sync across different devices.

Deezer login needed: Full tracks require you to be logged into a Deezer account in the same browser.

Privacy Note & Disclaimer

Privacy Note: The AI feature sends your saved album titles, artist names, ratings, and statuses to Google's Gemini API to generate personalized suggestions. Your personal notes are never sent.

Disclaimer: All music data, artwork, and audio belong to their respective owners. This is an educational project and is not affiliated with Apple, Spotify, Deezer, or Google.
