"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/profile";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = ProfileUpdateInput & { name?: string; bio?: string };

export function ProfileEditForm({
  defaultValues,
}: {
  defaultValues: { name: string; bio: string; image: string };
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(defaultValues.image);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: defaultValues.name,
      bio: defaultValues.bio,
      image: defaultValues.image,
    },
  });

  async function onSubmit(data: FormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name ?? undefined,
          bio: data.bio ?? undefined,
          image: imageUrl || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setSubmitError(json.error ?? "Failed to update");
        return;
      }
      router.push("/profile");
      router.refresh();
    } catch {
      setSubmitError("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label>Profile image</Label>
        <div className="flex items-center gap-4">
          {imageUrl ?
            <Image
              src={imageUrl}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          : <div className="h-20 w-20 rounded-full bg-muted" />}
          <UploadButton
            endpoint="profileImage"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                setImageUrl(res[0].url);
                setValue("image", res[0].url);
              }
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          {...register("bio")}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Tell us about yourself"
        />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>
      {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
