export const s3Service = {
  uploadApplicationFile: async (_file, key: string) => key,
  getApplicationFile: async () => {
    const data = new Uint8Array([21, 31, 23, 43, 51, 47, 13, 29, 44, 34, 17]);

    return { data, contentType: 'application/pdf' };
  },
  deleteApplicationFile: async () => {},
  uploadImageFile: async () =>
    'https://intern-applications-development.s3.eu-north-1.amazonaws.com/Tom_Smith_fff60921-806f-4939-9d67-ce3c75232d82',
  deleteImageFile: async () => {},
};
