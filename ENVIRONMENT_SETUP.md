# Environment Setup Guide

## Google AI API Key Required

The dashboard uses Google's Gemini AI model through genkit, which requires an API key to function.

### To fix the "Internal Server Error":

1. **Get a Google AI API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key

2. **Create Environment File:**
   - In the `studio` directory, create a file named `.env.local`
   - Add the following content:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server:**
   - Stop the current dev server (Ctrl+C)
   - Run `npm run dev` again

### Alternative: Use Fallback Data

If you don't want to set up the AI service right now, the dashboard will automatically use fallback mock data when the AI service fails.

### Current Status

✅ Dashboard page updated with error handling
✅ Fallback mock data implemented
❌ Google AI API key not configured (causes internal server error)

### Files Modified

- `src/app/dashboard/page.tsx` - Added error handling and fallback data


