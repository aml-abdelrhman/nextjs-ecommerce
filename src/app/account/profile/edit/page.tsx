"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/styles/EditProfilePage.scss";

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(5).max(30).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/profile", { credentials: "include" });
        const json = await res.json();
        if (res.ok) {
          setValue("name", json.user.name || "");
          setValue("phone", json.user.phone || "");
          setAvatarPreview(json.user.avatarUrl || null);
        } else {
          toast.error(json.error || "Failed to load profile");
        }
      } catch {
        toast.error("Network error");
      }
    })();
  }, [setValue]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function onSubmit(data: ProfileForm) {
    setLoading(true);
    try {
      let avatarBase64: string | null = null;
      if (avatarFile) {
        const reader = new FileReader();
        avatarBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });
      }

      const body = { ...data, ...(avatarBase64 && { avatarBase64 }) };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) return toast.error(json.error || "Update failed");

      toast.success("Profile updated");
      router.push("/account/profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="edit-profile-wrapper">
      <h1 className="edit-profile-heading">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
        <div className="edit-profile-avatarSection">
          <div className="edit-profile-avatarPreview">
            {avatarPreview ? (
              <Image src={avatarPreview} alt="avatar" width={80} height={80} className="edit-profile-avatarImage" />
            ) : (
              <div className="edit-profile-noImage">No Image</div>
            )}
          </div>
          <div>
            <label className="edit-profile-label">Change avatar</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="edit-profile-field">
          <label className="edit-profile-label">Full name</label>
          <input type="text" {...register("name")} className="edit-profile-input" />
        </div>

        <div className="edit-profile-field">
          <label className="edit-profile-label">Phone</label>
          <input type="text" {...register("phone")} className="edit-profile-input" />
        </div>

        <div className="edit-profile-actions">
          <button type="submit" disabled={loading} className="btnPrimary">
            {loading ? "Saving..." : "Save"}
          </button>
          <a href="/account/profile" className="btnOutline">Cancel</a>
        </div>
      </form>
    </div>
  );
}
