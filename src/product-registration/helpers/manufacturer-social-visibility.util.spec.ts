import { resolveManufacturerSocialVisibility } from './manufacturer-social-visibility.util';

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
});
