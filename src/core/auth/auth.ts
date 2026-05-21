import { prisma } from "@/core/db/prisma";
import { consumeRateLimit, getClientIp } from "@/core/security/rate-limit";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { authConfig } from "./auth-config";

class LoginRateLimited extends CredentialsSignin {
  code = "rate_limit";
}

function getPasswordPepper() {
  const pepper = process.env.PASSWORD_PEPPER ?? "";
  if (process.env.NODE_ENV === "production" && pepper.length === 0) {
    throw new Error("PASSWORD_PEPPER não definido.");
  }
  return pepper;
}

function getPasswordPepperCandidates() {
  const current = getPasswordPepper();
  const previousRaw = process.env.PASSWORD_PEPPER_PREVIOUS ?? "";
  const previous = previousRaw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return {
    current,
    all: [current, ...previous],
  };
}

function getBcryptRounds() {
  const raw = process.env.BCRYPT_ROUNDS;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(parsed) && parsed >= 10 && parsed <= 20) {
    return parsed;
  }
  return process.env.NODE_ENV === "production" ? 14 : 10;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          await sleep(250);
          return null;
        }

        const email = normalizeEmail(credentials.email as string);
        const ip = await getClientIp();

        const ipLimit = await consumeRateLimit({
          key: `login:ip:${ip}`,
          limit: 20,
          windowMs: 15 * 60 * 1000,
        });

        if (!ipLimit.allowed) {
          await sleep(250);
          throw new LoginRateLimited();
        }

        const emailLimit = await consumeRateLimit({
          key: `login:email:${email}`,
          limit: 10,
          windowMs: 15 * 60 * 1000,
        });

        if (!emailLimit.allowed) {
          await sleep(250);
          throw new LoginRateLimited();
        }
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          await sleep(250);
          return null;
        }

        const passwordValue = credentials.password as string;
        const peppers = getPasswordPepperCandidates();
        let matchedPepper: string | null = null;

        for (const pepper of peppers.all) {
          const matches = await bcrypt.compare(`${passwordValue}${pepper}`, user.password);
          if (matches) {
            matchedPepper = pepper;
            break;
          }
        }

        if (matchedPepper) {
          if (matchedPepper !== peppers.current) {
            const upgradedHash = await bcrypt.hash(
              `${passwordValue}${peppers.current}`,
              getBcryptRounds()
            );
            await prisma.user.update({
              where: { id: user.id },
              data: { password: upgradedHash },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }

        {
          const legacyValid = await bcrypt.compare(passwordValue, user.password);
          if (!legacyValid) {
            await sleep(250);
            return null;
          }

          const upgradedHash = await bcrypt.hash(
            `${passwordValue}${peppers.current}`,
            getBcryptRounds()
          );
          await prisma.user.update({
            where: { id: user.id },
            data: { password: upgradedHash },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
      },
    }),
  ],
});
