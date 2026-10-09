import * as bg from "@bgord/bun";
import * as VO from "+preferences/value-objects";

class ProfileAvatarConstraintsError extends Error {}

type ProfileAvatarConstraintsConfigType = bg.ImageInfoType;

class ProfileAvatarConstraintsFactory extends bg.Invariant<ProfileAvatarConstraintsConfigType> {
  passes(config: ProfileAvatarConstraintsConfigType) {
    if (config.height > VO.ProfileAvatar.MaxSide) return false;
    if (config.width > VO.ProfileAvatar.MaxSide) return false;
    if (config.size.isGreaterThan(VO.ProfileAvatar.MaxSize)) return false;
    return VO.ProfileAvatar.MimeRegistry.hasMime(config.mime);
  }

  message = "profile.avatar.constraints";
  error = ProfileAvatarConstraintsError;
  kind = bg.InvariantFailureKind.precondition;
}

export const ProfileAvatarConstraints = new ProfileAvatarConstraintsFactory();
