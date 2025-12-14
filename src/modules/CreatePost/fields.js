import * as yup from "yup";

export const defaultValues = {
  image: null,
  comment: "",
};

export const fields = {
  image: {
    name: "image",
    type: "file",
    accept: "image/*",
  },
  comment: {
    name: "comment",
    type: "text",
    placeholder: "Input comment text there...",
  },
};

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const createPostSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("A file is required")
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return false;
      return SUPPORTED_FORMATS.includes(value.type);
    }),
  comment: yup.string().max(2200, "Comment is too long"),
});
