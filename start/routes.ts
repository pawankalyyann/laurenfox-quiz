/*
|--------------------------------------------------------------------------
| Routes: public quiz and protected question administration
|--------------------------------------------------------------------------
*/
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

// Public participant routes
router.get('/', [controllers.Questions, 'index']).as('quiz')
router.post('/quiz/submit', [controllers.Questions, 'submit']).as('quiz.submit')
router.get('/quiz/results', [controllers.Questions, 'results']).as('quiz.results')

// Admin login and logout
router.get('/admin/login', [controllers.Questions, 'login']).as('admin.login')
router.post('/admin/login', [controllers.Questions, 'authenticate']).as('admin.login.submit')
router.post('/admin/logout', [controllers.Questions, 'logout']).as('admin.logout')

// The controller checks admin authorization BEFORE reading or modifying data.
router.get('/configuration', [controllers.Questions, 'create']).as('configuration')
router.post('/questions', [controllers.Questions, 'store']).as('questions.store')
router.put('/questions/:id', [controllers.Questions, 'update']).as('questions.update')
router.delete('/questions/:id', [controllers.Questions, 'destroy']).as('questions.destroy')
router.on('/welcome').renderInertia('welcome', {}).as('welcome')
// Participant registration
router.get('/register', [controllers.Participants, 'create']).as('registration.create')
router.post('/register', [controllers.Participants, 'store']).as('registration.store')
router.get('/verify-email', [controllers.Participants, 'pending']).as('registration.pending')
