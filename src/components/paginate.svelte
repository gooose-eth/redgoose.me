<div class="paginate--mobile">
  <PaginateItems
    bind:page={page}
    total={total}
    size={size}
    range={3}
    url={url}
    query={query}
    on:change/>
</div>
<div class="paginate--desktop">
  <PaginateItems
    bind:page={page}
    total={total}
    size={size}
    range={10}
    url={url}
    query={query}
    on:change/>
</div>

<script>
import PaginateItems from './paginate/items.svelte'

export let page
export let total
export let size
export let url
export let query
</script>

<style lang="scss">
@use '../assets/scss/mixins';
.paginate {
  &--mobile {
    display: block;
  }
  &--desktop {
    display: none;
  }
  @include mixins.responsive(tablet) {
    &--mobile {
      display: none;
    }
    &--desktop {
      display: block;
    }
  }
}
</style>
