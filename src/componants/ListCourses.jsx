import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Collapse, IconButton, Box, styled, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const StyledTable = styled(TableContainer)`margin-left: 30px;`;
const Title = styled(Typography)`margin-top: 70px;`;

function ListCourses() {
  const [courses, setCourses] = useState([]);
  const [update, setUpdate] = useState(false);
  const [openRows, setOpenRows] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});

  const toggleRow = (index) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    axios.get('http://vps-be0fb30a.vps.ovh.net:8050/api/v1/courses?page=1&page_size=20')
      .then((response) => setCourses(response.data.courses))
      .catch((error) => console.error(error));
  }, [update]);

  const deleteCourse = (id) => {
    axios.delete(`http://vps-be0fb30a.vps.ovh.net:8050/api/v1/courses/${id}`)
      .then(() => setUpdate(!update))
      .catch((error) => console.error(error));
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setEditedCourse(course); // Initialize form with course data
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({ ...prev, [name]: value }));
  };

 const submitEdit = function () {
  const { _id, ...cleanCourse } = editedCourse;

  if (!String(cleanCourse.course_name || '').trim()) {
    console.error("❌ Course name is empty");
    return;
  }

  // TEMP: Remove nested arrays to isolate issue
  delete cleanCourse.course_prerequisites;
  delete cleanCourse.course_skills;
  delete cleanCourse.course_syllabus;

  axios.put(`http://vps-be0fb30a.vps.ovh.net:8050/api/v1/courses/${_id}`, cleanCourse, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then((response) => {
      console.log("✅ Course updated:", response.data);
      setEditDialogOpen(false);
      setUpdate(prev => !prev);
    })
    .catch((error) => {
      console.error("❌ Error updating course:", error.response?.data || error.message);
    });
};

  return (
    <div>
      <Title variant="h3" gutterBottom>Manage your courses here:</Title>

      <StyledTable component={Paper}>
        <TableContainer>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell />
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Domain</b></TableCell>
              <TableCell><b>Specialty</b></TableCell>
              <TableCell><b>Difficulty</b></TableCell>
              <TableCell><b>Cost</b></TableCell>
              <TableCell><b>Format</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(index)}>
                      {openRows[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => toggleRow(index)}>
                      {course.course_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{course.domain_name}</TableCell>
                  <TableCell>{course.specialty_name}</TableCell>
                  <TableCell>{course.course_difficulty_level}</TableCell>
                  <TableCell>{course.course_cost_amount} {course.course_cost_currency}</TableCell>
                  <TableCell>{course.course_format}</TableCell>
                  <TableCell>{course.course_status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      style={{ marginRight: 10 }}
                      endIcon={<AutoFixHighIcon />}
                      onClick={() => handleEditClick(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                      color="error"
                      style={{ marginTop: 10 }}
                      onClick={() => deleteCourse(course._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={9} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                      <Box margin={2}>
                        <Typography variant="subtitle1"><b>Description:</b> {course.course_description}</Typography>
                        <Typography variant="subtitle1"><b>Duration (hours):</b> {course.course_duration_hours}</Typography>
                        <Typography variant="subtitle1"><b>Link:</b> <a href={course.course_link} target="_blank" rel="noopener noreferrer">{course.course_link}</a></Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>Prerequisites:</Typography>
                        {course.course_prerequisites.length > 0 ? (
                          course.course_prerequisites.map((pre, i) => (
                            <Typography key={i}>- {pre.skill_name} (Level: {pre.required_level})</Typography>
                          ))
                        ) : (
                          <Typography>No prerequisites</Typography>
                        )}
                        <Typography variant="h6" sx={{ mt: 2 }}> Skills:</Typography>
                        {course.course_skills.length > 0 ? (
                          course.course_skills.map((skill, i) => (
                            <Typography key={i}>- {skill.skill_name} (Level: {skill.level_taught}, Type: {skill.skill_type_code})</Typography>
                          ))
                        ) : (
                          <Typography>No skills listed</Typography>
                        )}
                        <Typography variant="h6" sx={{ mt: 2 }}>Syllabus:</Typography>
                        {course.course_syllabus.length > 0 ? (
                          course.course_syllabus.map((module, i) => (
                            <Typography key={i}>- {module}</Typography>
                          ))
                        ) : (
                          <Typography>No syllabus provided</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </TableContainer>
      </StyledTable>

 
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Name"
            name="course_name"
            fullWidth
            value={editedCourse.course_name || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="normal"
            label="Description"
            name="course_description"
            fullWidth
            value={editedCourse.course_description || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="normal"
            label="Duration (Hours)"
            name="course_duration_hours"
            fullWidth
            type="number"
            value={editedCourse.course_duration_hours || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="normal"
            label="Link"
            name="course_link"
            fullWidth
            value={editedCourse.course_link || ''}
            onChange={handleEditChange}
          />

   {/* /////////////////////////// */}
          <Typography variant="h6" mt={3}>Prerequisites</Typography>
          {(editedCourse.course_prerequisites || []).map((pre, i) => (
            <Box key={i} display="flex" gap={1} mb={1}>
              <TextField
                label="Skill Name"
                value={pre.skill_name}
                onChange={(e) => {
                  const newArr = [...editedCourse.course_prerequisites];
                  newArr[i].skill_name = e.target.value;
                  setEditedCourse({ ...editedCourse, course_prerequisites: newArr });
                }}
              />
              <TextField
                label="Required Level"
                value={pre.required_level}
                onChange={(e) => {
                  const newArr = [...editedCourse.course_prerequisites];
                  newArr[i].required_level = e.target.value;
                  setEditedCourse({ ...editedCourse, course_prerequisites: newArr });
                }}
              />
              <Button onClick={() => {
                const newArr = editedCourse.course_prerequisites.filter((_, idx) => idx !== i);
                setEditedCourse({ ...editedCourse, course_prerequisites: newArr });
              }}>Remove</Button>
            </Box>
          ))}
          <Button onClick={() => {
            const newArr = [...(editedCourse.course_prerequisites || []), { skill_name: '', required_level: '' }];
            setEditedCourse({ ...editedCourse, course_prerequisites: newArr });
          }}>Add Prerequisite</Button>

          {/* ///////////////////////////////////////////////////////*/}
          <Typography variant="h6" mt={3}>Skills</Typography>
          {(editedCourse.course_skills || []).map((skill, i) => (
            <Box key={i} display="flex" gap={1} mb={1}>
              <TextField
                label="Skill Name"
                value={skill.skill_name}
                onChange={(e) => {
                  const newArr = [...editedCourse.course_skills];
                  newArr[i].skill_name = e.target.value;
                  setEditedCourse({ ...editedCourse, course_skills: newArr });
                }}
              />
              <TextField
                label="Level Taught"
                value={skill.level_taught}
                onChange={(e) => {
                  const newArr = [...editedCourse.course_skills];
                  newArr[i].level_taught = e.target.value;
                  setEditedCourse({ ...editedCourse, course_skills: newArr });
                }}
              />
              <TextField
                label="Type Code"
                value={skill.skill_type_code}
                onChange={(e) => {
                  const newArr = [...editedCourse.course_skills];
                  newArr[i].skill_type_code = e.target.value;
                  setEditedCourse({ ...editedCourse, course_skills: newArr });
                }}
              />
              <Button onClick={() => {
                const newArr = editedCourse.course_skills.filter((_, idx) => idx !== i);
                setEditedCourse({ ...editedCourse, course_skills: newArr });
              }}>Remove</Button>
            </Box>
          ))}
          <Button onClick={() => {
            const newArr = [...(editedCourse.course_skills || []), { skill_name: '', level_taught: '', skill_type_code: '' }];
            setEditedCourse({ ...editedCourse, course_skills: newArr });
          }}>Add Skill</Button>

          {/*  ////////////////////////////////////////////////////////////////////// */}
          <Typography variant="h6" mt={3}>Syllabus</Typography>
          {(editedCourse.course_syllabus || []).map((module, i) => (
            <Box key={i} display="flex" gap={1} mb={1}>
              <TextField
                fullWidth
                label={`Module ${i + 1}`}
                value={module}
                onChange={(e) => {
                  const newArr = [...editedCourse.course_syllabus];
                  newArr[i] = e.target.value;
                  setEditedCourse({ ...editedCourse, course_syllabus: newArr });
                }}
              />
              <Button onClick={() => {
                const newArr = editedCourse.course_syllabus.filter((_, idx) => idx !== i);
                setEditedCourse({ ...editedCourse, course_syllabus: newArr });
              }}>Remove</Button>
            </Box>
          ))}
          <Button onClick={() => {
            const newArr = [...(editedCourse.course_syllabus || []), ''];
            setEditedCourse({ ...editedCourse, course_syllabus: newArr });
          }}>Add Module</Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListCourses;