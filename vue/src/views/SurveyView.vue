<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { v4 as uuid4 } from 'uuid'

import PageComponent from '../components/PageComponent.vue'
import QuestionEditor from '../components/editor/QuestionEditor.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()

let model = ref({
  title: '',
  status: false,
  description: null,
  image_url: null,
  expire_date: null,
  questions: [],
})

const surveyLoading = computed(() => store.state.currentSurvey.loading)

window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

watch(() => store.state.currentSurvey.data, (newVal, oldVal) => {
  model.value = {
    ...JSON.parse(JSON.stringify(newVal)),
    status: newVal.status !== 'draft'
  }
})

if (route.params.id) {
  store.dispatch('getSurvey', route.params.id)
  .catch(err => {
    console.log(err);
    if (err.response.status === 404) {
      router.push({
        name: '404',
      })
    }
  })
}

const onImageChoose = (event) => {
  const file = event.target.files[0]

  const reader = new FileReader()
  reader.onload = () => {
    model.value.image = reader.result

    model.value.image_url = reader.result
  }
  reader.readAsDataURL(file)
  console.log(model.value);
}

const addQuestion = (index) => {
  const newQuestion = {
    id: uuid4(),
    type: 'text',
    question: '',
    description: null,
    data: {}
  }

  model.value.questions.splice(index, 0, newQuestion)
}

const questionChange = (question) => {
  model.value.questions = model.value.questions.map(q => {
    if (q.id === question.id) {
      return JSON.parse(JSON.stringify(question))
    }
    return q
  })
}

const deleteQuestion = (question) => model.value.questions = model.value.questions.filter(q => q !== question)

const saveSurvey = () => {
  store.dispatch('saveSurvey', model.value)
    .then(({ data }) => {
      store.commit('notify', {
        type: 'success',
        message: 'Survey was successfully updated'
      })
      router.push({
        name: 'SurveyView',
        params: { id: data.data.id }
      })
    })
    .catch(err => {
        store.commit('notify', {
          type: '',
          message: err.response.data.message
        })
    })

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

const deleteSurvey = () => {
  if (confirm(`Are you sure you want to delete this Survey?`)) {
    store.dispatch('deleteSurvey', model.value.id)
      .then(() => {
        store.commit('notify', {
          type: 'success',
          message: 'Survey was successfully deleted'
        })

        router.push({
          name: 'Surveys'
        })
      })
      .catch(err => {
        store.commit('notify', {
          type: '',
          message: err.message
        })
      })
  }
}
</script>

<template>
  <PageComponent v-if="model">
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ route.params.id ? model.title : 'Create a Survey' }}
        </h1>

        <button
          v-if="route.params.id"
          type="button"
          @click="deleteSurvey()"
          class="py-2 px-3 text-white bg-red-800 rounded-md hover:bg-red-600 hover:border-red-600 focus:border-red-600 focus:outline-none flex aline-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Delete Survey
        </button>
      </div>
    </template>

    <div v-if="surveyLoading">
      Loading...
    </div>
    
    <form v-else @submit.prevent="saveSurvey" class="animate-fade-in-down">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <div class="px-4 py-5 bg-white spacy-y-6 sm:p-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 text-left">
              Image
            </label>
            <div class="mt-1 flex items-center">
              <img
                v-if="model.image_url"
                :src="model.image_url"
                :alt="model.title"
                class="w-64 h-48 object-cover"
              />
              <span v-else class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-[80%] w-[80%] text-gray-300">
                  <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <button type="button" class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <input 
                  type="file"
                  class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                  @change="onImageChoose"
                />
                Change
              </button>
            </div>
          </div>

          <div class="mt-10">
            <label for="title" class="block text-sm font-bold text-gray-700 text-left"> Title </label>
            <input type="text" name="title" id="title" v-model="model.title" autocomplete="survey_title" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>

          <div class="mt-10">
            <label for="about" class="block text-sm font-bold text-gray-700 text-left">
              Description
            </label>
            <div class="mt-1">
              <textarea
                id="description"
                name="description"
                rows="3"
                v-model="model.description"
                autocomplete="survey_description"
                class="shadow-sm focus:ring-ingigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Describe your survey"
              />
            </div>
          </div>

          <div class="mt-10">
            <label for="expire_date" class="block text-sm font-bold text-gray-700 text-left">
              Expire Date
            </label>
            <input
              type="date"
              name="expire_date"
              id="expire_date"
              v-model="model.expire_date"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
            />
          </div>

          <div class="flex items-start mt-10 mb-5">
            <div class="flex items-center h-5">
              <input
                id="status"
                name="status"
                type="checkbox"
                v-model="model.status"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" 
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="font-medium text-gray-700 text-left">
                Active
              </label>
            </div>
          </div>
        </div>

        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <h3 class="text-2xl font-semibold flex items-center justify-between">
            Questions
            <button
              type="button"
              @click="addQuestion()"
              class="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
            </svg>
              Add Question
            </button>
          </h3>
          <div v-if="!model.questions.length" class="text-gray-600">
            You don't have any questions created
          </div>
          <div v-for="(question, index) in model.questions" :key="question.id">
            <QuestionEditor
              :question="question"
              :index="index"
              @change="questionChange"
              @addQuestion="addQuestion"
              @deleteQuestion="deleteQuestion"
            />
          </div>
        </div>

        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button 
            type="submit" 
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          > 
            Save 
          </button>
        </div>
      </div>
    </form>
  </PageComponent>
</template>

<style scoped>
</style>
