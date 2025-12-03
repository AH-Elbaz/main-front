# VitaLink - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `NEXT_PUBLIC_APP_URL` with production URL
- [ ] Configure API endpoints
- [ ] Add analytics IDs (Google Analytics, GTM, etc.)
- [ ] Verify all sensitive keys are in `.env.local` (not committed)

### 2. Performance Optimizations ✅
- [x] Image optimization enabled with AVIF/WebP formats
- [x] Lazy loading implemented for below-fold images
- [x] Priority loading for above-fold hero images
- [x] React components memoized
- [x] Compression enabled
- [x] Console logs removed in production build
- [x] Proper image sizes configured

### 3. SEO & Metadata ✅
- [x] Meta tags configured
- [x] Open Graph tags added
- [x] Twitter cards configured
- [x] Robots.txt ready
- [x] Sitemap configuration

### 4. Code Quality
- [x] React Strict Mode enabled
- [x] TypeScript configured
- [x] ESLint configured
- [x] Memoization applied to expensive components
- [x] Cleanup functions in useEffect

## Build & Deploy

### Local Build Test
```powershell
# Install dependencies
npm install

# Run production build
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

```powershell
# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

### Deploy to Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

### Deploy to Custom Server (Node.js)
```powershell
# Build the app
npm run build

# Start production server
npm start
```

## Performance Metrics to Monitor

After deployment, monitor these metrics:
- **Lighthouse Score**: Target 90+ for all categories
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Post-Deployment

### 1. Test Critical Paths
- [ ] Homepage loads correctly
- [ ] All images load and display properly
- [ ] Forms work (signup, login, newsletter)
- [ ] Mobile responsiveness
- [ ] All internal links work

### 2. Analytics Setup
- [ ] Verify Google Analytics tracking
- [ ] Set up conversion tracking
- [ ] Configure error tracking (Sentry, etc.)

### 3. Performance Testing
```powershell
# Run Lighthouse audit
npx lighthouse https://your-domain.com --view

# Or use online tools:
# - PageSpeed Insights: https://pagespeed.web.dev/
# - WebPageTest: https://www.webpagetest.org/
```

### 4. SEO Verification
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible
- [ ] Check Open Graph tags with https://www.opengraph.xyz/
- [ ] Test Twitter cards with https://cards-dev.twitter.com/validator

## Monitoring & Maintenance

### Regular Tasks
- Monitor error rates
- Review performance metrics weekly
- Update dependencies monthly
- Review and optimize images quarterly

### Scaling Considerations
- Consider CDN for static assets (Cloudflare, etc.)
- Enable caching headers
- Monitor API rate limits
- Set up uptime monitoring

## Troubleshooting

### Build Failures
```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force .next
npm run build
```

### Image Optimization Issues
- Verify image paths are correct
- Check image formats are supported
- Ensure images are under 5MB

### Performance Issues
- Check bundle size: `npm run build` (look for warnings)
- Analyze bundle: Install `@next/bundle-analyzer`
- Review network requests in DevTools

## Additional Resources
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
