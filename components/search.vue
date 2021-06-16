<template>
  <div class="w-full">
    <div class="rounded relative w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="text-gray-500 absolute ml-4 top-0 bottom-0 m-auto icon icon-tabler icon-tabler-search"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <circle cx="10" cy="10" r="7"></circle>
        <line x1="21" y1="21" x2="15" y2="15"></line>
      </svg>
      <input
        v-model="query"
        class="
          border border-gray-100
          focus:outline-none focus:border-brand
          rounded-full
          w-full
          text-sm
          bg-gray-100
          text-gray-500
          pl-12
          sm:pl-10
          md:pl-12
          py-3
          pr-4
        "
        type="text"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'Search'
})
export default class Search extends Vue {
  @VModel({ type: String }) query!: string;
  @Prop({ type: String, required: false, default: 'Search' }) placeholder!: string;
}
</script>
