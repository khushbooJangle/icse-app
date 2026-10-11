# Supabase setup — first time

Everything here is done once, in a browser. Nothing in this file needs the terminal
except the last step. Budget about 30 minutes, most of it waiting for Google.

Work through it top to bottom — later steps need values from earlier ones.

---

## 1. Create the Supabase project

1. Go to **https://supabase.com** → **Start your project** → sign in with GitHub
   (use the **khushbooJangle** account, not work).
2. **New project**, then:
   - **Name** — `icse-app`
   - **Database Password** — click Generate, then **save it in your password manager**.
     You won't need it for this app (the JS client uses API keys, not the DB password),
     but it's the only way to connect to the database directly later, and Supabase
     will not show it to you again.
   - **Region** — pick the one nearest your students. `South Asia (Mumbai)` if that's
     where they are; this only affects latency.
   - **Plan** — Free.
3. Press **Create new project** and wait ~2 minutes while it provisions.

> **Free-tier caveat, worth knowing now:** a free project pauses after 7 days with no
> activity, and you restore it with one click from the dashboard. Mid-term that's a
> nuisance rather than a problem, but don't be alarmed the first time the app can't
> reach the database after a quiet week.

---

## 2. Copy the API keys

1. In your project, open **Project Settings** (the gear, bottom of the left sidebar)
   → **API**.
2. You need exactly two values:
   - **Project URL** — the bare origin, `https://abcdefghijkl.supabase.co`

     > **The easiest mistake in this whole setup.** The dashboard also shows a
     > *REST* URL ending `/rest/v1/`. Do **not** use that one. The client adds
     > `/rest/v1/...` itself, so pasting it gives you
     > `/rest/v1/rest/v1/subjects` and every single query fails with
     > `Invalid path specified in request URL`. No trailing slash either.

   - **anon / publishable key** — either an `sb_publishable_...` string (current
     format) or a long `eyJ...` JWT (older projects). Both are correct.

There is also a **service_role** key on that page. **Do not use it in this app.** It
bypasses every security rule in the schema. It belongs only on a server you control,
never in a browser bundle — and anything named `NEXT_PUBLIC_*` ends up in the browser.

3. In the project folder, create a file called **`.env.local`**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```

`.env.local` is already in `.gitignore`, so these never reach GitHub. There's a
committed `.env.local.example` showing the shape without the real values.

> The anon key being public is normal and by design — it identifies the project, not
> the user. What actually protects your data is Row Level Security, which is why the
> schema in step 4 matters so much.

---

## 3. Set up Google sign-in

Two halves: create the credential at Google, then paste it into Supabase.

### 3a. Create the OAuth client at Google

1. Go to **https://console.cloud.google.com** and sign in with the Google account you
   want to own this.
2. Top bar → project dropdown → **New Project** → name it `icse-app` → **Create**.
   Make sure that new project is selected before continuing.
3. Left menu → **APIs & Services** → **OAuth consent screen**:
   - User type **External** → **Create**
   - **App name** `ICSE Study App`, **User support email** your address,
     **Developer contact** the same address
   - Save through the remaining steps; you can leave Scopes and Test users empty.
   - While the app is in **Testing** mode, only accounts you add under **Test users**
     can sign in. Either add your students' addresses there, or use **Publish app**
     to open it up. For a handful of known users, Testing mode is fine and is the
     safer default.
4. Left menu → **Credentials** → **Create Credentials** → **OAuth client ID**:
   - **Application type** — Web application
   - **Name** — `icse-app web`
   - **Authorised redirect URIs** → **Add URI** and paste:

     ```
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```

     Replace `YOUR-PROJECT-REF` with the one from your Project URL in step 2. This
     must match exactly — a trailing slash or a typo here produces a
     `redirect_uri_mismatch` error at sign-in, which is the single most common
     thing to get wrong in this whole setup.
   - **Create**, then copy the **Client ID** and **Client secret**.

### 3b. Paste it into Supabase

1. Supabase dashboard → **Authentication** → **Providers** → **Google**.
2. Toggle **Enable Sign in with Google** on.
3. Paste the **Client ID** and **Client Secret**. **Save**.

### 3c. Tell Supabase where your app lives

1. **Authentication** → **URL Configuration**.
2. **Site URL** — `http://localhost:3000` while building.
3. **Redirect URLs** — add only this one for now:

   ```
   http://localhost:3000/**
   ```

   Add your real deployed URL here **when you actually deploy**, not before.
   Do not add a placeholder like `https://your-app.vercel.app/**`: anyone can
   claim an unused `vercel.app` subdomain, and every URL in this list is a place
   Supabase is willing to hand a freshly-issued session token to. Only list
   domains you control.

---

## 4. Run the schema

1. Supabase dashboard → **SQL Editor** (left sidebar) → **New query**.
2. Open **`supabase/schema.sql`** from this repo, copy the **whole file**, paste it in.
3. **Before running, edit one thing.** Find `is_super_admin_email` near the top and
   replace the placeholder with your real Google sign-in address:

   ```sql
   select lower(addr) in (
     'khushboojangle@gmail.com'     -- <- your actual address
   )
   ```

   This is the list that decides who becomes Super Admin at first sign-in. It has to
   be right *before* you sign in for the first time, or you'll come through as an
   ordinary user with no profile. (Fixable — re-run just that function and sign in
   again — but easier to get right now.)
4. Press **Run**. It should finish in a second or two with `Success. No rows returned`.
5. Sanity check — **Table Editor** in the sidebar should now list 8 tables:
   `subjects`, `tutors`, `profiles`, `invites`, `progress`, `paper_attempts`,
   `daily_activity`, `doubts`. Open `subjects` and confirm it has one row,
   `computer-applications`.

> **If you need to start over:** the bottom of `schema.sql` has a commented-out
> TEARDOWN block. Uncomment it, run it on its own, then run the file again. It drops
> all app data, so only use it during setup.

---

## 5. Match the app-side allowlist

Open **`src/config/superAdmins.ts`** and put the same address in there.

Two copies exist on purpose. The SQL one enforces the rule; the TypeScript one only
drives what the UI shows. If they ever disagree, the database wins — which is the
correct way round, but it will look like a confusing bug, so change both together.

---

## 6. Check it worked

```bash
cd "/Users/khushboo/Personal Projects/icse-app"
npm run dev
```

Nothing is wired to Supabase yet — that's stage 2. For now, confirm the app still
starts and the existing pages load. The real sign-in test comes with the auth flow.

---

## Troubleshooting

| What you see | What it means |
|---|---|
| `redirect_uri_mismatch` at Google | The URI in step 3a doesn't exactly match `https://<ref>.supabase.co/auth/v1/callback`. |
| Signed in, but landed on the signup screen as a normal user | Your address isn't in `is_super_admin_email`. Fix it in the SQL Editor, delete your row from `profiles`, sign in again. |
| `infinite recursion detected in policy` | A policy is querying `profiles` directly instead of going through the `SECURITY DEFINER` helpers. Shouldn't happen with this schema unedited. |
| Queries return no rows, no error | Normal RLS behaviour when a policy doesn't match — it hides rows rather than erroring. Check which role your profile actually has. |
| `Invalid API key` | `.env.local` has the wrong key, or the dev server wasn't restarted after editing it. Next.js only reads env files at startup. |
| `Invalid path specified in request URL` on every query | `NEXT_PUBLIC_SUPABASE_URL` includes `/rest/v1/` or a trailing slash. It must be just `https://<ref>.supabase.co`. |
| `permission denied for function ensure_profile` | Normal when signed out — those functions are granted to `authenticated` only. If you see it while signed in, the sign-in didn't complete. |
| App can't reach the database after a quiet week | Free project paused. Restore it from the Supabase dashboard. |
