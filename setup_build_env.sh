#!/bin/sh
echo VK_CLIENT_ID=$VK_CLIENT_ID >> .env.local
echo VK_CLIENT_SECRET=$VK_CLIENT_SECRET >> .env.local
echo NEXTAUTH_URL=$NEXTAUTH_URL >> .env.local
echo NEXTAUTH_SECRET=$NEXTAUTH_SECRET >> .env.local
echo NEXT_PUBLIC_HERE_API_KEY=$HERE_API_KEY >> .env.local
