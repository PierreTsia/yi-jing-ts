<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 h-screen flex flex-col">
    <div class="flex-grow lg:max-w-2/3 xl:max-w-2/5 lg:mx-auto">
      <router-view />
    </div>
    <div>
      <Footer />
    </div>
  </main>
</template>
