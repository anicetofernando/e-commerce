import { Container } from "@/components/ui/container";
import { AccountNav } from "@/components/account/account-nav";
import { EmailVerifyBanner } from "@/components/account/email-verify-banner";
import { requireUser } from "@/lib/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <Container className="py-10">
      {!user.emailVerified && <EmailVerifyBanner />}
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountNav />
        <div>{children}</div>
      </div>
    </Container>
  );
}
