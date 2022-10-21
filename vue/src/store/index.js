import { createStore } from 'vuex'
import axiosClient from '../axios'

const store = createStore({
  state () {
    return {
      user: {
        data: {
          name: localStorage.getItem('NAME'),
          email: localStorage.getItem('EMAIL')
        },
        token: localStorage.getItem('TOKEN')
      },
      dashboard: {
        loading: false,
        data: {},
      },
      currentSurvey: {
        loading: false,
        data: {},
      },
      surveys: {
        loading: false,
        data: [],
        links: []
      },
      questionTypes: ['text', 'select', 'radio', 'checkbox', 'textarea'],
      notification: {
        show: false,
        message: null,
        type: null
      }
    }
  },
  getters: {},
  actions: {
    getDashboardData({ commit }) {
      commit('dashboardLoading', true)
      return axiosClient.get(`/dashboard`)
        .then(res => {
          commit('dashboardLoading', false)
          commit('setDashboardData', res.data)
          return res
        })
        .catch(err => {
          commit('dashboardLoading', false)
          throw err
        })
    },
    getSurvey({ commit }, id) {
      commit('setCurrentSurveyLoading', true)
      return axiosClient
        .get(`/survey/${id}`)
        .then(res => {
          commit('setCurrentSurvey', res.data)
          commit('setCurrentSurveyLoading', false)
          return res
        })
        .catch(err => {
          commit('setCurrentSurveyLoading', false)
          throw err
        })
    },
    saveSurvey({ commit }, survey) {
      delete survey.image_url

      let response

      if (survey.id) {
        response = axiosClient
          .put(`/survey/${survey.id}`, survey)
          .then(res => {
            commit('setCurrentSurvey', res.data)
            return res
          })
      } else {
        response = axiosClient.post('/survey', survey).then((res) => {
          commit('setCurrentSurvey', res.data)
          return res
        })
      }

      return response
    },
    deleteSurvey({}, id) {
      return axiosClient.delete(`/survey/${id}`)
    },
    getSurveys({ commit }, { url = null } = {}) {
      url = url || '/survey'

      commit('setSurveysLoading', true)
      return axiosClient.get(url)
        .then(res => {
          commit('setSurveysLoading', false)
          commit('setSurveys', res.data)
          return res
        })
        .catch(err => {
          commit('setSurveysLoading', false)
          throw err
        })
    },
    getSurveyBySlug({ commit }, slug) {
      commit('setCurrentSurveyLoading', true)
      return axiosClient.get(`/survey-by-slug/${slug}`)
        .then(res => {
          commit('setCurrentSurvey', res.data)
          commit('setCurrentSurveyLoading', false)
          return res
        })
        .catch(err => {
          commit('setCurrentSurveyLoading', false)
          throw err
        })
    },
    saveSurveyAnswer({ commit }, { surveyId, answers }) {
      commit('setCurrentSurveyLoading', true)
      return axiosClient.post(`/survey/${surveyId}/answer`, { answers })
      .then(res => {
        commit('setCurrentSurveyLoading', false)
        return res
      })
      .catch(err => {
        commit('setCurrentSurveyLoading', false)
        throw err
      })
    },
    register({ commit }, user) {
      return axiosClient.post('/register', user)
        .then(({data}) => {
          commit('setUser', data)
          return data
        })
    },
    login({ commit }, user) {
      return axiosClient.post('/login', user)
        .then(({data}) => {
          commit('setUser', data)
          return data
        })
    },
    logout({ commit }) {
      return axiosClient.post('/logout')
        .then(response => {
          commit('logout')
          return response
        })
        .catch(err => {
          throw err
        })
    }
  },
  mutations: {
    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading
    },
    setDashboardData: (state, data) => {
      state.dashboard.data = data
    },
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading
    },
    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data
    },
    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading
    },
    setSurveys: (state, surveys) => {
      state.surveys.data = surveys.data
      state.surveys.links = surveys.meta.links
    },
    logout: state => {
      state.user.data = {}
      state.user.token = null
      localStorage.clear()
    },
    setUser: (state, userData) => {
      state.user.token = userData.token
      state.user.data = userData.user
      localStorage.setItem('TOKEN', userData.token)
      localStorage.setItem('NAME', userData.user.name)
      localStorage.setItem('EMAIL', userData.user.email)
    },
    notify: (state, { message, type }) => {
      state.notification.show = true
      state.notification.message = message
      state.notification.type = type

      setTimeout(() => {
        state.notification.show = false
      }, 3000)
    }
  },
})

export default store
