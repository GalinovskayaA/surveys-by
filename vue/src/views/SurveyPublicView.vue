<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import QuestionViewer from '../components/viewer/QuestionViewer.vue'
import Notification from '../components/Notification.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const surveyFinished = ref(false)
const answers = ref({})

const loading = computed(() => store.state.currentSurvey.loading)
const survey = computed(() => store.state.currentSurvey.data)

store.dispatch('getSurveyBySlug', route.params.slug)
  .catch(err => {
    console.log(err);
    if (err.response.status === 404) {
      router.push({
        name: '404',
      })
    }
  })

const submitSurvey = () => {
  console.log(JSON.stringify(answers.value, undefined, 2))
  store.dispatch('saveSurveyAnswer', {
    surveyId: survey.value.id,
    answers: answers.value
  })
  .then(response => {
    if (response.status === 201) surveyFinished.value = true
    store.commit('notify', {
      type: 'success',
      message: 'Survey was successfully finished'
    })
  })
  .catch(err => {
    store.commit('notify', {
      type: '',
      message: err.response.data.message
    })
  })
}

const submitAnotherResponse = () => {
  answers.value = {}
  surveyFinished.value = false
  router.push({
    name: 'Surveys',
  })
}
</script>

<template>
  <div class="py-5 px-8 text-left">
    <div v-if="loading" class="flex justify-center">
      Loading...
    </div>

    <form v-else class="container mx-auto" @submit.prevent="submitSurvey">
      <div class="grid grid-cols-7 items-center">
        <div class="mr-4 col-span-2">
          <img :src="survey.image_url" alt="" />
        </div>
        <div class="col-span-5">
          <h1 class="text-3xl mb-3"> {{ survey.title }} </h1>
          <p class="text-gray-500 text-sm" v-html="survey.description" />
        </div>
      </div>

      <div v-if="surveyFinished" class="mt-10 py-8 px-6 bg-emerald-400 text-white w-[100%] mx-auto rounded-md">
        <div class="text-xl mb-3 font-semibold">
          Thank you for participating in this survey
        </div>
        <button
          type="button"
          @click="submitAnotherResponse"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit another survey
        </button>
      </div>

      <div v-else>
        <hr class="my-3" />
        <div v-for="(question, index) of survey.questions" :key="question.id">
          <QuestionViewer v-model="answers[question.id]" :question="question" :index="index" />
        </div>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit
        </button>
      </div>
    </form>
    <Notification />
  </div>
</template>

<style scoped>
</style>
