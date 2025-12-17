const POST_CREATED_EVENT = "post:created";
const POST_DELETED_EVENT = "post:deleted";

export const emitPostCreated = (post) => {
  if (typeof window === "undefined" || !post) return;

  window.dispatchEvent(
    new CustomEvent(POST_CREATED_EVENT, { detail: { post } })
  );
};

export const emitPostDeleted = (post) => {
  if (typeof window === "undefined" || !post) return;

  window.dispatchEvent(
    new CustomEvent(POST_DELETED_EVENT, { detail: { post } })
  );
};

export const subscribeToPostCreated = (listener) => {
  if (typeof window === "undefined" || typeof listener !== "function") {
    return () => {};
  }

  const handler = (event) => {
    const createdPost = event?.detail?.post;
    if (createdPost) listener(createdPost);
  };

  window.addEventListener(POST_CREATED_EVENT, handler);

  return () => window.removeEventListener(POST_CREATED_EVENT, handler);
};

export const subscribeToPostDeleted = (listener) => {
  if (typeof window === "undefined" || typeof listener !== "function") {
    return () => {};
  }

  const handler = (event) => {
    const deletedPost = event?.detail?.post;
    if (deletedPost) listener(deletedPost);
  };

  window.addEventListener(POST_DELETED_EVENT, handler);

  return () => window.removeEventListener(POST_DELETED_EVENT, handler);
};
