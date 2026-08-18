import type { Metadata } from "next";
import { getAdminNewsletterSubscribers } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NewsletterSubscriberList } from "@/components/admin/newsletter-subscriber-list";

export const metadata: Metadata = { title: "Newsletter — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await getAdminNewsletterSubscribers();

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description={`${subscribers.length} subscritor${subscribers.length === 1 ? "" : "es"} no total.`}
      />
      <NewsletterSubscriberList subscribers={subscribers} />
    </div>
  );
}
