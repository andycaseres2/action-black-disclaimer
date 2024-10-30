import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas' // Importar html2canvas
import LoadingModal from './LoadingModal'
import InputsContent from './InputsContent'
import SignatureContent from './SignatureContent'
import FlatironContent from './FlatironContent'

const FormFlatiron = () => {
	const [signature, setSignature] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const fileInputRef = useRef(null)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		phoneNumber: '',
		email: '',
		signed_contract_file: null,
		user_identification_file: null,
		action_auto_branch_id: 50
	})
	const [message, setMessage] = useState(null)

	const resetForm = () => {
		setFormData({
			first_name: '',
			last_name: '',
			phoneNumber: '',
			email: '',
			signed_contract_file: null,
			user_identification_file: null,
			action_auto_branch_id: 50
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
			signed_contract_file: formImage
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
			// Ajustar el escalado del contenido para que se vea completo en el canvas
			const scale = window.devicePixelRatio // Esto ajusta la resolución a la densidad de píxeles del dispositivo
			const canvas = await html2canvas(formElement, {
				scale, // Escalar para dispositivos de alta resolución
				scrollX: -window.scrollX, // Asegura que capture toda la pantalla
				scrollY: -window.scrollY,
				width: formElement.scrollWidth, // Tamaño completo del ancho
				height: formElement.scrollHeight, // Tamaño completo de la altura
				useCORS: true // Permite capturar contenido de otros orígenes
			})

			return new Promise((resolve, reject) => {
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error('Could not create image blob.'))
							return
						}
						const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
						resolve(file)
					},
					'image/jpeg',
					1.0
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
				<div className={`w-fill mx-auto flex-col bg-white p-6 px-10 text-base`}>
					<FlatironContent />
					<InputsContent formData={formData} handleChange={handleChange} />
					<SignatureContent setSignature={setSignature} />

					{isSubmitting && (
						<LoadingModal
							resetForm={resetForm}
							handleSubmit={handleSubmit}
							onClose={() => setIsSubmitting(false)}
							message={message}
						/>
					)}
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

export default FormFlatiron
