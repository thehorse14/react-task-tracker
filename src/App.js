import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  const baseURL = "http://localhost:5000"

  const fetchTasks = async () => {
    const res = await fetch(`${baseURL}/tasks`)
    const data = await res.json()

    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`${baseURL}/tasks/${id}`)
    const data = await res.json()

    return data
  }

  const addTask = async (task) => {
    const res = await fetch(`${baseURL}/tasks`, {
      method: "POST",
      headers: {
       'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`${baseURL}/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`${baseURL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(tasks.map(
      (task) =>  task.id === id ? {...task, reminder: data.reminder} : task)
    )
  }

  return (
    <Router>
      <div className="container">
        <Header onAddTask={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask}/>

        <Route path='/' exact render={(props) => (          <>
            {showAddTask && <AddTask onAdd={addTask}/> }
            {tasks.length > 0 ? 
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> :
              'No Tasks To Show'
            }
          </>
         )} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
