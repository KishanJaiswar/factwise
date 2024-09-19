import React, { useState } from 'react';
import { FaTrash, FaTimesCircle, FaPen, FaCheckCircle, FaChevronDown, FaSearch } from 'react-icons/fa';
import Celebrities from '../files/celebrities.json';

const List = () => {
  const [searchValue, setSearchValue] = useState('');
  const [celebrities, setCelebrities] = useState(Celebrities); // Main data that includes edits
  const [filteredCelebrities, setFilteredCelebrities] = useState(Celebrities); // Data for search results
  const [openAccordion, setOpenAccordion] = useState<number | null | boolean>(null);
  const [editingCelebrity, setEditingCelebrity] = useState<number | null>(null); // Track which celebrity is being edited
  const [editedValues, setEditedValues] = useState({
    name: '', // Combined first and last name
    dob: '',
    gender: '',
    country: '',
    description: ''
  });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [celebrityToDelete, setCelebrityToDelete] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    name: '',
    dob: '',
    gender: '',
    country: '',
    description: ''
  });

  // Validation logic
  const validateInputs = () => {
    let validationErrors = { name: '', dob: '', gender: '', country: '', description: '' };
    let isValid = true;

    // Name validation (should include both first and last names)
    if (editedValues?.name.trim() === '') {
      validationErrors.name = 'Please enter a name.'
      isValid = false
    } else if (editedValues.name.trim().split(' ').length < 2) {
      validationErrors.name = 'Please enter both first and last names.';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(editedValues.name)) {
      validationErrors.name = 'Cannot enter number.'
      isValid = false
    }

    // DOB validation (should be a valid date and should make the user at least 18 years old)
    // const dob = new Date(editedValues.dob);
    // const today = new Date();
    // const age = today.getFullYear() - dob.getFullYear();
    // if (isNaN(dob.getTime())) {
    //   validationErrors.dob = 'Please enter a valid DOB.';
    //   isValid = false;
    // }

    // // Gender validation (should be selected)
    // if (!editedValues.gender) {
    //   validationErrors.gender = 'Please select a gender.';
    //   isValid = false;
    // }

    // Country validation (should not be empty)
    if (editedValues.country.trim() === '') {
      validationErrors.country = 'Please enter a country.';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(editedValues.country)) {
      validationErrors.country = 'Country cannot contain numbers.';
      isValid = false;
    }


    // Description validation (should not be empty and have a minimum length of 10)
    if (editedValues.description.trim().length < 10) {
      validationErrors.description = 'Please enter a description of at least 10 characters.';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  // Handle the accordion click
  const handleAccordionClick = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
    setEditingCelebrity(null); // Close edit mode if opened
  };

  // To delete the celebrity
  const handleCelebrityDelete = (id: number) => {
    const newCelebrities = celebrities.filter(celebrity => celebrity.id !== id);
    setCelebrities(newCelebrities);
    setFilteredCelebrities(newCelebrities); // Also update filtered results
    setDeleteConfirmationOpen(false); // Close the delete confirmation modal
  };

  // Open delete confirmation popup
  const openDeleteConfirmation = (id: number) => {
    setCelebrityToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);

    const filteredResults = celebrities.filter(celebrity => {
      const celebrityName = `${celebrity?.first} ${celebrity?.last}`.trim();
      return celebrityName?.toLowerCase()?.includes(inputValue.toLowerCase());
    });

    setFilteredCelebrities(inputValue ? filteredResults : celebrities); // Update filtered list based on input
  };

  // To handle pencil (edit) click and fill the form with current values
  const handleEditClick = (celebrity: any) => {
    setEditingCelebrity(celebrity.id);
    setEditedValues({
      name: `${celebrity.first} ${celebrity.last}`, // Combine first and last name into one input
      dob: celebrity.dob,
      gender: celebrity.gender,
      country: celebrity.country,
      description: celebrity.description,
    });
    setErrors({
      name: '',
      dob: '',
      gender: '',
      country: '',
      description: ''
    }); // Reset errors
  };

  // Handle input changes in the edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    setEditedValues({
      ...editedValues,
      [field]: e.target.value,
    });
  };

  // Save edited data
  const handleSave = (id: number) => {
    if (!validateInputs()) return; // Only proceed if inputs are valid

    const [first, ...lastArr] = editedValues.name.trim().split(' ');
    const last = lastArr.join(' ');
    const updatedCelebrities = celebrities.map(celebrity => {
      if (celebrity.id === id) {
        return { ...celebrity, first, last, ...editedValues };
      }
      return celebrity;
    });
    setCelebrities(updatedCelebrities); // Update main celebrities array with edits
    setFilteredCelebrities(updatedCelebrities); // Update filtered list to reflect edits
    setEditingCelebrity(null); // Close edit mode
  };

  return (
    <div className="container max-w-[600px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">List</h1>

      {/* Celebrity Search */}
      <div className="relative flex items-center border border-gray-500 rounded-[14px] mb-6 px-[17px] py-[5px]">
        <FaSearch className="text-[#9a9a9a] text-[20px]" />
        <input
          type="search"
          name="search"
          id="search"
          value={searchValue}
          onChange={handleSearch}
          className="flex-grow px-2 py-1 focus:outline-none text-[17px]"
          placeholder="Search user"
        />
      </div>

      {/* Celebrities List */}
      <div className="space-y-4">
        {filteredCelebrities?.map((celebrity, index) => {
          const today = new Date();
          const birthDate = new Date(celebrity?.dob);
          const age = today?.getFullYear() - birthDate?.getFullYear();

          return (
            <div key={index} className="border border-gray-300 rounded-lg shadow-sm">
              <div className="flex items-center justify-between py-[16px] px-[20px] rounded-t-lg cursor-pointer" /* onClick={() => { handleAccordionClick(index) }} */>
                <div className="flex items-center gap-[25px]">
                  <img src={celebrity?.picture} alt={`${celebrity?.first} ${celebrity?.last}`} className="w-16 h-16 rounded-full border border-gray-400" />

                  {/* Conditionally render name or input field */}
                  {age >= 18 && editingCelebrity === celebrity.id ? (
                    <>
                      <input
                        id='name'
                        type="text"
                        value={editedValues.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className="text-[27px] outline-none border border-gray-300 p-2 w-full rounded-[10px]"
                      />
                      {errors?.name && <p>{errors?.name}</p>}
                    </>
                  ) : (
                    <h2 className="text-[27px] leading-[34px] font-semibold">
                      {celebrity?.first} {celebrity?.last}
                    </h2>
                  )}
                </div>
                <FaChevronDown
                  onClick={() => handleAccordionClick(index)}
                  className={`cursor-pointer transition-transform ${openAccordion === index ? 'rotate-180' : ''} text-[18px] text-[#9a9a9a]`}
                />
              </div>

              {openAccordion === index && (
                <div className="py-[16px] px-[20px] bg-white">
                  {age >= 18 && editingCelebrity === celebrity.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-base text-[#848484]">Age</label>
                          <input
                            type="date"
                            id='dob'
                            value={editedValues.dob}
                            onChange={(e) => handleInputChange(e, 'dob')}
                            className="outline-none border border-gray-300 p-2 w-full rounded-[10px]"
                          />
                          {errors?.dob && <p>{errors?.dob}</p>}
                        </div>
                        <div>
                          <p className="text-base text-[#848484]">Gender</p>
                          <select
                            id='gender'
                            value={editedValues.gender}
                            onChange={(e) => handleInputChange(e, 'gender')}
                            className="outline-none h-[43px] border border-gray-300 p-2 w-full rounded-[10px]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                            <option value="Rather not say">Rather not say</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors?.gender && <p>{errors?.gender}</p>}
                        </div>
                        <div>
                          <p className="text-base text-[#848484]">Country</p>
                          <input
                            id='country'
                            type="text"
                            value={editedValues.country}
                            onChange={(e) => handleInputChange(e, 'country')}
                            className="outline-none border border-gray-300 p-2 w-full rounded-[10px]"
                          />
                          {errors.country && <p>{errors.country}</p>}
                        </div>
                      </div>
                      <div>
                        <p className="text-base text-[#848484]">Description</p>
                        <textarea
                          id='description'
                          value={editedValues.description}
                          onChange={(e) => handleInputChange(e, 'description')}
                          className="outline-none border border-gray-300 p-2 w-full rounded-[10px] min-h-[150px]"
                        />
                        {errors?.description && <p>{errors?.description}</p>}
                      </div>
                      <div className="flex justify-end gap-[15px]">
                        <FaTimesCircle
                          className="text-red-500 cursor-pointer text-lg"
                          onClick={() => setEditingCelebrity(null)}
                        />
                        <FaCheckCircle
                          className="text-green-500 cursor-pointer text-lg"
                          onClick={() => handleSave(celebrity.id)}
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-base text-[#848484]">Age</p>
                          <p className="text-black">{age}</p>
                        </div>
                        <div>
                          <p className="text-base text-[#848484]">Gender</p>
                          <p className="text-black">{celebrity?.gender}</p>
                        </div>
                        <div>
                          <p className="text-base text-[#848484]">Country</p>
                          <p className="text-black">{celebrity?.country}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-base text-[#848484]">Description</p>
                        <p className="text-black">{celebrity?.description}</p>
                      </div>
                      <div className="flex justify-end gap-[15px]">
                        <FaTrash
                          className="text-red-500 cursor-pointer text-lg"
                          onClick={() => openDeleteConfirmation(celebrity.id)} // Trigger delete popup
                        />
                        <FaPen
                          className="text-blue-500 cursor-pointer text-lg"
                          onClick={() => handleEditClick(celebrity)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirmationOpen && (
        <div className="border fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white px-5 py-3 rounded-lg shadow-lg max-w-[400px] w-full relative">
            <div className='flex justify-between items-center'>
              <p className="text-base text-gray-700">Are you sure you want to delete?</p>
              <button
                className="text-[28px]"
                onClick={() => setDeleteConfirmationOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="flex justify-end items-center gap-4 mt-[40px]">
              <button
                className="border-[2px] text-gray-700 px-[22px] py-[6px] rounded-lg hover:bg-gray-300"
                onClick={() => setDeleteConfirmationOpen(false)} // Cancel button
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-[22px] py-[6px] rounded-lg hover:bg-red-600"
                onClick={() => handleCelebrityDelete(celebrityToDelete!)} // Delete button
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
