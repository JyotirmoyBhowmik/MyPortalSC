import { getAllCertifications } from "@/lib/data/certifications";
import CertificationsManager from "@/components/admin/CertificationsManager";

export default async function AdminCertificationsPage() {
    const certifications = await getAllCertifications();
    return <CertificationsManager certifications={certifications} />;
}
