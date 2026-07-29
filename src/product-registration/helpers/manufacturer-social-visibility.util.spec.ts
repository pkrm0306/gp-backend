import {
  isManufacturerSocialVisibleOnWebsite,
  pickManufacturerSocialLinksForWebsite,
  resolveManufacturerSocialVisibility,
} from './manufacturer-social-visibility.util';

describe('manufacturer-social-visibility.util', () => {
  it('defaults missing flags to visible (true)', () => {
    expect(resolveManufacturerSocialVisibility(undefined)).toEqual({
      showWebsiteOnWebsite: true,
      showFacebookOnWebsite: true,
      showYoutubeOnWebsite: true,
      showTwitterOnWebsite: true,
      showLinkedinOnWebsite: true,
    });
  });

  it('treats explicit false as hidden', () => {
    const flags = resolveManufacturerSocialVisibility({
      showFacebookOnWebsite: false,
      showLinkedinOnWebsite: true,
    });
    expect(flags.showFacebookOnWebsite).toBe(false);
    expect(flags.showLinkedinOnWebsite).toBe(true);
    expect(flags.showYoutubeOnWebsite).toBe(true);
  });

  it('treats string/number off values as hidden', () => {
    expect(isManufacturerSocialVisibleOnWebsite('false')).toBe(false);
    expect(isManufacturerSocialVisibleOnWebsite('0')).toBe(false);
    expect(isManufacturerSocialVisibleOnWebsite(0)).toBe(false);
    expect(isManufacturerSocialVisibleOnWebsite('off')).toBe(false);
    expect(isManufacturerSocialVisibleOnWebsite('true')).toBe(true);
    expect(isManufacturerSocialVisibleOnWebsite(1)).toBe(true);
  });

  it('pickManufacturerSocialLinksForWebsite omits disabled and empty URLs', () => {
    const links = pickManufacturerSocialLinksForWebsite(
      {
        facebook: 'https://facebook.com/example',
        youtube: 'https://youtube.com/@example',
        twitter: '   ',
        linkedin: 'https://linkedin.com/company/example',
      },
      {
        showFacebookOnWebsite: false,
        showYoutubeOnWebsite: true,
        showTwitterOnWebsite: true,
        showLinkedinOnWebsite: true,
      },
    );

    expect(links).toEqual({
      youtube: 'https://youtube.com/@example',
      youtubeUrl: 'https://youtube.com/@example',
      linkedin: 'https://linkedin.com/company/example',
      linkedinUrl: 'https://linkedin.com/company/example',
    });
    expect(links.facebook).toBeUndefined();
    expect(links.twitter).toBeUndefined();
  });
});
