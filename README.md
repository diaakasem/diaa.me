# Diaa Kasem - Personal Portfolio and Blog

## Project Overview

A modern, static personal portfolio and blog site built with:
- [Zola](https://www.getzola.org/) - Static Site Generator
- [UnoCSS](https://unocss.dev/) - On-demand Atomic CSS Engine
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [pnpm](https://pnpm.io/) - Fast, disk-space efficient package manager

## Prerequisites

- [Rust](https://www.rust-lang.org/) (for Zola)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [pnpm](https://pnpm.io/)
- [Zola](https://www.getzola.org/documentation/getting-started/installation/)

## Project Structure

```
.
├── blog/             # Zola content and templates
│   ├── content/      # Markdown content
│   ├── templates/    # HTML templates
│   └── static/       # Static assets
├── src/              # Source files for Vite
├── uno.config.ts     # UnoCSS configuration
├── vite.config.ts    # Vite configuration
└── package.json      # Project dependencies and scripts
```

## Setup and Installation

1. Clone the repository
   ```bash
   git clone https://github.com/diaakasem/diaa.me.git
   cd diaa-portfolio
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

## Development Workflow

### Development Server
Run the development server with live reloading:
```bash
pnpm run dev
```

### Build for Production
Generate static files for production:
```bash
pnpm run build
```

### Preview Production Build
Test the production build locally:
```bash
pnpm run preview
```

## Project Technologies

### Static Site Generation
- **Zola**: A fast static site generator written in Rust
- Supports Markdown content
- Jinja2-like templating
- Built-in asset processing

### Styling
- **UnoCSS**: On-demand atomic CSS engine
- Utility-first CSS approach
- Zero-runtime, performance-focused
- Highly customizable

### Build Tooling
- **Vite**: Next-generation frontend tooling
- Extremely fast development server
- Optimized production builds
- Plugin-based architecture

### Package Management
- **pnpm**: Fast, disk-space efficient package manager
- Saves disk space through hard linking
- Faster than npm and Yarn

## Customization

- Modify `uno.config.ts` to customize UnoCSS
- Update `vite.config.ts` for build configurations
- Edit Zola templates in `blog/templates/`
- Add content in `blog/content/`

## Deployment

The site can be deployed to various static hosting platforms:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

Typical deployment involves running `pnpm run build` and deploying the `public/` directory.

## Contact

Diaa Kasem
- Email: [me@diaa.me]
- Website: [diaa.me]
- LinkedIn: [linkedin.com/in/diaakasem]
