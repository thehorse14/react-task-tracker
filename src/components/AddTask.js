import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'

const AddTask = ({ onAdd }) => {
    const [text, setText] = useState('')
    const [day, setDay] = useState(new Date())
    const [reminder, setReminder] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!text) {
            alert('Please add a task')
            return
        }
        
        onAdd({ text, day, reminder });
        resetForm()
    }

    const resetForm = () => {
          setText('')
          setDay(new Date())
          setReminder(false)
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Task</label>
                <input type='text' placeholder='Add Task'
                value={text} onChange={(e) => setText(e.target.value)}>
                </input>
            </div>
            <div className='form-control'>
                <label>Day & Time</label>
                <DateTimePicker className='datetime' value={day} onChange={setDay} />
            </div>
            <div className='form-control form-control-check'>
                <label>Set Reminder</label>
                <input type='checkbox'
                checked={reminder}
                value={reminder} onChange={(e) => setReminder(e.currentTarget.checked)}></input>
            </div>
            <input type='submit' value='Save Task' className='btn btn-block'></input>
        </form>
    )
}

export default AddTask