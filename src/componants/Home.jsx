import React from 'react'
import Typography from '@mui/material/Typography';
import {styled}  from '@mui/material';

const HomePara = styled(Typography)`
    margin-right: 30px;
    text-align: center;
    margin-top: 50px;
    font-size: 24px;
    color: #333;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    line-height: 1.5;
    padding: 20px;
    
`

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>

      <HomePara>Welcome to the Course Management System!</HomePara>
      <HomePara>Use the navigation bar to explore courses, add new courses, or view the course list.</HomePara>
      <HomePara>Get started by adding a new course or viewing the existing courses.</HomePara>
      <HomePara>Happy learning!</HomePara>
    </div>
  )
}

export default Home
