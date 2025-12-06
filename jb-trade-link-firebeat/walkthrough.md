
# Migration to Supabase & Vercel Deployment

I have successfully migrated the application from Firebase to Supabase. The project is now ready to be deployed to Vercel.

## Changes Made

1.  **Dependencies**: Removed `firebase`, installed `@supabase/supabase-js`.
2.  **Configuration**: Updated `lib/supabase.ts` with your provided Supabase URL and Public Key.
3.  **Services**:
    *   Rewrote `services/firestore.ts` to use Supabase Database (PostgreSQL).
    *   Rewrote `services/auth.tsx` to use Supabase Auth.
4.  **Pages**:
    *   Updated `pages/Login.tsx` to use Supabase Auth for login and registration.
    *   Updated `pages/admin/SystemHealth.tsx` to use Supabase for data imports and diagnostics.
5.  **Cleanup**: Removed `lib/firebaseClient.ts` and `firebase.json`.

## Setup Instructions

### 1. Database Setup
You need to create the necessary tables in your Supabase project. I have created a SQL script for this.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open the **SQL Editor**.
3.  Copy the contents of `supabase_schema.sql` (located in the project root).
4.  Paste it into the SQL Editor and click **Run**.

### 2. Authentication Setup
Ensure Email/Password authentication is enabled in your Supabase project:
1.  Go to **Authentication** > **Providers**.
2.  Enable **Email**.

### 3. Deployment to Vercel
1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Import the project into Vercel.
3.  Vercel should automatically detect it as a Vite project.

4.  Deploy!

### 4. Data Migration (Optional)
If you have existing invoice data in JSON format (similar to the mock data), you can use the helper script I created:
1.  Place your JSON data in `scripts/old_data.json`.
2.  Run `node scripts/migrate_invoices.js`.
3.  This will map and upload your invoices to the `orders` table in Supabase.


## Verification
I have run the build locally (`npm run build`) and it passed successfully.
The application is configured to use the provided Supabase credentials:
*   **URL**: `https://qlosefnvwvmqeebfqdcg.supabase.co`
*   **Key**: `sb_publishable_GmOKGTI8IFmv9q-KFJoICg_397GdY1g`
