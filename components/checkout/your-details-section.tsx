"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface YourDetailsSectionProps {
  name: string;
  phone: string;
  email: string;
  saveDetails: boolean;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSaveDetailsChange: (value: boolean) => void;
}

export function YourDetailsSection({
  name,
  phone,
  email,
  saveDetails,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onSaveDetailsChange,
}: YourDetailsSectionProps) {
  return (
    <div className="mb-0 -mt-1.5">
      <h2 className="text-lg font-bold text-foreground mb-1 font-serif">Your Details</h2>

      <div className="mt-0 space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+32 123 456 789"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="mt-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="mt-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => onSaveDetailsChange(!saveDetails)}
            className="flex-shrink-0"
          >
            <div
              className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                saveDetails
                  ? "border-primary bg-primary"
                  : "border-border bg-secondary"
              }`}
            >
              {saveDetails && (
                <svg
                  className="h-full w-full text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
          <Label htmlFor="save-details" className="text-sm text-foreground cursor-pointer" onClick={() => onSaveDetailsChange(!saveDetails)}>
            Save my details for next time
          </Label>
        </div>
      </div>

      <div className="h-px bg-border mt-5 mb-3" />
    </div>
  );
}
