import dotenv from 'dotenv';
dotenv.config();

const url = process.env.URL;

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "File not found" });
  }
  const imageUrl = `${url}/file/${req.file.filename}`;
  return res.status(200).json({ imageUrl });
};
