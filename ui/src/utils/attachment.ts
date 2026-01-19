import type { AttachmentLike } from "@halo-dev/ui-shared";

export interface AttachmentAttr {
  url?: string;
  name?: string;
}

export function getAttachmentUrl(attachment: AttachmentLike): AttachmentAttr {
  let permalink: string | undefined = undefined;
  let displayName: string | undefined = undefined;
  if (typeof attachment === "string") {
    permalink = attachment;
  } else if ("url" in attachment) {
    permalink = attachment.url;
  } else if ("spec" in attachment) {
    permalink = attachment.status?.permalink;
    displayName = attachment.spec.displayName;
  }

  return {
    url: permalink,
    name: displayName,
  };
}
