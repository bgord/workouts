import * as bg from "@bgord/bun";
import * as Auth from "+auth";

class CatalogIsManagedBySystemError extends Error {}

type CatalogIsManagedBySystemConfigType = { requesterId: Auth.VO.UserIdType };

class CatalogIsManagedBySystemFactory extends bg.Invariant<CatalogIsManagedBySystemConfigType> {
  passes(config: CatalogIsManagedBySystemConfigType) {
    return config.requesterId === Auth.VO.ADMIN_USER_ID;
  }

  // Stryker disable next-line StringLiteral
  message = "catalog.is.managed.by.system";
  error = CatalogIsManagedBySystemError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const CatalogIsManagedBySystem = new CatalogIsManagedBySystemFactory();
