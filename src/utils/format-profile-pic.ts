export const formatProfilePic = (profilePic?: { data?: Buffer; contentType?: string } | null) =>
  profilePic?.data && profilePic.contentType
    ? `data:${profilePic.contentType};base64,${profilePic.data.toString("base64")}`
    : null;
