import "i18next";
import example from "./example.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof example
  }
}