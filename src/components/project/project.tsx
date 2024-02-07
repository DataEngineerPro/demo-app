import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import './project.scss';
import { useNavigate } from "react-router-dom";

export default function Project() {
    const [projectName, setProjectName] = useState('')
    const navigate:any=useNavigate()
    function handleSubmit(event) {
        event.preventDefault();
        navigate(`/temp/upload`)
    }
  return (
    <React.Fragment>
        <div className='project-container'>
            <h2>Project Creation</h2>
            <form onSubmit={handleSubmit}>
                    <TextField
                        type="text"
                        variant='outlined'
                        color='primary'
                        label="Project Title"
                        onChange={e => setProjectName(e.target.value)}
                        value={projectName}
                        fullWidth
                        required
                    />

                <Button className='submit' variant="contained" color="primary" type="submit">Create & Import Documents</Button>
            </form>
            </div>
     
        </React.Fragment>
  );
}