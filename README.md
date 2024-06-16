# omweu-frontend

This frontend is built with React and Next.js.

## Development

Install project dependencies as:
```bash
yarn
```

To start a local development server, run:

```bash
yarn dev
```

Or you can use the VSCode launch preset.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Code changes will be applied immediately, except for changes in translation files.

## Environment variables

The following environment variables are required for proper functioning of all fo the app features:
```
NEXT_PUBLIC_HERE_API_KEY=... # access key to here.com API
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=... # Google recaptcha site key, used for reginstration
NEXTAUTH_SECRET=... # NextAuth secret, use for authentication, can be any arbitrary value
STRAPI_ACCESS_TOKEN=... # access token to Strapi CMS, used for FAQ content access
STAFF_USER_EMAIL=... # staff user credentials, used to generate sitemap.xml
STAFF_USER_PASSWORD=...
```

You can create a file called `.env.local` to store the variable values.
