# LDN Premium Property Platform

A modern, secure property search platform for London new-build developments.

**Project URL**: https://lovable.dev/projects/7a2ca503-8bf7-45e0-9be2-06d6ba391f4a

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

This project uses Lovable Cloud for backend services (database, auth, storage). 

**Required environment variables:**

1. Copy `.env.example` to `.env` (if not already present)
2. Add your Mapbox public token:
   ```
   VITE_PUBLIC_MAPBOX_TOKEN=your_token_here
   ```

**Note:** Supabase/Cloud variables (`VITE_SUPABASE_*`) are auto-managed by Lovable and should not be edited manually.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7a2ca503-8bf7-45e0-9be2-06d6ba391f4a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **Mapbox GL** - Interactive maps

### Backend (Lovable Cloud)
- **Database** - PostgreSQL via Supabase
- **Authentication** - Built-in auth system
- **Edge Functions** - Serverless API endpoints
- **Storage** - File uploads and management

### Quality Assurance
- **ESLint** - Code linting
- **GitHub Actions** - CI/CD pipeline
- **TypeScript** - Compile-time type checking

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7a2ca503-8bf7-45e0-9be2-06d6ba391f4a) and click on Share -> Publish.

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Feature components
├── data/            # Static data and types
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── pages/           # Route pages
└── integrations/    # External service clients

supabase/
├── functions/       # Edge functions (serverless)
└── config.toml      # Supabase configuration
```

## Security & Best Practices

✅ **Secrets Management**: All API keys stored securely (never in git)  
✅ **Environment Validation**: Runtime checks for required variables  
✅ **CI/CD**: Automated build checks on every push  
✅ **Accessibility**: WCAG 2.1 AA compliant with ARIA labels  
✅ **Performance**: Lazy loading, optimized images, code splitting  
✅ **Type Safety**: Full TypeScript coverage

## Custom Domain

To connect a custom domain, navigate to **Project > Settings > Domains** and click **Connect Domain**.

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain#custom-domain)
