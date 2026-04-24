"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, Suspense } from "react";

function SetupForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return <p>Missing setup token. Use the link from your Discord DM.</p>;
  }

  if (submitted) {
    return <p>Profile saved! You can close this tab and go back to Discord.</p>;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/save-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: form.get("token"),
        booking_name: form.get("booking_name"),
        booking_phone: form.get("booking_phone"),
        booking_email: form.get("booking_email"),
        dietary: form.get("dietary"),
        cuisine: form.get("cuisine"),
        price_range: form.get("price_range"),
      }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Alfredo - Food Profile Setup</h1>
      <input type="hidden" name="token" value={token} />

      <p>
        Dietary restrictions (comma separated):
        <br />
        <input name="dietary" placeholder="vegetarian, gluten-free" />
      </p>

      <p>
        Cuisine preferences (comma separated):
        <br />
        <input name="cuisine" placeholder="Mexican, Japanese, Italian" />
      </p>

      <p>
        Price range:
        <br />
        <select name="price_range" defaultValue="mid">
          <option value="budget">Budget</option>
          <option value="mid">Mid</option>
          <option value="upscale">Upscale</option>
        </select>
      </p>

      <p>
        Full name (for reservations):
        <br />
        <input name="booking_name" required />
      </p>

      <p>
        Phone number (for reservations):
        <br />
        <input name="booking_phone" required />
      </p>

      <p>
        Email:
        <br />
        <input name="booking_email" type="email" required />
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Save and continue to Discord</button>
    </form>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SetupForm />
    </Suspense>
  );
}
