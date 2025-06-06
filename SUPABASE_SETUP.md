# Supabase Database Setup Instructions

To connect your application with Supabase:

1. Go to the [Supabase dashboard](https://supabase.com/dashboard/projects)
2. Create a new project if you haven't already
3. Once in the project page, click the "Connect" button on the top toolbar
4. Copy URI value under "Connection string" -> "Transaction pooler"
5. Replace `[YOUR-PASSWORD]` with the database password you set for the project
6. Add the DATABASE_URL as a secret in your Replit environment

The connection string should look like:
```
postgresql://postgres.abc123:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

Once you provide the Supabase DATABASE_URL, I'll update the configuration and test the connection.