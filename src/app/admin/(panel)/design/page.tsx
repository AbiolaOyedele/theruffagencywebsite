import { DesignEditor } from '@/components/features/admin/DesignEditor';
import { PageHeader } from '@/components/features/admin/ui';
import { TOKEN_GROUPS } from '@/config/designTokens';
import { getDesignTokens, getEffectiveTokens } from '@/lib/design/resolve';

export default async function DesignPage() {
  const [effective, overrides] = await Promise.all([getEffectiveTokens(), getDesignTokens()]);

  return (
    <>
      <PageHeader
        title="Design"
        description="Colours, typefaces, weights and shape. Each is written into the page as a custom property, so a change reaches the whole site at once — and anything untouched keeps the value in the repository."
      />
      <DesignEditor
        groups={TOKEN_GROUPS}
        effective={effective}
        overriddenKeys={Object.keys(overrides)}
      />
    </>
  );
}
