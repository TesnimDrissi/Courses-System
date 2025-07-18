import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

function AddCourses() {
  const [courseData, setCourseData] = useState({
    course_cost_amount: '',
    course_cost_currency: '',
    course_description: '',
    course_difficulty_level: '',
    course_duration_hours: '',
    course_format: '',
    course_link: '',
    course_name: '',
    course_prerequisites: [
      {
        required_level: '',
        skill_name: ''
      }
    ],
    course_provider: '',
    course_skills: [
      {
        level_taught: '',
        skill_name: '',
        skill_type_code: ''
      }
    ],
    course_status: '',
    course_syllabus: [''], // start with one
    domain_name: '',
    specialty_name: ''
  });

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (e, index, field, nestedField) => {
    const updated = [...courseData[field]];
    updated[index][nestedField] = e.target.value;
    setCourseData({ ...courseData, [field]: updated });
  };

  const handleSyllabusChange = (e, index) => {
    const updated = [...courseData.course_syllabus];
    updated[index] = e.target.value;
    setCourseData({ ...courseData, course_syllabus: updated });
  };

  const addSyllabusField = () => {
    setCourseData({
      ...courseData,
      course_syllabus: [...courseData.course_syllabus, '']
    });
  };

  const removeSyllabusField = (index) => {
    const updated = [...courseData.course_syllabus];
    updated.splice(index, 1);
    setCourseData({ ...courseData, course_syllabus: updated });
  };

  const handleSubmit = () => {
    if (!courseData.course_name.trim()) {
      console.error("Course name is required");
      return;
    }

    axios.post('http://vps-be0fb30a.vps.ovh.net:8050/api/v1/courses', courseData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log(" Course added:", response.data.courses);
      // Reset form if needed
    })
    .catch((error) => {
      console.error(" Error adding course:", error.response?.data || error.message);
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" mb={2}>Add New Course</Typography>

      {/* Basic Course Info */}
      <TextField fullWidth label="Course Name" name="course_name" value={courseData.course_name} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Description" name="course_description" value={courseData.course_description} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Provider" name="course_provider" value={courseData.course_provider} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Link" name="course_link" value={courseData.course_link} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Format" name="course_format" value={courseData.course_format} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Currency" name="course_cost_currency" value={courseData.course_cost_currency} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Cost Amount" name="course_cost_amount" type="number" value={courseData.course_cost_amount} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Difficulty Level" name="course_difficulty_level" type="number" value={courseData.course_difficulty_level} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Duration Hours" name="course_duration_hours" type="number" value={courseData.course_duration_hours} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Status" name="course_status" value={courseData.course_status} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Domain" name="domain_name" value={courseData.domain_name} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Specialty" name="specialty_name" value={courseData.specialty_name} onChange={handleChange} margin="normal" />

      {/* Skills */}
      <Typography variant="subtitle1" mt={3}> Skills Taught</Typography>
      <TextField fullWidth label="Skill Name" value={courseData.course_skills[0].skill_name} onChange={(e) => handleNestedChange(e, 0, "course_skills", "skill_name")} margin="normal" />
      <TextField fullWidth label="Skill Type Code" value={courseData.course_skills[0].skill_type_code} onChange={(e) => handleNestedChange(e, 0, "course_skills", "skill_type_code")} margin="normal" />
      <TextField fullWidth label="Level Taught" value={courseData.course_skills[0].level_taught} onChange={(e) => handleNestedChange(e, 0, "course_skills", "level_taught")} margin="normal" />

      {/* Prerequisites */}
      <Typography variant="subtitle1" mt={3}> Prerequisites</Typography>
      <TextField fullWidth label="Skill Name" value={courseData.course_prerequisites[0].skill_name} onChange={(e) => handleNestedChange(e, 0, "course_prerequisites", "skill_name")} margin="normal" />
      <TextField fullWidth label="Required Level" value={courseData.course_prerequisites[0].required_level} onChange={(e) => handleNestedChange(e, 0, "course_prerequisites", "required_level")} margin="normal" />

      {/* Syllabus */}
      <Typography variant="subtitle1" mt={3}>Syllabus</Typography>
      {courseData.course_syllabus.map((module, idx) => (
        <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
          <TextField
            fullWidth
            label={`Module ${idx + 1}`}
            value={module}
            onChange={(e) => handleSyllabusChange(e, idx)}
          />
          <IconButton onClick={() => removeSyllabusField(idx)} disabled={courseData.course_syllabus.length === 1}>
            <Remove />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<Add />} onClick={addSyllabusField} sx={{ mb: 2 }}>
        Add Module
      </Button>

      {/* Submit */}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Course
      </Button>
    </Box>
  );
}

export default AddCourses;