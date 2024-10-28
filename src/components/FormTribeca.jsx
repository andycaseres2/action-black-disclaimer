import React, { useEffect, useRef, useState } from 'react'
import SignaturePad from './SignaturePad'
import Document from './Document'
import html2canvas from 'html2canvas' // Importar html2canvas
import LoadingModal from './LoadingModal'

const FormTribeca = () => {
	const [viewDocument, setViewDocument] = useState(false)
	const [reset, setReset] = useState(false)
	const [signature, setSignature] = useState(null)
	const [formImageURL, setFormImageURL] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const fileInputRef = useRef(null)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		phoneNumber: '',
		email: '',
		signed_contract_file: null,
		user_identification_file: null,
		action_auto_branch_id: 40
	})
	const [message, setMessage] = useState(null)

	const resetForm = () => {
		setReset(true)
		setFormData({
			first_name: '',
			last_name: '',
			phoneNumber: '',
			email: '',
			signed_contract_file: null,
			user_identification_file: null,
			action_auto_branch_id: 40
		})
		window.location.reload()
	}

	const validateForm = () => {
		const requiredFields = [
			'first_name',
			'last_name',
			'phoneNumber',
			'email',
			'signed_contract_file'
		]

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Expresión regular para validar el formato de correo electrónico

		for (let field of requiredFields) {
			const value = formData[field]

			// Verificar si el campo está vacío o es una cadena vacía (después de aplicar trim() en caso de ser string)
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				return false // Si algún campo está vacío o es una cadena vacía, retorna false
			}

			// Validar formato del correo electrónico
			if (field === 'email' && !emailPattern.test(value)) {
				return false // Si el correo no tiene un formato válido, retorna false
			}
		}

		return true // Todos los campos están completos y no son cadenas vacías
	}

	const handleSignatureSave = async (formImage) => {
		await setFormData({
			...formData,
			signed_contract_file: formImage // Guardar la firma en el estado
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target

		// Verificar si el campo es 'phoneNumber'
		if (name === 'phoneNumber') {
			// Filtrar el valor para permitir solo números
			const numericValue = value.replace(/[^0-9]/g, '')
			setFormData({
				...formData,
				[name]: numericValue // Actualizar solo con números
			})
		} else {
			// Para otros campos, actualizar normalmente
			setFormData({
				...formData,
				[name]: value
			})
		}
	}

	const handleSubmit = async () => {
		const urlBase = import.meta.env.PUBLIC_URL_BASE
		if (validateForm()) {
			const formDataToSend = new FormData()

			// Agrega los datos de texto
			formDataToSend.append('first_name', formData.first_name)
			formDataToSend.append('last_name', formData.last_name)
			formDataToSend.append('phoneNumber', formData.phoneNumber)
			formDataToSend.append('email', formData.email)
			formDataToSend.append('action_auto_branch_id', formData.action_auto_branch_id)

			// Agrega los archivos
			formDataToSend.append('signed_contract_file', formData.signed_contract_file)
			formDataToSend.append('user_identification_file', formData.user_identification_file)

			try {
				const response = await fetch(`${urlBase}api/expedite/v1/glofox-contract-signatures`, {
					method: 'POST',
					body: formDataToSend
				})

				if (response.ok) {
					setMessage({
						text: 'Thank you for signing up',
						type: 'success'
					})
				} else {
					const errorResponse = await response.json()
					setMessage({
						text: errorResponse.errors[0].description,
						type: 'error'
					})
				}
			} catch (error) {
				console.error('Error en la conexión', error)
			}
		}
	}

	// Captura de imagen del formulario usando html2canvas
	const captureFormImage = async () => {
		const formElement = document.getElementById('form')
		if (formElement) {
			const canvas = await html2canvas(formElement)
			return new Promise((resolve) => {
				canvas.toBlob(
					(blob) => {
						const imageURL = URL.createObjectURL(blob) // Crear una URL temporal para la imagen
						// setFormImageURL(imageURL);
						resolve(blob)
					},
					'image/jpeg', // Cambiar a formato JPG
					1.0 // Máxima calidad
				)
			})
		}
	}

	const handleSignature = async () => {
		// Capturar imagen del formulario antes de guardar la firma
		const formImageBlob = await captureFormImage()

		// Guardar la imagen como parte del archivo firmado
		await handleSignatureSave(formImageBlob)
	}

	useEffect(() => {
		if (!signature) return
		handleSignature()
	}, [signature])

	const handleActionCapture = async () => {
		if (fileInputRef.current) {
			await fileInputRef.current.click()
		}
	}

	const handleIDCapture = (event) => {
		const idDocument = event.target.files[0] // Obtener el primer archivo seleccionado

		if (idDocument) {
			// Guardar el objeto File y la URL en el estado
			setFormData((prevData) => ({
				...prevData,
				user_identification_file: idDocument // Guardar el objeto File
			}))
			if (!isSubmitting) {
				setIsSubmitting(true)
			}
		} else {
			console.error('No se seleccionó un archivo válido.')
		}
	}

	return (
		<div className="flex w-full flex-col items-start justify-center py-6">
			<div id="form" className="flex w-full flex-col items-start justify-center py-4">
				<div className="flex items-center px-4">
					<img src="/logo_usa.png" alt="logo_usa" />
				</div>
				<div
					className={`${viewDocument ? 'hidden' : 'flex'} w-fill mx-auto flex-col bg-white p-6 px-10 text-base`}
				>
					{/* Facility Info */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Facility:</strong> Action Black Tribeca Llc
						</p>
						<p className="text-gray-700">
							<strong>Location:</strong> 152 Franklin St, NY, New York
						</p>
					</div>

					{/* Waiver Intro */}
					<div className="mb-4">
						<p className="text-gray-700">
							I, the undersigned, wish to use the facilities and participate in activities provided
							by Action Black Tribeca Llc. By signing this waiver, I acknowledge and agree to the
							following terms:
						</p>
					</div>

					{/* Assumption of Risk */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Assumption of Risk:</strong> I acknowledge, understand, and assume sole
							responsibility for any accidents and incidents within the facilities. I acknowledge
							that using gym facilities, equipment, and participating in physical activity may cause
							injury, strain, discomfort, and the possibility of serious injury or death. I assume
							all risks and responsibility for any injuries or other medical incidents.
						</p>
					</div>

					{/* Waiver and Release */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Waiver and Release:</strong> I hereby release, waive, discharge, and agree not
							to sue the provider, its employees, representatives, affiliates, or agents from any
							claims, demands, liabilities, damages, expenses, and causes of action of any nature
							arising from my use of the gym facilities, whether caused by the negligence of the
							provider or otherwise.
						</p>
					</div>

					{/* Medical Representation */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Medical Representation:</strong> I represent that I am physically fit to use
							the gym facilities and participate in physical exercise. I have no medical condition
							that would prevent my safe participation. If I have any medical conditions or
							concerns, I have consulted with a healthcare provider and obtained clearance to
							participate.
						</p>
					</div>

					{/* Rules and Regulations */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Rules and Regulations:</strong> I accept the general regulations of Action
							Black services.
							<a href="https://example.com" className="text-indigo-600 underline">
								See regulations
							</a>
							. I agree to abide by all rules, regulations, and policies of the provider, including
							proper use of equipment, following safety guidelines, and respecting other members and
							staff.
						</p>
					</div>

					{/* Consent to Medical Treatment */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Consent to Medical Treatment:</strong> I hereby consent to receive any
							necessary medical treatment resulting from my use of the gym facilities and agree to
							bear all costs associated with such treatment.
						</p>
					</div>

					{/* Acknowledgment */}
					<div className="mb-4">
						<p className="text-gray-700">
							<strong>Acknowledgment:</strong> I have read this gym waiver and release agreement,
							understand its contents, and agree to be bound by its terms. I understand that I am
							giving up substantial legal rights by signing this document.
						</p>
					</div>

					{/* Data Consent */}
					<div className="mb-4">
						<p className="text-gray-700">
							I accept that my data may be used to send information by Action Black.
						</p>
					</div>

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

					{/* Signature */}
					<div className="mb-4 flex flex-col items-start gap-4">
						<label className="mr-2 block font-medium text-gray-700">
							By affixing my signature hereto, I attest that I have thoroughly reviewed and
							comprehended:
						</label>
						<SignaturePad reset={reset} setReset={setReset} setSignature={setSignature} />
					</div>

					{isSubmitting && (
						<LoadingModal
							resetForm={resetForm}
							handleSubmit={handleSubmit}
							onClose={() => setIsSubmitting(false)}
							message={message}
						/>
					)}
					{/* {formImageURL && (
						<div className="mt-4">
							<img
								src={formImageURL}
								alt="Captura del formulario"
								className="border border-gray-300"
							/>
						</div>
					)} */}
				</div>

				{/* Input de archivo oculto para capturar la foto */}
				<input
					type="file"
					accept="image/*"
					capture="environment" // Usar la cámara trasera
					ref={fileInputRef}
					onChange={handleIDCapture}
					style={{ display: 'none' }} // Input oculto
				/>
			</div>
			{/* Submit Button */}
			<div className="flex w-full justify-end px-10 py-2">
				<button
					disabled={validateForm() ? false : true}
					onClick={handleActionCapture}
					className="mt-4 w-1/3 rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
				>
					Submit
				</button>
			</div>
		</div>
	)
}

export default FormTribeca
