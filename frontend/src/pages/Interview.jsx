import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDropzone } from 'react-dropzone';

const vacancies = [
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'web_developer', label: 'Web developer' }
  // Add more vacancies as needed
];

const InterviewForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    aadhar: '',
    selectedVacancy: '',
    resume: null
  });

  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDrop = (acceptedFiles) => {
    setFormData((prevState) => ({
      ...prevState,
      resume: acceptedFiles[0]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name and Last Name validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';

    // Phone Number validation (must be 10 digits)
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Phone number must be exactly 10 digits';

    // Email validation
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email address is invalid';

    // Aadhar Number validation (must be 12 digits)
    if (!formData.aadhar.match(/^\d{12}$/)) newErrors.aadhar = 'Aadhar number must be exactly 12 digits';

    // Vacancy Selection validation
    if (!formData.selectedVacancy) newErrors.selectedVacancy = 'Please select a vacancy';

    // Resume validation (must be a PDF file)
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    } else if (formData.resume.type !== 'application/pdf') {
      newErrors.resume = 'Resume must be a PDF';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission logic here
      setSubmissionMessage('Form submitted successfully!');
      console.log('Form Data:', formData);
    } else {
      setSubmissionMessage('Please correct the errors in the form.');
    }
  };

  // Animation for the main heading
  const fadeInProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 }
  });

  // Drag-and-drop functionality
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    onDrop: handleDrop
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-black text-white rounded-lg shadow-lg">
      <animated.div style={fadeInProps}>
        <h1 className="text-5xl font-bold mb-14 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to the Application Portal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-white mb-1">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-5 py-2 rounded-3xl bg-transparent border border-green-600 text-white placeholder-black placeholder-opacity-50 focus:outline-none focus:border-green-700 focus:ring-0"
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-white mb-1">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-5 py-2 rounded-3xl bg-transparent border border-green-600 text-white placeholder-black placeholder-opacity-50 focus:outline-none focus:border-green-700 focus:ring-0"
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-white mb-1">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              className="w-full px-5 py-2 rounded-3xl bg-transparent border border-green-600 text-white placeholder-black placeholder-opacity-50 focus:outline-none focus:border-green-700 focus:ring-0"
              pattern="\d{10}"
              maxLength="10"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-white mb-1">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className="w-full px-5 py-2 rounded-3xl bg-transparent border border-green-600 text-white placeholder-black placeholder-opacity-50 focus:outline-none focus:border-green-700 focus:ring-0"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="aadhar" className="block text-white mb-1">Aadhar Number</label>
            <input
              id="aadhar"
              name="aadhar"
              type="tel"
              value={formData.aadhar}
              onChange={handleChange}
              placeholder="123456789012"
              className="w-full px-5 py-2 rounded-3xl bg-transparent border border-green-600 text-white placeholder-black placeholder-opacity-50 focus:outline-none focus:border-green-700 focus:ring-0"
              pattern="\d{12}"
              maxLength="12"
              required
            />
            {errors.aadhar && <p className="text-red-500 text-sm mt-1">{errors.aadhar}</p>}
          </div>

          <div>
            <label htmlFor="vacancy" className="block text-white mb-1">Select Vacancy</label>
            <select
              id="vacancy"
              name="selectedVacancy"
              value={formData.selectedVacancy}
              onChange={handleChange}
              className="w-full px-5 py-2 rounded-3xl bg-transparent border border-green-600 text-white placeholder-black placeholder-opacity-50 focus:outline-none focus:border-green-700 focus:ring-0"
              required
            >
              <option value="" disabled>Select a vacancy</option>
              {vacancies.map((vacancy) => (
                <option key={vacancy.value} value={vacancy.value} className='bg-black'>
                  {vacancy.label}
                </option>
              ))}
            </select>
            {errors.selectedVacancy && <p className="text-red-500 text-sm mt-1">{errors.selectedVacancy}</p>}
          </div>

          <div>
            <label htmlFor="resume" className="block text-white mb-1">Upload Resume (PDF Only)</label>
            <div
              {...getRootProps()}
              className="w-full px-5 py-10 border-2 border-dashed border-green-600 rounded-3xl bg-transparent text-center text-white cursor-pointer"
            >
              <input {...getInputProps()} accept='.pdf' />
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-3xl">+</span>
                <p className="mt-2">Drag & drop your resume here, or click to select a file</p>
              </div>
            </div>
            {formData.resume && <p className="text-green-400 text-sm mt-2">Selected file: {formData.resume.name}</p>}
            {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
          </div>

        <div className='flex justify-center'>
        <button
            type="submit"
            className="btn text-black px-6 py-3 rounded-full text-md  transition duration-300"
          >
            Submit
          </button>

        </div>
          {submissionMessage && <p className="text-red text-lg mt-4">{submissionMessage}</p>}
        </form>
      </animated.div>
    </div>
  );
};

export default InterviewForm;
