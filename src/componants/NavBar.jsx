import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link } from 'react-router-dom';



function NavBar() {
    return (
        <div>

            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: '#09427786' }} >
                    <Toolbar>
                       <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}  style={{ marginLeft: '50px' }} component={Link} to={`/`}>
                                 <MenuBookIcon />
                                  Courses
                        </IconButton>
                        
                        <Button color="inherit" style={{ marginLeft: '500px' }} component={Link} to={`/all`}>Course List</Button>
                        <Button color="inherit" style={{ marginLeft: '50px' }} component={Link} to={`/add`} >Add Course</Button>
                        <Button color="inherit" style={{ marginLeft: '50px' }} component={Link} to={`/bulk`} >Bulk Add Course</Button>
                    </Toolbar>
                </AppBar>
            </Box>

        </div>
    )
}

export default NavBar
