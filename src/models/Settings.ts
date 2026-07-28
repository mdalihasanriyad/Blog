import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string;
  favicon: string;
  defaultOgImage: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  seo: {
    googleSiteVerification?: string;
    bingSiteVerification?: string;
    gaMeasurementId?: string;
    gtmId?: string;
    clarityId?: string;
  };
  ads: {
    enabled: boolean;
    adsenseClientId?: string;
    slots: {
      header?: string;
      sidebar?: string;
      inArticle?: string;
      footer?: string;
      stickyMobile?: string;
    };
  };
  organization: {
    name?: string;
    logo?: string;
    foundingDate?: string;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: 'My Blog' },
    siteDescription: { type: String, default: '' },
    siteUrl: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    defaultOgImage: { type: String, default: '' },
    socialLinks: {
      twitter: String,
      facebook: String,
      instagram: String,
      linkedin: String,
      youtube: String,
      github: String,
    },
    seo: {
      googleSiteVerification: String,
      bingSiteVerification: String,
      gaMeasurementId: String,
      gtmId: String,
      clarityId: String,
    },
    ads: {
      enabled: { type: Boolean, default: false },
      adsenseClientId: String,
      slots: {
        header: String,
        sidebar: String,
        inArticle: String,
        footer: String,
        stickyMobile: String,
      },
    },
    organization: {
      name: String,
      logo: String,
      foundingDate: String,
    },
  },
  { timestamps: true },
);

const Settings: Model<ISettings> = models.Settings || model<ISettings>('Settings', SettingsSchema);
export default Settings;
