<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 h-screen flex flex-col">
    <div class="flex-grow lg:max-w-2/3 lg:min-w-1/3 xl:mx-auto">
      <router-view />
    </div>
    <div>
      <Footer />
    </div>
  </main>
</template>
