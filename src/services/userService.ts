import { getUserCollection } from "@/models/User";
import { hashPassword, comparePassword } from "@/lib/auth";

// 🔹 Get user by email
export async function getUserByEmail(email: string) {
  const users = await getUserCollection();
  return users.findOne({ email });
}

// 🔹 Create user (signup)
export async function createCredentialsUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const users = await getUserCollection();

  const existing = await users.findOne({ email: data.email });
  if (existing) {
    return { ok: false, error: "User already exists", status: 400 };
  }

  const passwordHash = await hashPassword(data.password);

  const result = await users.insertOne({
    email: data.email,
    name: data.name,
    passwordHash,
    provider: "credentials",
    createdAt: new Date(),
  });

  return {
    ok: true,
    user: {
      id: result.insertedId.toString(),
      email: data.email,
      name: data.name,
    },
  };
}

// 🔹 Verify login
export async function verifyCredentials(data: {
  email: string;
  password: string;
}) {
  const users = await getUserCollection();

  const user = await users.findOne({ email: data.email });

  if (!user || !user.passwordHash) {
    return { ok: false, error: "Invalid credentials", status: 401 };
  }

  const isValid = await comparePassword(data.password, user.passwordHash);

  if (!isValid) {
    return { ok: false, error: "Invalid credentials", status: 401 };
  }

  return {
    ok: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
    },
  };
}

// 🔹 Google login
export async function upsertGoogleUser(data: {
  email: string;
  googleId: string;
  name?: string;
  image?: string;
}) {
  const users = await getUserCollection();

  const existing = await users.findOne({ email: data.email });

  if (existing) return existing;

  const result = await users.insertOne({
    email: data.email,
    googleId: data.googleId,
    name: data.name,
    image: data.image,
    provider: "google",
    createdAt: new Date(),
  });

  return result;
}