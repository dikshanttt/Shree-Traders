"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    // Store secure cookie session
    const cookieStore = await cookies();
    cookieStore.set("shree_auth_session", JSON.stringify(authUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: authUser };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message || "Failed to log in" };
  }
}

export async function registerAction(formData: FormData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string)?.trim();
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required" };
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const cookieStore = await cookies();
    cookieStore.set("shree_auth_session", JSON.stringify(authUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: authUser };
  } catch (error: any) {
    console.error("Register error:", error);
    return { success: false, error: error.message || "Failed to create account" };
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shree_auth_session");
    if (!sessionCookie?.value) return null;
    return JSON.parse(sessionCookie.value) as AuthUser;
  } catch (e) {
    return null;
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("shree_auth_session");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
