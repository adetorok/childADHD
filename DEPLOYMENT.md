# Deployment Guide

This guide will help you deploy the Child ADHD Clinical Trials landing page to various hosting platforms.

## 🚀 Quick Start

The website is a static site that can be deployed to any web hosting service. No build process is required.

## 📁 Files to Deploy

Make sure to include these files in your deployment:
- `index.html` (main page)
- `styles.css` (styling)
- `script.js` (functionality)
- `README.md` (documentation)

## 🌐 Hosting Options

### 1. GitHub Pages (Recommended)

1. Push your code to the GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be available at `https://adetorok.github.io/childADHD/`

### 2. Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: (leave empty)
3. Set publish directory: `/` (root)
4. Deploy automatically on every push

### 3. Vercel

1. Import your GitHub repository
2. No build settings needed (static site)
3. Deploy automatically

### 4. Traditional Web Hosting

1. Upload all files to your web server's public directory
2. Ensure `index.html` is in the root directory
3. Test the website

## 🔧 Local Development

To run the site locally:

```bash
# Install dependencies (optional)
npm install

# Start local server
npm start
# or
npm run dev
```

## ✅ Pre-Deployment Checklist

- [ ] Test language switching functionality
- [ ] Verify all contact information is correct
- [ ] Test form submission (if backend is set up)
- [ ] Check mobile responsiveness
- [ ] Validate HTML and CSS
- [ ] Test in multiple browsers
- [ ] Verify all links work correctly

## 🎯 SEO Optimization

The site includes basic SEO elements:
- Meta tags for viewport and charset
- Semantic HTML structure
- Alt text for images (emojis)
- Proper heading hierarchy

## 📱 Performance

- Optimized CSS and JavaScript
- No external dependencies (except fonts)
- Fast loading times
- Mobile-optimized

## 🔒 Security

- No sensitive data collection
- Form validation on client-side
- HTTPS recommended for production

## 📞 Support

For technical support or questions about deployment, contact the development team.
