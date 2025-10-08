import { useState } from "react";
import {
  Container,
  Form,
  Button,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";

export default function GolfCourseRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    courseName: "",
    holes: "",
    handicapIndexes: [],
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    // Validation per step
    if (step === 1 && !formData.courseName) {
      alert("Please enter a course name");
      return;
    }
    if (step === 2 && ![9, 18].includes(Number(formData.holes))) {
      alert("Number of holes must be 9 or 18");
      return;
    }
    if (step === 3 && formData.handicapIndexes.some((h) => h === "")) {
      alert("Please enter all handicap indexes");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleHolesSelect = (value) => {
    const numHoles = Number(value);
    setFormData({
      ...formData,
      holes: numHoles,
      handicapIndexes: Array(numHoles).fill(""),
    });
  };

  const handleHandicapChange = (index, value) => {
    const updated = [...formData.handicapIndexes];
    updated[index] = value;
    setFormData({ ...formData, handicapIndexes: updated });
  };

  const handleSubmit = () => {
    alert("Form submitted:\n" + JSON.stringify(formData, null, 2));
    // TODO: Send to API
  };

  return (
    <Container className="mt-4">
      <h2>Register a Golf Course</h2>
      <ProgressBar now={(step / 5) * 100} className="mb-3" />

      {step === 1 && (
        <Form>
          <Form.Group>
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="Enter golf course name"
            />
          </Form.Group>
        </Form>
      )}

      {step === 2 && (
        <Form>
          <Form.Group>
            <Form.Label>Number of Holes</Form.Label>
            <Form.Select
              name="holes"
              value={formData.holes}
              onChange={(e) => handleHolesSelect(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="9">9 Holes</option>
              <option value="18">18 Holes</option>
            </Form.Select>
          </Form.Group>
        </Form>
      )}

      {step === 3 && (
        <>
          <h5>Enter Handicap Index for Each Hole</h5>
          <Row>
            {formData.handicapIndexes.map((val, idx) => (
              <Col xs={4} key={idx} className="mb-2">
                <Form.Control
                  type="number"
                  min="0"
                  max="54"
                  value={val}
                  onChange={(e) => handleHandicapChange(idx, e.target.value)}
                  placeholder={`Hole ${idx + 1}`}
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      {step === 4 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Course Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description of the course"
            />
          </Form.Group>
        </Form>
      )}

      {step === 5 && (
        <>
          <h4>Confirm Your Details</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </>
      )}

      <div className="mt-3">
        {step > 1 && (
          <Button variant="secondary" onClick={handleBack} className="me-2">
            Back
          </Button>
        )}
        {step < 5 && <Button onClick={handleNext}>Next</Button>}
        {step === 5 && (
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </Container>
  );
}
