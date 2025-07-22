# Content Security Policy (CSP) Guide

## Overview

This guide explains how to manage Content Security Policy (CSP) in the Rutgers
Golf Course Social Media Dashboard. CSP is a security feature that helps prevent
cross-site scripting (XSS) and other code injection attacks.

## Common CSP Issues

### 1. External Stylesheets Blocked

**Problem**: Google Fonts or other external stylesheets are blocked.

**Solution**: Add the external domain to the `style-src` directive.

```javascript
// In next.config.js
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; style-src 'self' 'unsafe-inline' " +
         "https://fonts.googleapis.com; font-src 'self' " +
         "https://fonts.gstatic.com;"
}
```

### 2. External Scripts Blocked

**Problem**: Third-party scripts (analytics, etc.) are blocked.

**Solution**: Add the external domain to the `script-src` directive.

```javascript
// In next.config.js
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' " +
         "'unsafe-inline' https://your-domain.com;"
}
```

### 3. Images from External Sources Blocked

**Problem**: Images from external sources (CDNs, etc.) are blocked.

**Solution**: Add the external domain to the `img-src` directive.

```javascript
// In next.config.js
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; img-src 'self' data: https:;"
}
```

## Development Workflow

### 1. Testing CSP

Test your CSP configuration in development:

```bash
# Check CSP headers
curl -I http://localhost:3000 | grep -i "content-security-policy"

# Test in browser console
# Look for CSP violation messages
```

### 2. Common External Services

Here are common external services and their CSP rules:

**Google Fonts**:

```javascript
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
```

**Google Analytics**:

```javascript
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com;
```

**Supabase**:

```javascript
connect-src 'self' https://your-project.supabase.co;
```

## Best Practices

1. **Start Restrictive**: Begin with a very restrictive CSP and gradually
   add exceptions.

2. **Use Nonces**: For inline scripts, use nonces instead of
   `'unsafe-inline'` when possible.

3. **Monitor Violations**: Use browser developer tools to monitor CSP
   violations during development.

4. **Test Thoroughly**: Test all features with CSP enabled before
   deployment.

5. **Document Changes**: Keep track of CSP changes and their reasons.

## Troubleshooting

### Browser Console Errors

Look for messages like:

- "Refused to load the stylesheet"
- "Refused to execute inline script"
- "Refused to load the image"

### Common Fixes

1. **For inline styles**: Add `'unsafe-inline'` to `style-src`
2. **For inline scripts**: Add `'unsafe-inline'` to `script-src`
3. **For external resources**: Add the domain to the appropriate directive
4. **For data URIs**: Add `data:` to the appropriate directive

## Current Configuration

The current CSP configuration in `next.config.js` includes:

```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' " +
         "'unsafe-inline'; style-src 'self' 'unsafe-inline' " +
         "https://fonts.googleapis.com; style-src-elem 'self' " +
         "'unsafe-inline' https://fonts.googleapis.com; img-src 'self' " +
         "data: https:; font-src 'self' data: " +
         "https://fonts.gstatic.com; connect-src 'self' " +
         "https://hkfktixrpuzfoycrhgyu.supabase.co;"
}
```

This configuration allows:

- Google Fonts for styling
- Supabase for API connections
- Inline scripts and styles (for development)
- Images from HTTPS sources and data URIs
