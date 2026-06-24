# SlackEnabler

An intelligent Slack message prioritization and deep-work protection UI built with React and Vite.

**Features**
- **Priority classification**: Surface important Slack messages first.
- **Focus mode**: Minimize interruptions during deep work.
- **Timeline & Settings**: Browse and adjust message handling preferences.

**Getting Started**

- **Prerequisites:** Node.js (16+), npm
- **Install:** Run `npm install` in the project root
- **Run (dev preview):** Run `npm run dev` and open the app at http://localhost:5173

**Build & Preview**
- Build for production: `npm run build`
- Preview production build locally: `npm run preview`

**Project Layout**
- **`src/`**: React source files and components
- **`pages/`**: App pages (Dashboard, Messages, FocusMode, Settings, Timeline)
- **`lib/`**: Utility modules (classifier, store)
- **`vite.config.ts`**: Vite configuration

**Notes**
- If you see TypeScript errors about Vite plugin types before installing devDependencies, run `npm install` first. The app runs locally at http://localhost:5173 when the dev server is running.

If you want, I can run `npm install` and start the dev server here, or help troubleshoot any errors you see when running those commands locally.
