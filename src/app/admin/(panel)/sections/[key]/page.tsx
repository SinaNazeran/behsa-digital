import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { PageTitle } from "@/components/admin/ui";
import { btnCls } from "@/components/admin/styles";
import { SECTION_BY_KEY } from "@/content/sections";
import { listMediaOptions, loadSectionForAdmin } from "@/lib/admin-data";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props) {
  const { key } = await params;
  return { title: SECTION_BY_KEY[key]?.label ?? "بخش" };
}

export default async function SectionAdmin({ params }: Props) {
  const { key } = await params;
  const def = SECTION_BY_KEY[key];
  if (!def) notFound();

  const [{ section, items }, media] = await Promise.all([loadSectionForAdmin(key), listMediaOptions()]);

  return (
    <>
      <PageTitle
        title={def.label}
        lead={def.hint}
        actions={<Link href="/admin/sections" className={btnCls("ghost")}>همهٔ بخش‌ها</Link>}
      />
      <SectionEditor def={def} section={section} items={items} media={media} />
    </>
  );
}
