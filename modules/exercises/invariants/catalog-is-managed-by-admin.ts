import * as bg from "@bgord/bun";
import * as Auth from "+auth";

class CatalogIsManagedByAdminError extends Error {}

type CatalogIsManagedByAdminConfigType = { requesterId: Auth.VO.UserIdType };

class CatalogIsManagedByAdminFactory extends bg.Invariant<CatalogIsManagedByAdminConfigType> {
  passes(config: CatalogIsManagedByAdminConfigType) {
    return config.requesterId === Auth.VO.ADMIN_USER_ID;
  }

  // Stryker disable next-line StringLiteral
  message = "catalog.is.managed.by.admin";
  error = CatalogIsManagedByAdminError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const CatalogIsManagedByAdmin = new CatalogIsManagedByAdminFactory();
