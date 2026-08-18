import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/account/profile-form";

export const metadata: Metadata = { title: "O Meu Perfil" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">O Meu Perfil</h1>
      <ProfileForm name={user.name} email={user.email} phone={user.phone} company={user.company} taxId={user.taxId} />
    </div>
  );
}
