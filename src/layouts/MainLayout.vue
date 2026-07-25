<script setup>
import AppNav from 'src/components/registration/AppNav.vue'
import { event } from 'src/mocks/event.js'
</script>

<template>
  <q-layout view="hHh lpR fFf" class="h-screen overflow-hidden bg-surface-l0 text-neutral">
    <q-page-container class="h-screen">
      <q-page class="flex flex-col h-screen min-h-0 p-0">
        <AppNav :title="event.name" />
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
