const POST_CREATED_EVENT = "post:created";

export const emitPostCreated = (post) => {
  if (typeof window === "undefined" || !post) return;

  window.dispatchEvent(
    new CustomEvent(POST_CREATED_EVENT, { detail: { post } })
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
