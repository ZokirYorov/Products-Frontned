<template>
  <div class="menu-item" @click.stop="toggle">
    <div class="menu-item__row hover:bg-gray-100 text-gray-600 border-b-2 border-gray-100" :class="{ 'menu-item__row--active bg-blue-50': isOpen }">
      <span class="text-md font-semibold p-1">{{ item.name }}</span>
      <svg
          v-if="item.children?.length"
          :style="{ transform: isOpen ? 'rotate(90deg)' : 'none' }"
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span v-else-if="!item.children?.length && isSelected" class="font-semibold menu-item__badge">✓</span>
    </div>

    <transition name="slide">
      <div v-if="isOpen && item.children?.length" class="text-gray-600 mb-1 text-sm menu-item__children">
        <MenuItem
            v-for="child in item.children"
            :key="child.name"
            :item="child"
            :selected="selected"
            :depth="depth + 1"
            @select="$emit('select', $event)"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'


interface MenuNode {
  name: string;
  link?: string;
  children?: MenuNode[];
}

const props = defineProps<{
  item: MenuNode;
  selected: MenuNode | null;
  depth?: number
}>()

const isSelected = computed(() => {
  return props.selected?.name === props.item?.name
})

const depth = computed(() => props.depth ?? 0 )

const emit = defineEmits<{
  select: [item: MenuNode]
}>()

const isOpen = ref(false)

const toggle = () => {
  if (props.item.children?.length) {
    isOpen.value = !isOpen.value
  } else if (props.item.link) {
    emit('select', props.item)
  }
}

</script>

<style scoped>
.menu-item { width: 100%; }

.menu-item__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
}
.menu-item__row--active {
  color: #4F46E5;
  font-weight: 600;
}
.menu-item__row svg { transition: transform 0.2s; flex-shrink: 0; }

.menu-item__badge {
  font-size: 11px;
  background: #D1FAE5;

  padding: 2px 6px;
  border-radius: 20px;
}

.menu-item__children {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 2px solid #E5E7EB;
  margin-top: 2px;
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>