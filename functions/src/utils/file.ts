export const getFileName = (params: {
  prefix?: string;
  userId: string;
  extension: string;
}) => {
  const { prefix, userId, extension } = params;
  const now = Date.now();
  const filename = prefix
    ? `${prefix}_${userId}_${now}.${extension}`
    : `${userId}_${now}.${extension}`;
  return filename;
};

export const validateWAVFilePath = (filename: string) => {
  const check = filename.endsWith('.wav');
  if (!check) throw new Error('please set wav file.');
};

export const validateMP3FilePath = (filename: string) => {
  const check = filename.endsWith('.mp3');
  if (!check) throw new Error('please set mp3 file.');
};
