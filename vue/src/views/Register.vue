<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Alert from '../components/Alert.vue'

const store = useStore()
const router = useRouter()

const user = {
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
}
const loading = ref(false)
const errorMsg = ref({})

const closeErrorMsg = () => errorMsg.value = {}

const register = () => {
  loading.value = true

  store.dispatch('register', user)
    .then(res => {
      loading.value = false
      router.push({ name: 'Dashboard' })
    })
    .catch(err => {
      loading.value = false

      if (err.response.status === 422) {
        errorMsg.value = err.response.data.errors
      }
    })
}
</script>

<template>
  <div>
    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
      Register for free
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Or
      <router-link :to="{ name: 'Login' }" class="font-medium text-indigo-600 hover:text-indigo-500">
        login to your account
      </router-link>
    </p>
  </div>
  <form class="mt-8 space-y-6" @submit.prevent="register">
    <Alert v-if="Object.keys(errorMsg).length" class="flex justify-between">
      <div class="flex-col items-stretch text-sm text-left">
        <div v-for="(field, index) of Object.keys(errorMsg)" :key="index">
          <div v-for="(err, i) of errorMsg[field] || []" :key="i">
            * {{ err }}
          </div>
        </div>
      </div>
      <button @click="closeErrorMsg" class="grow ml-2 min-w-8 h-8 flex items-center justify-center rounded-full border-none transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.2)] focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </Alert>
    <div class="-space-y-px rounded-md shadow-sm">
      <div>
        <label for="fullname" class="sr-only">Full name</label>
        <input id="fullname" name="name" type="text" autocomplete="name" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Full name" v-model="user.name">
      </div>
      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input id="email-address" name="email" type="email" autocomplete="email" required class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address" v-model="user.email">
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password" v-model="user.password">
      </div>
      <div>
        <label for="password_confirmation" class="sr-only">Password confirmation</label>
        <input id="password_confirmation" name="password_confirmation" type="password" autocomplete="current-password" required class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password confirmation" v-model="user.password_confirmation">
      </div>
    </div>

    <div>
      <button
        :disabled="loading"
        type="submit"
        class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :class="{ 'cursor-not-allowed': loading, 'hover:bg-indigo-500': loading }"
      >
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <!-- Heroicon name: mini/lock-closed -->
          <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
          </svg>
        </span>
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Register
      </button>
    </div>
  </form>
</template>

<style scoped>

.grow {
  min-width: 32px;
  flex-grow: 1 !important;
}
</style>
