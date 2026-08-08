// Infers whether an image should be object-fit: contain (never crop, used
// for logos/identity/documents) or cover (photographs, where cropping to
// fill is fine). Explicit `fit` always wins. Otherwise inferred from the
// media `type` field, or for archive thumbs (which have no type field) from
// the group label, since "Identity" / "Logo exploration" / "Logo variants"
// groups reliably signal logo content across every Work item's archive.
// PRD "P2 UI/UX Remediation" section 11: the old single aspect-video +
// object-cover rule cropped logo artwork, this replaces it.
const CONTAIN_LABEL_PATTERN = /logo|identity|guideline|brand/i;

export function getMediaFit(explicit: 'contain' | 'cover' | undefined, type: string | undefined): 'contain' | 'cover' {
  if (explicit) return explicit;
  if (type === 'logo' || type === 'document' || type === 'dashboard' || type === 'screenshot') return 'contain';
  return 'cover';
}

export function getThumbFit(explicit: 'contain' | 'cover' | undefined, groupLabel: string): 'contain' | 'cover' {
  if (explicit) return explicit;
  return CONTAIN_LABEL_PATTERN.test(groupLabel) ? 'contain' : 'cover';
}
