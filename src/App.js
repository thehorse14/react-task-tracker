import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Firebase from './components/Firebase'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'

const auth = Firebase.auth()
const firestore = Firebase.firestore()

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [user, setUser] = useAuthState(auth)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = user ? await fetchTasks(user) : [];
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [user])

  const fetchTasks = async (user) => {
    let snapshotArray = [];
    const tasksRef = firestore.collection('tasks')
    const snapshot = await tasksRef.where('userId', '==', user.uid).get()

    if(!snapshot.empty) {
      snapshot.forEach(doc => {
        snapshotArray.push({...doc.data(), id: doc.id})
      })
    }

    return snapshotArray
  }

  const fetchTask = async (id) => {
    const tasksRef = firestore.collection('tasks')
    const doc = await tasksRef.doc(id).get()
    const data = doc.exists ? doc.data() : null

    return data
  }

  const addTask = async (task) => {
    task.userId = user.uid;
    try {
      const data = await firestore.collection('tasks').add(task)
      const addedTask = {...task, id: data.id}
      setTasks([...tasks, addedTask])
    } catch {
      return alert('Something went wrong, please try again');
    }
  }

  const deleteTask = async (id) => {
    try {
      await firestore.collection('tasks').doc(id).delete();
      setTasks(tasks.filter((task) => task.id !== id))
    } catch {
      return alert('Something went wrong, please try again');
    }
  }

  const toggleReminder = async (id) => {
    try {
      let taskToToggle = await fetchTask(id)
      const updatedReminder = !taskToToggle.reminder
      await firestore.collection('tasks').doc(id).update({
          reminder: updatedReminder
      })
      setTasks(tasks.map(
        (task) =>  task.id === id ? {...task, reminder: updatedReminder} : task)
      )
    }
    catch {
      return alert('Something went wrong, please try again');
    }
  }

  return (
    <Router>
      <div className='menu'>
        <SignOut auth={auth}/>
      </div>
      <div className='container'>

      {user ?
        <>
          <Header onAddTask={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask}/>

          <Route path='/' exact render={(props) => (          
            <>
              {showAddTask && <AddTask onAdd={addTask}/> }
              {tasks.length > 0 ? 
                <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> :
                'No Tasks To Show'
              }
            </>
          )} />
          <Route path='/about' component={About} />
          <Footer />
        </>
       : 
        <>
         <h2>Welcome to Task Tracker</h2>
         <SignIn auth={auth}/>
        </>
      }
      </div>
    </Router>
  );
}

export default App;
