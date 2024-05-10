export const s3Service = {
  uploadApplicationFile: async () => 'john_doe_12453253252',
  getApplicationFile: async () => {
    return { data: [23, 43, 51], contentType: 'application/pdf' };
  },
  deleteApplicationFileL: async () => {},
  uploadImageFile: async () =>
    'https://${this.imageBucket}.s3.${this.region}.amazonaws.com/${key}',
  deleteImageFile: async () => {},
};
