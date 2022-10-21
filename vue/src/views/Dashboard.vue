<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import PageComponent from '../components/PageComponent.vue'

const store = useStore()

const loading = computed(() => store.state.dashboard.loading)
const data = computed(() => store.state.dashboard.data)

store.dispatch('getDashboardData')
</script>

<template>
  <PageComponent title="Dashboard" class="text-left">
    <div v-if="loading">
      Loading...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
      <div class="bg-white shadow-md rounded-md p-3 text-center flex flex-col animate-fade-in-down order-1 lg:order-2" style="animation-delay: 0.1s">
        <h3 class="text-2xl font-semibold"> Total Surveys </h3>
        <div class="text-8xl font-semibold flex-1 flex items-center justify-center">
          {{ data.totalSurveys }}
        </div>
      </div>
      <div class="bg-white shadow-md rounded-md p-3 text-center flex flex-col animate-fade-in-down order-2 lg:order-4" style="animation-delay: 0.2s">
        <h3 class="text-2xl font-semibold"> Total Answers </h3>
        <div class="text-8xl font-semibold flex-1 flex items-center justify-center">
          {{ data.totalAnswers }}
        </div>
      </div>
      <div class="flex flex-col justify-between row-span-2 bg-white shadow-md rounded-md p-4 animate-fade-in-down order-3 lg:order-1">
        <h3 class="text-2xl font-semibold"> Latest Survey </h3>
        <div class="grow flex items-center">
          <img :src="data.latestSurvey?.image_url" alt="" class="w-[300px] mx-auto" />
        </div>
        
        <h3 class="text-xl font-bold mb-3"> {{ data.latestSurvey?.title }} </h3>
        <div class="flex justify-between text-sm mb-1">
          <div> Create Date: </div>
          <div> {{ data.latestSurvey?.created_at }} </div>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <div> Expire Date: </div>
          <div> {{ data.latestSurvey?.expire_date }} </div>
        </div>
        <div class="flex justify-between text-sm mb-3">
          <div> Status </div>
          <div> {{ data.latestSurvey?.status ? 'Active' : 'Draft' }} </div>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <div> Questions: </div>
          <div> {{ data.latestSurvey.questions }} </div>
        </div>
        <div class="flex justify-between text-sm mb-3">
          <div> Answers: </div>
          <div> {{ data.latestSurvey.answers }} </div>
        </div>
        <div class="flex justify-between">
          <RouterLink
            :to="{ name: 'SurveyView', params: { id: data.latestSurvey?.id ?? 0 } }"
            class="flex py-2 px-4 border border-transparent text-sm rounded-md text-indigo-500 hover:bg-indigo-700 hover:text-white transition-colors focus:ring-2 focus:rinf-offset-2 focus:ring-indigo-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Edit Survey 
          </RouterLink>
          <!-- <button
            class="flex py-2 px-4 border border-transparent text-sm rounded-md text-indigo-500 hover:bg-indigo-700 hover:text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2">
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            View Answers
          </button> -->
        </div>
      </div>
      <div class="bg-white shadow-md rounded-md p-3 row-span-2 animate-fade-in-down order-4 lg:order-3" style="animation-delay: 0.3s">
        <div class="flex justify-between items-center mb-3 px-2">
          <h3 class="text-2xl font-semibold"> Latest Answers </h3>
          <!-- <a
            href="javascript:void(0)"
            class="text-sm text-blue-500 hover:decoration-blue-500"
          >
            View all
          </a> -->
        </div>
        <RouterLink
          :to="''"
          v-for="answer of data.latestAnswers"
          :key="answer.id"
          class="block bold p-2 hover:bg-gray-100/90 rounded-md"
        >
          <div class="font-semibold"> {{ answer.survey.title }} </div>
          <small>
            Answer Made at:
            <i class="font-semibold"> {{ answer.end_date }} </i>
          </small>
        </RouterLink>
      </div>
    </div>
  </PageComponent>
</template>

<style scoped>
</style>
