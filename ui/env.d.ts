/// <reference types="unplugin-icons/types/vue" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "vue" {
  interface ComponentCustomProperties {
    $formkit: any;
  }
}
