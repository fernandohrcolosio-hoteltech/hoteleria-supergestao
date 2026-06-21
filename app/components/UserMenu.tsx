"use client";

import { signOut } from "@/app/actions/auth";
import { useState } from "react";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ backgroundColor: "var(--gold-pale)", color: "var(--navy)" }}
      >
        {email}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
          style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}
        >
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            style={{ color: "var(--text-main)" }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
