export const AllowedVideoExtensions = [
  'mp4',
  'avi',
  'mov',
  'wmv',
  'flv',
  'mkv',
];

export const AllowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

export const AllowedMixEntensions = [
  ...AllowedImageExtensions,
  ...AllowedVideoExtensions,
];
