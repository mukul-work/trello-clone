import { ObjectId } from "mongodb";
import { getUserCollection } from "@/models/User";
import { comparePassword, hashPassword } from "@/lib/auth";

type AuthProvider = "credentials" | "google";

export type PublicUser = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  provider?: AuthProvider;
};

type DbUser = {
  _id: ObjectId;
  email: string;
  name?: string;
  image?: string;
  provider?: AuthProvider;
  googleId?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt?: Date;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toPublicUser(user: DbUser): PublicUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image,
    provider: user.provider,
  };
}

export async function getUserByEmail(email: string) {
  const users = await getUserCollection();
  const normalizedEmail = normalizeEmail(email);

  return users.findOne<DbUser>({ email: normalizedEmail });
}

export async function createCredentialsUser(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const users = await getUserCollection();

  const normalizedEmail = normalizeEmail(input.email);
  const existing = await users.findOne<DbUser>({ email: normalizedEmail });
  if (existing) {
    return {
      ok: false as const,
      status: 409 as const,
      error: "User already exists",
    };
  }

  const passwordHash = await hashPassword(input.password);
  const createdAt = new Date();

  const result = await users.insertOne({
    email: normalizedEmail,
    name: input.name,
    provider: "credentials" satisfies AuthProvider,
    passwordHash,
    createdAt,
  });

  return {
    ok: true as const,
    user: {
      id: result.insertedId.toString(),
      email: normalizedEmail,
      name: input.name,
      provider: "credentials" as const,
    },
  };
}

export async function verifyCredentials(input: {
  email: string;
  password: string;
}) {
  const users = await getUserCollection();
  const normalizedEmail = normalizeEmail(input.email);

  const user = await users.findOne<DbUser>({ email: normalizedEmail });
  if (!user || !user.passwordHash) {
    return {
      ok: false as const,
      status: 401 as const,
      error: "Invalid credentials",
    };
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    return {
      ok: false as const,
      status: 401 as const,
      error: "Invalid credentials",
    };
  }

  return { ok: true as const, user: toPublicUser(user) };
}

export async function upsertGoogleUser(input: {
  email: string;
  googleId: string;
  name?: string;
  image?: string;
}) {
  const users = await getUserCollection();
  const normalizedEmail = normalizeEmail(input.email);

  const existing = await users.findOne<DbUser>({ email: normalizedEmail });
  const now = new Date();

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          provider: "google" satisfies AuthProvider,
          googleId: input.googleId,
          name: input.name ?? existing.name,
          image: input.image ?? existing.image,
          updatedAt: now,
        },
      },
    );

    return toPublicUser({
      ...existing,
      provider: "google",
      googleId: input.googleId,
      name: input.name ?? existing.name,
      image: input.image ?? existing.image,
      updatedAt: now,
    });
  }

  const createdAt = now;

  const result = await users.insertOne({
    email: normalizedEmail,
    provider: "google" satisfies AuthProvider,
    googleId: input.googleId,
    name: input.name,
    image: input.image,
    createdAt,
  });

  return {
    id: result.insertedId.toString(),
    email: normalizedEmail,
    provider: "google" as const,
    name: input.name,
    image: input.image,
  };
}
