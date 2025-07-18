import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, Card, IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const emptyCourse = {
  course_name: '',
  course_description: '',
  course_duration_hours: '',
  course_link: '',
  course_status: '',
  course_cost_amount: '',
  course_cost_currency: '',
  course_format: '',
  course_difficulty_level: '',
  domain_name: '',
  specialty_name: '',
  course_provider: '', 
  course_prerequisites: [],
  course_skills: [],
  course_syllabus: []
};

export default function BulkAdd() {
  const [courses, setCourses] = useState([{ ...emptyCourse }]);

  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const handleNestedChange = (index, field, subIndex, subField, value) => {
    const updated = [...courses];
    updated[index][field][subIndex][subField] = value;
    setCourses(updated);
  };

  const addCourse = () => setCourses([...courses, { ...emptyCourse }]);
  const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));

  const addNestedItem = (index, field, item) => {
    const updated = [...courses];
    updated[index][field] = [...(updated[index][field] || []), item];
    setCourses(updated);
  };

  const removeNestedItem = (index, field, subIndex) => {
    const updated = [...courses];
    updated[index][field] = updated[index][field].filter((_, i) => i !== subIndex);
    setCourses(updated);
  };

  const submitCourses = () => {
    axios.post('http://vps-be0fb30a.vps.ovh.net:8050/api/v1/courses/bulk', {
      courses
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => {
      console.log("Courses added:", res.data);
      alert("Courses added successfully!");
      setCourses([{ ...emptyCourse }]);
    }).catch(err => {
      console.error(" Error adding courses:", err.response?.data || err.message);
      alert("Failed to add courses.");
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Bulk Add Courses</Typography>

      {courses.map((course, idx) => (
        <Card key={idx} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Course {idx + 1}</Typography>

          {["course_name", "course_description", "course_duration_hours", "course_link",
            "course_status", "course_cost_amount", "course_cost_currency",
            "course_format", "course_difficulty_level", "domain_name", "specialty_name", "course_provider"
          ].map((field) => (
            <TextField
              key={field}
              label={field.replace(/_/g, ' ')}
              fullWidth
              margin="normal"
              value={course[field] || ''}
              onChange={(e) => handleCourseChange(idx, field, e.target.value)}
            />
          ))}

          {/* ///////////////////////////////////////////////////// */}
          <Typography variant="subtitle1" mt={2}>Prerequisites</Typography>
          {(course.course_prerequisites || []).map((pre, i) => (
            <Box key={i} display="flex" gap={2} alignItems="center" mt={1}>
              <TextField
                label="Skill Name"
                value={pre.skill_name}
                onChange={(e) => handleNestedChange(idx, 'course_prerequisites', i, 'skill_name', e.target.value)}
              />
              <TextField
                label="Required Level"
                value={pre.required_level}
                onChange={(e) => handleNestedChange(idx, 'course_prerequisites', i, 'required_level', e.target.value)}
              />
              <IconButton onClick={() => removeNestedItem(idx, 'course_prerequisites', i)}>
                <Remove />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={() => addNestedItem(idx, 'course_prerequisites', { skill_name: '', required_level: '' })}
            startIcon={<Add />}
            sx={{ mt: 1 }}
          >
            Add Prerequisite
          </Button>

          {/* /////////////////////////////////////////////////////// */}
          <Typography variant="subtitle1" mt={3}>Skills</Typography>
          {(course.course_skills || []).map((skill, i) => (
            <Box key={i} display="flex" gap={2} alignItems="center" mt={1}>
              <TextField
                label="Skill Name"
                value={skill.skill_name}
                onChange={(e) => handleNestedChange(idx, 'course_skills', i, 'skill_name', e.target.value)}
              />
              <TextField
                label="Level Taught"
                value={skill.level_taught}
                onChange={(e) => handleNestedChange(idx, 'course_skills', i, 'level_taught', e.target.value)}
              />
              <TextField
                label="Type Code"
                value={skill.skill_type_code}
                onChange={(e) => handleNestedChange(idx, 'course_skills', i, 'skill_type_code', e.target.value)}
              />
              <IconButton onClick={() => removeNestedItem(idx, 'course_skills', i)}>
                <Remove />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={() => addNestedItem(idx, 'course_skills', {
              skill_name: '', level_taught: '', skill_type_code: ''
            })}
            startIcon={<Add />}
            sx={{ mt: 1 }}
          >
            Add Skill
          </Button>

          {/* //////////////////////////////////////////////////////////// */}
          <Typography variant="subtitle1" mt={3}>Syllabus</Typography>
          {(course.course_syllabus || []).map((module, i) => (
            <Box key={i} display="flex" gap={2} alignItems="center" mt={1}>
              <TextField
                fullWidth
                label={`Module ${i + 1}`}
                value={module}
                onChange={(e) => {
                  const updated = [...courses];
                  updated[idx].course_syllabus[i] = e.target.value;
                  setCourses(updated);
                }}
              />
              <IconButton onClick={() => removeNestedItem(idx, 'course_syllabus', i)}>
                <Remove />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={() => addNestedItem(idx, 'course_syllabus', '')}
            startIcon={<Add />}
            sx={{ mt: 1 }}
          >
            Add Module
          </Button>

          <Button variant="outlined" color="error" sx={{ mt: 3 }} onClick={() => removeCourse(idx)}>
            Remove Course
          </Button>
        </Card>
      ))}

      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={addCourse} startIcon={<Add />}>Add Another Course</Button>
        <Button variant="contained" onClick={submitCourses}>Submit All</Button>
      </Box>
    </Box>
  );
}
