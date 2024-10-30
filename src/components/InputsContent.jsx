import React from 'react'

const InputsContent = ({ formData, handleChange }) => {
	return (
		<div className="flex w-full flex-col gap-2 py-2">
			{/* Signature and User Information */}
			<div className="mb-4 flex items-center">
				<label className="mr-2 block font-medium text-gray-700">I,</label>
				<input
					type="text"
					name="first_name"
					value={formData.first_name}
					onChange={handleChange}
					placeholder="First Name"
					className="flex-1 rounded-none border-b border-gray-300 p-2 focus:border-b-2 focus:border-indigo-500 focus:outline-none"
				/>
				<input
					type="text"
					name="last_name"
					value={formData.last_name}
					onChange={handleChange}
					placeholder="Last Name"
					className="ml-2 flex-1 rounded-none border-b border-gray-300 p-2 focus:border-b-2 focus:border-indigo-500 focus:outline-none"
				/>
			</div>

			<div className="mb-4 flex items-center">
				<input
					type="text"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					placeholder="Phone Number"
					className="flex-1 rounded-none border-b border-gray-300 p-2 focus:border-b-2 focus:border-indigo-500 focus:outline-none"
				/>
			</div>

			<div className="mb-4 flex items-center">
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Email"
					className="flex-1 rounded-none border-b border-gray-300 p-2 focus:border-b-2 focus:border-indigo-500 focus:outline-none"
					required
				/>
			</div>
		</div>
	)
}

export default InputsContent
