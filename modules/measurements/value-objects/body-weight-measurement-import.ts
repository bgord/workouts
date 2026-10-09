import * as tools from "@bgord/tools";

export class BodyWeightMeasurementImport {
  static readonly MaxSize = tools.Size.fromMB(1);
  static readonly MimeRegistry = new tools.MimeRegistry([tools.Mimes.csv]);
}
