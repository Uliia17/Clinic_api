import path from "node:path";

export const formatAvatarPath = (avatar?: string): string => {
    return avatar ? `/media/${path.basename(avatar)}` : "";
};
