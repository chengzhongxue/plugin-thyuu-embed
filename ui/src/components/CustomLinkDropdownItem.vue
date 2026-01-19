<script lang="ts" setup>
import { VButton, VDropdown, VDropdownItem } from "@halo-dev/components";
import { useTemplateRef } from "vue";
import {setFocus} from "@/utils/focus";

defineProps<{
  url?: string;
}>();

const emit = defineEmits<{
  (event: "submit", url: string): void;
}>();

const dropdown = useTemplateRef<InstanceType<typeof VDropdown>>("dropdown");

function onSubmit({ value }: { value: string }) {
  emit("submit", value.trim());
  dropdown.value?.hide();
}

function onDropdownShown() {
  setTimeout(() => {
    setFocus("url");
  }, 100);
}
</script>
<template>
  <VDropdown ref="dropdown" @show="onDropdownShown">
    <VDropdownItem>
      输入链接
    </VDropdownItem>
    <template #popper>
      <div class=":uno: w-96">
        <FormKit
          id="custom-link-form"
          type="form"
          ignore
          name="custom-link-form"
          @submit="onSubmit"
        >
          <FormKit
            id="url"
            type="text"
            :model-value="url"
            name="value"
            validation="required"
            validation-label="URL"
          />
        </FormKit>
        <div class=":uno: mt-4">
          <VButton
            type="secondary"
            @click="$formkit.submit('custom-link-form')"
          >
            保存
          </VButton>
        </div>
      </div>
    </template>
  </VDropdown>
</template>
