import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { prisma } from '../db/prisma';

// Sérialisation de l'utilisateur
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configuration Discord OAuth
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/discord/callback',
        scope: ['identify', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findUnique({
            where: {
              provider_providerId: {
                provider: 'discord',
                providerId: profile.id
              }
            }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                username: profile.username,
                email: profile.email,
                provider: 'discord',
                providerId: profile.id,
                avatar: profile.avatar
              }
            });

            // Créer un réseau par défaut
            await prisma.network.create({
              data: {
                userId: user.id,
                name: 'Mon premier réseau'
              }
            });
          }

          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
}

// Configuration GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/github/callback'
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          let user = await prisma.user.findUnique({
            where: {
              provider_providerId: {
                provider: 'github',
                providerId: profile.id
              }
            }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                username: profile.username,
                email: profile.emails?.[0]?.value,
                provider: 'github',
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value
              }
            });

            // Créer un réseau par défaut
            await prisma.network.create({
              data: {
                userId: user.id,
                name: 'Mon premier réseau'
              }
            });
          }

          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );
}

export { passport };

