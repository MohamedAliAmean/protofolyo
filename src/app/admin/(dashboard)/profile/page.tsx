import { requireAdmin } from "@/lib/admin-auth";
import { getPortfolioData } from "@/lib/portfolio-data";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  await requireAdmin();
  const data = await getPortfolioData();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-navy-deep">
        About & Profile Image
      </h1>
      <p className="mt-2 text-ink-muted">
        Update your bio, contact info, and profile photo.
      </p>
      <div className="mt-8">
        <ProfileForm profile={data.profile} />
      </div>
    </div>
  );
}
