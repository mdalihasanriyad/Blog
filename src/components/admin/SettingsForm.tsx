'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateSiteSettings } from '@/actions/moderation.actions';

interface SettingsFormProps {
  initial: Record<string, any>;
}

const inputClass =
  'w-full rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm dark:border-ink-600 dark:bg-ink-800 dark:text-paper';
const labelClass = 'mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100';

export default function SettingsForm({ initial }: SettingsFormProps) {
  const [form, setForm] = useState(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (path: string, value: unknown) => {
    setForm((prev: any) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await updateSiteSettings(form);
    setIsSubmitting(false);
    if (result.success) toast.success('Settings saved');
    else toast.error(result.error);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
      <fieldset className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
        <legend className="px-1 font-mono text-xs uppercase tracking-widest text-ink-400">Branding</legend>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Site name</label>
            <input value={form.siteName ?? ''} onChange={(e) => update('siteName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Site description</label>
            <textarea rows={2} value={form.siteDescription ?? ''} onChange={(e) => update('siteDescription', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Logo URL</label>
            <input value={form.logo ?? ''} onChange={(e) => update('logo', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Favicon URL</label>
            <input value={form.favicon ?? ''} onChange={(e) => update('favicon', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
        <legend className="px-1 font-mono text-xs uppercase tracking-widest text-ink-400">SEO & Analytics</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Google Site Verification</label>
            <input value={form.seo?.googleSiteVerification ?? ''} onChange={(e) => update('seo.googleSiteVerification', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bing Site Verification</label>
            <input value={form.seo?.bingSiteVerification ?? ''} onChange={(e) => update('seo.bingSiteVerification', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>GA4 Measurement ID</label>
            <input value={form.seo?.gaMeasurementId ?? ''} onChange={(e) => update('seo.gaMeasurementId', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>GTM ID</label>
            <input value={form.seo?.gtmId ?? ''} onChange={(e) => update('seo.gtmId', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Microsoft Clarity ID</label>
            <input value={form.seo?.clarityId ?? ''} onChange={(e) => update('seo.clarityId', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
        <legend className="px-1 font-mono text-xs uppercase tracking-widest text-ink-400">AdSense</legend>
        <label className="mb-4 flex items-center gap-2 font-body text-sm text-ink-700 dark:text-ink-100">
          <input type="checkbox" checked={!!form.ads?.enabled} onChange={(e) => update('ads.enabled', e.target.checked)} className="rounded border-ink-300" />
          Ads enabled site-wide
        </label>
        <div>
          <label className={labelClass}>AdSense Client ID</label>
          <input value={form.ads?.adsenseClientId ?? ''} onChange={(e) => update('ads.adsenseClientId', e.target.value)} className={inputClass} placeholder="ca-pub-xxxxxxxxxxxxxxxx" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(['header', 'sidebar', 'inArticle', 'footer', 'stickyMobile'] as const).map((slot) => (
            <div key={slot}>
              <label className={labelClass}>{slot} slot ID</label>
              <input
                value={form.ads?.slots?.[slot] ?? ''}
                onChange={(e) => update(`ads.slots.${slot}`, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
        <legend className="px-1 font-mono text-xs uppercase tracking-widest text-ink-400">Social links</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'github'] as const).map((platform) => (
            <div key={platform}>
              <label className={labelClass}>{platform}</label>
              <input
                value={form.socialLinks?.[platform] ?? ''}
                onChange={(e) => update(`socialLinks.${platform}`, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-ink-800 px-5 py-2.5 font-body text-sm font-medium text-paper
          hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
      >
        {isSubmitting ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
