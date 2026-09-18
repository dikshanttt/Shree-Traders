import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, locale: "en" | "ne" = "en"): string {
  if (locale === "ne") {
    // Nepali digits
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    const formatted = Math.round(amount).toLocaleString("en-IN");
    const nepaliFormatted = formatted
      .split("")
      .map((char) => {
        const digit = parseInt(char, 10);
        return isNaN(digit) ? char : nepaliDigits[digit];
      })
      .join("");
    return `रू ${nepaliFormatted}`;
  }
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatDate(dateInput: string | Date, locale: "en" | "ne" = "en"): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString(locale === "ne" ? "ne-NP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
