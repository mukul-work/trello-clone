import { NextResponse } from "next/server";
import { z } from "zod";
import { createCredentialsUser } from "@/services/userService";
import { generateToken } from "@/lib/auth";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await createCredentialsUser(parsed.data);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
    });

    return NextResponse.json({ user: result.user, token });
  } catch (error) {
    const message = getErrorMessage(error);
    const isConfigError = message.includes("JWT_SECRET missing");

    console.error("/api/auth/signup error:", message);

    return NextResponse.json(
      { error: isConfigError ? message : "Internal server error" },
      { status: 500 },
    );
  }
}
